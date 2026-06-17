const { BorrowingSlip, Borrowing, Book, BookTitle, Member, User, PenaltyRule, PunishmentSlip } = require('../models');
const { Op } = require('sequelize');

const getNextMaPhieu = async (Model, field, prefix) => {
    const tableName = Model.getTableName();
    const [[row]] = await Model.sequelize.query(
        `SELECT MAX([${field}]) AS maxMa FROM [${tableName}]`
    );
    const last = row?.maxMa;
    const max = last ? parseInt(last.replace(prefix, ''), 10) : 0;
    return `${prefix}${String(max + 1).padStart(4, '0')}`;
};


const includeAll = [
    { model: Member, attributes: ['MaThanhVien', 'HoTen', 'SoDienThoai'] },
    { model: User, as: 'NguoiLap', attributes: ['MaNhanVien', 'TenNhanVien'] },
    { model: User, as: 'NguoiThu', attributes: ['MaNhanVien', 'TenNhanVien'] },
    {
        model: Borrowing,
        include: [{
            model: Book,
            attributes: ['MaCuonSach', 'TinhTrang'],
            include: [{ model: BookTitle, attributes: ['TenSach'] }]
        }]
    }
];

const getAllBorrowingSlips = async (req, res) => {
    try {
        res.json(await BorrowingSlip.findAll({ include: includeAll }));
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const getBorrowingSlipById = async (req, res) => {
    try {
        const slip = await BorrowingSlip.findByPk(req.params.id, { include: includeAll });
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
        res.json(slip);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const getMyBorrowingSlips = async (req, res) => {
    try {
        const slips = await BorrowingSlip.findAll({
            where: { MaThanhVien: req.user.MaThanhVien },
            include: includeAll
        });
        res.json(slips);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const searchBorrowingSlips = async (req, res) => {
    try {
        const { mathanhvien, maphieu, tungay, denngay } = req.query;
        const where = {};
        if (maphieu)     where.MaPhieu     = { [Op.like]: `%${maphieu}%` };
        if (mathanhvien) where.MaThanhVien = mathanhvien;
        if (tungay || denngay) {
            where.NgayLapPhieu = {};
            if (tungay)  where.NgayLapPhieu[Op.gte] = new Date(tungay);
            if (denngay) where.NgayLapPhieu[Op.lte] = new Date(denngay);
        }
        res.json(await BorrowingSlip.findAll({ where, include: includeAll }));
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const createBorrowingSlip = async (req, res) => {
    try {
        const { MaThanhVien, MaCuonSach, HanTra } = req.body;

        if (!MaThanhVien || !MaCuonSach || !HanTra)
            return res.status(400).json({ message: 'Thiếu thông tin phiếu mượn' });

        const cuonSach = Array.isArray(MaCuonSach) ? MaCuonSach : [MaCuonSach];

        for (const ma of cuonSach) {
            const book = await Book.findByPk(ma);
            if (!book) return res.status(404).json({ message: `Không tìm thấy cuốn sách ${ma}` });
            if (book.TinhTrang !== 'Sẵn sàng')
                return res.status(400).json({ message: `Cuốn sách ${ma} không sẵn sàng để mượn` });
        }

        const MaPhieu = await getNextMaPhieu(BorrowingSlip, 'MaPhieu', 'PM');

        const slip = await BorrowingSlip.create({
            MaPhieu,
            NgayLapPhieu: new Date(),
            MaThanhVien,
            MaNhanVienLap: req.user.MaNhanVien,
            TrangThai: 'Đang mượn'  // FIX: khởi tạo TrangThai
        });

        for (const ma of cuonSach) {
            await Borrowing.create({ MaPhieu, MaCuonSach: ma, HanTra });
            await Book.update({ TinhTrang: 'Đang mượn' }, { where: { MaCuonSach: ma } });
        }

        const result = await BorrowingSlip.findByPk(MaPhieu, { include: includeAll });
        res.status(201).json(result);
    } catch (err) {
        console.log(JSON.stringify(err.parent?.errors, null, 2));
        res.status(500).json({ message: err.message });
    }
};

const returnBooks = async (req, res) => {
    try {
        const slip = await BorrowingSlip.findByPk(req.params.id);
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });

        // FIX: nhận mảng DanhSachSach thay vì 1 MaCuonSach
        const { DanhSachSach, TinhTrangKhiTra } = req.body;
        if (!DanhSachSach || !DanhSachSach.length)
            return res.status(400).json({ message: 'Thiếu danh sách cuốn sách cần trả' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const { MaCuonSach } of DanhSachSach) {
            const borrowing = await Borrowing.findOne({
                where: { MaPhieu: req.params.id, MaCuonSach }
            });
            if (!borrowing) continue;

            const hanTra = new Date(borrowing.HanTra);
            hanTra.setHours(0, 0, 0, 0);
            const isLate = today > hanTra;

            // FIX: map tình trạng frontend → backend
            // Frontend gửi: 'Tốt' | 'Có hư hỏng nhẹ' | 'Hư hỏng nặng' | 'Mất sách'
            // PenaltyRule dùng: 'Hỏng' | 'Mất'
            const tinhTrangMap = {
                'Tốt':             'Tốt',
                'Có hư hỏng nhẹ': 'Có hư hỏng nhẹ',
                'Hư hỏng nặng':   'Hỏng',
                'Mất sách':        'Mất'
            };
            const tinhTrangDB = tinhTrangMap[TinhTrangKhiTra] || TinhTrangKhiTra;

            await Borrowing.update(
                { NgayTraThucTe: new Date(), TinhTrangKhiTra: TinhTrangKhiTra },
                { where: { MaPhieu: req.params.id, MaCuonSach } }
            );

            let tienPhat = 0;

            // Phạt quá hạn — TenHinhPhat trong PenaltyRule là 'Phạt quá hạn', MucPhat là tiền/ngày
            if (isLate) {
                const soNgayTre = Math.ceil((today - hanTra) / (1000 * 60 * 60 * 24));
                const lateRule = await PenaltyRule.findOne({
                    where: { TenHinhPhat: 'Phạt quá hạn' }
                });
                if (lateRule) {
                    const tienPhatLate = lateRule.MucPhat * soNgayTre;
                    tienPhat += tienPhatLate;
                    const MaPhieuPhat = await getNextMaPhieu(PunishmentSlip, 'MaPhieuPhat', 'PP');
                    await PunishmentSlip.create({
                        MaPhieuPhat,
                        NgayLapPhieu: new Date(),
                        TongTienPhat: tienPhatLate,
                        TrangThaiThanhToan: 'Chưa thanh toán',
                        TenHinhPhat: 'Phạt quá hạn',
                        MaPhieu: req.params.id,
                        MaCuonSach
                    });
                }
            }

            // Phạt hư hỏng / mất — TenHinhPhat khớp đúng giá trị dropdown: 'Có hư hỏng nhẹ', 'Hỏng', 'Mất'
            if (['Có hư hỏng nhẹ', 'Hỏng', 'Mất'].includes(TinhTrangKhiTra)) {
                const damageRule = await PenaltyRule.findOne({
                    where: { TenHinhPhat: TinhTrangKhiTra }
                });
                if (damageRule) {
                    tienPhat += damageRule.MucPhat;
                    const MaPhieuPhat = await getNextMaPhieu(PunishmentSlip, 'MaPhieuPhat', 'PP');
                    await PunishmentSlip.create({
                        MaPhieuPhat,
                        NgayLapPhieu: new Date(),
                        TongTienPhat: damageRule.MucPhat,
                        TrangThaiThanhToan: 'Chưa thanh toán',
                        TenHinhPhat: TinhTrangKhiTra, // 'Có hư hỏng nhẹ' | 'Hỏng' | 'Mất'
                        MaPhieu: req.params.id,
                        MaCuonSach
                    });
                }

                const book = await Book.findByPk(MaCuonSach);
                if (book && !['Hỏng', 'Mất'].includes(book.TinhTrang)) {
                    // Chỉ Hỏng/Mất mới đổi TinhTrang sách, hư hỏng nhẹ vẫn để sẵn sàng
                    const newTinhTrang = TinhTrangKhiTra === 'Có hư hỏng nhẹ' ? 'Sẵn sàng' : TinhTrangKhiTra;
                    await book.update({ TinhTrang: newTinhTrang });
                    if (['Hỏng', 'Mất'].includes(TinhTrangKhiTra)) {
                        const bookTitle = await BookTitle.findByPk(book.MaDauSach);
                        if (bookTitle && bookTitle.SoLuong > 0)
                            await BookTitle.decrement('SoLuong', { where: { MaDauSach: book.MaDauSach } });
                    }
                }
            } else {
                await Book.update({ TinhTrang: 'Sẵn sàng' }, { where: { MaCuonSach } });
            }

            if (tienPhat > 0) {
                await Borrowing.update(
                    { TienPhatPhatSinh: tienPhat },
                    { where: { MaPhieu: req.params.id, MaCuonSach } }
                );
            }
        }

        await slip.update({ MaNhanVienThu: req.user.MaNhanVien });

        // FIX: cập nhật TrangThai phiếu — Trả muộn nếu có sách trả muộn, Đã trả nếu hết
        const remaining = await Borrowing.findAll({
            where: { MaPhieu: req.params.id, NgayTraThucTe: null }
        });

        if (remaining.length === 0) {
            const hasLate = await PunishmentSlip.findOne({
                where: { MaPhieu: req.params.id, TenHinhPhat: 'Phạt quá hạn' }
            });
            await slip.update({ TrangThai: hasLate ? 'Trả muộn' : 'Đã trả' });
        }

        const result = await BorrowingSlip.findByPk(req.params.id, { include: includeAll });
        res.json(result);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteBorrowingSlip = async (req, res) => {
    try {
        const slip = await BorrowingSlip.findByPk(req.params.id);
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });

        const unpaid = await PunishmentSlip.findOne({
            where: { MaPhieu: req.params.id, TrangThaiThanhToan: 'Chưa thanh toán' }
        });
        if (unpaid) return res.status(400).json({ message: 'Còn phiếu phạt chưa thanh toán' });

        const notReturned = await Borrowing.findOne({
            where: { MaPhieu: req.params.id, NgayTraThucTe: null }
        });
        if (notReturned) return res.status(400).json({ message: 'Còn sách chưa được trả' });

        await PunishmentSlip.destroy({ where: { MaPhieu: req.params.id } });
        await Borrowing.destroy({ where: { MaPhieu: req.params.id } });
        await slip.destroy();

        res.json({ message: 'Xóa phiếu mượn thành công' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getAllBorrowingSlips, getMyBorrowingSlips, getBorrowingSlipById, searchBorrowingSlips, createBorrowingSlip, returnBooks, deleteBorrowingSlip };
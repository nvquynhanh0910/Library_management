const { BorrowingSlip, Borrowing, Book, BookTitle, Member, User, PenaltyRule, PunishmentSlip } = require('../models');
const { Op } = require('sequelize');

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

        const count = await BorrowingSlip.count();
        const MaPhieu = `PM${String(count + 1).padStart(4, '0')}`;

        const slip = await BorrowingSlip.create({
            MaPhieu,
            NgayLapPhieu: new Date(),
            MaThanhVien,
            MaNhanVienLap: req.user.MaNhanVien
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

        const { MaCuonSach, TinhTrangKhiTra } = req.body;
        if (!MaCuonSach) return res.status(400).json({ message: 'Thiếu mã cuốn sách' });

        await Borrowing.update(
            { NgayTraThucTe: new Date(), TinhTrangKhiTra: TinhTrangKhiTra || 'Tốt' },
            { where: { MaPhieu: req.params.id, MaCuonSach } }
        );

        if (['Hỏng', 'Mất'].includes(TinhTrangKhiTra)) {
            // Tìm quy tắc phạt và tạo phiếu phạt tự động
            const penaltyRule = await PenaltyRule.findOne({ where: { TenHinhPhat: TinhTrangKhiTra } });
            if (penaltyRule) {
                const count = await PunishmentSlip.count();
                const MaPhieuPhat = `PP${String(count + 1).padStart(4, '0')}`;

                await PunishmentSlip.create({
                    MaPhieuPhat,
                    NgayLapPhieu: new Date(),
                    TongTienPhat: penaltyRule.MucPhat,
                    TrangThaiThanhToan: 'Chưa thanh toán',
                    TenHinhPhat: TinhTrangKhiTra,
                    MaPhieu: req.params.id,
                    MaCuonSach
                });

                await Borrowing.update(
                    { TienPhatPhatSinh: penaltyRule.MucPhat },
                    { where: { MaPhieu: req.params.id, MaCuonSach } }
                );
            }

            // Đổi tình trạng sách thành Hỏng/Mất, giảm SoLuong
            const book = await Book.findByPk(MaCuonSach);
            if (book) {
                // Chỉ giảm SoLuong nếu sách chưa bị Hỏng/Mất trước đó
                if (!['Hỏng', 'Mất'].includes(book.TinhTrang)) {
                    await book.update({ TinhTrang: TinhTrangKhiTra });
                    const bookTitle = await BookTitle.findByPk(book.MaDauSach);
                    if (bookTitle && bookTitle.SoLuong > 0)
                        await BookTitle.decrement('SoLuong', { where: { MaDauSach: book.MaDauSach } });
                }
            }
        } else {
            await Book.update({ TinhTrang: 'Sẵn sàng' }, { where: { MaCuonSach } });
        }

        await slip.update({ MaNhanVienThu: req.user.MaNhanVien });

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

        // 1. Xóa PhieuPhat trước (tham chiếu cả MaPhieu lẫn MaCuonSach)
        await PunishmentSlip.destroy({ where: { MaPhieu: req.params.id } });
        // 2. Xóa MuonSach
        await Borrowing.destroy({ where: { MaPhieu: req.params.id } });
        // 3. Xóa PhieuMuon
        await slip.destroy();

        res.json({ message: 'Xóa phiếu mượn thành công' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};
module.exports = { getAllBorrowingSlips, getMyBorrowingSlips, getBorrowingSlipById, searchBorrowingSlips, createBorrowingSlip, returnBooks, deleteBorrowingSlip };
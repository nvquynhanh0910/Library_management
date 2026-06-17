const { PunishmentSlip, PenaltyRule, BorrowingSlip, Borrowing, Book, BookTitle, Member } = require('../models');
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


const includeDetail = [
    { model: PenaltyRule, attributes: ['TenHinhPhat', 'MucPhat'] },
    {
        model: BorrowingSlip,
        attributes: ['MaPhieu', 'NgayLapPhieu', 'MaThanhVien'],
        include: [{ model: Member, attributes: ['HoTen', 'SoDienThoai'] }]
    }
];

// GET /api/punishment-slips
const getAllPunishmentSlips = async (req, res) => {
    try {
        res.json(await PunishmentSlip.findAll({ include: includeDetail }));
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/punishment-slips/:id
const getPunishmentSlipById = async (req, res) => {
    try {
        const slip = await PunishmentSlip.findByPk(req.params.id, { include: includeDetail });
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu phạt' });
        res.json(slip);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/punishment-slips/my
const getMyPunishmentSlips = async (req, res) => {
    try {
        const slips = await PunishmentSlip.findAll({
            where: {
                MaPhieu: { [Op.in]: require('sequelize').literal(
                    `(SELECT MaPhieu FROM PhieuMuon WHERE MaThanhVien = '${req.user.MaThanhVien}')`
                )}
            },
            include: includeDetail
        });
        res.json(slips);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/punishment-slips/search
const searchPunishmentSlips = async (req, res) => {
    try {
        const { TrangThaiThanhToan, MaPhieu, TuNgay, DenNgay } = req.query;
        const where = {};
        if (TrangThaiThanhToan) where.TrangThaiThanhToan = TrangThaiThanhToan;
        if (MaPhieu)            where.MaPhieu            = MaPhieu;
        if (TuNgay || DenNgay) {
            where.NgayLapPhieu = {};
            if (tungay)  where.NgayLapPhieu[Op.gte] = new Date(TuNgay);
            if (denngay) where.NgayLapPhieu[Op.lte] = new Date(DenNgay);
        }
        res.json(await PunishmentSlip.findAll({ where, include: includeDetail }));
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/punishment-slips
// Input: { MaPhieu, MaCuonSach, TinhTrangKhiTra }
const createPunishmentSlip = async (req, res) => {
    try {
        const { MaPhieu, MaCuonSach, TinhTrangKhiTra } = req.body;

        if (!MaPhieu || !MaCuonSach || !TinhTrangKhiTra)
            return res.status(400).json({ message: 'Thiếu thông tin phiếu phạt' });

        // Kiểm tra phiếu mượn
        const borrowingSlip = await BorrowingSlip.findByPk(MaPhieu);
        if (!borrowingSlip) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });

        // Tìm quy tắc phạt theo tình trạng
        const penaltyRule = await PenaltyRule.findOne({ where: { TenHinhPhat: TinhTrangKhiTra } });
        if (!penaltyRule) return res.status(404).json({ message: 'Không tìm thấy quy tắc phạt cho tình trạng này' });

        const TongTienPhat = penaltyRule.MucPhat;

        // Tự generate MaPhieuPhat
        const MaPhieuPhat = await getNextMaPhieu(PunishmentSlip, 'MaPhieuPhat', 'PP');

        const slip = await PunishmentSlip.create({
            MaPhieuPhat,
            NgayLapPhieu: new Date(),
            TongTienPhat,
            TrangThaiThanhToan: 'Chưa thanh toán',
            TenHinhPhat: TinhTrangKhiTra,
            MaPhieu,
            MaCuonSach
        });

        // Cập nhật tiền phạt vào MuonSach
        await Borrowing.update(
            { TienTraPhatSinh: TongTienPhat },
            { where: { MaPhieu, MaCuonSach } }
        );

        // Nếu sách hỏng hoặc mất → giảm SoLuong và xóa cuốn sách
        if (['Hỏng', 'Mất'].includes(TinhTrangKhiTra)) {
            const book = await Book.findByPk(MaCuonSach);
            if (book) {
                const bookTitle = await BookTitle.findByPk(book.MaDauSach);
                if (bookTitle && bookTitle.SoLuong > 0)
                    await BookTitle.decrement('SoLuong', { where: { MaDauSach: book.MaDauSach } });
                await book.destroy();
            }
        }

        res.status(201).json(slip);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/punishment-slips/:id/pay
const markAsPaid = async (req, res) => {
    try {
        const slip = await PunishmentSlip.findByPk(req.params.id);
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu phạt' });
        await slip.update({ TrangThaiThanhToan: 'Đã thanh toán' });
        res.json(slip);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/punishment-slips/:id
const updatePunishmentSlip = async (req, res) => {
    try {
        const slip = await PunishmentSlip.findByPk(req.params.id);
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu phạt' });
        const { TongTienPhat, TrangThaiThanhToan, TenHinhPhat } = req.body;
        await slip.update({
            ...(TongTienPhat && { TongTienPhat }),
            ...(TrangThaiThanhToan && { TrangThaiThanhToan }),
            ...(TenHinhPhat && { TenHinhPhat })
        });
        res.json(slip);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/punishment-slips/:id
const deletePunishmentSlip = async (req, res) => {
    try {
        const slip = await PunishmentSlip.findByPk(req.params.id);
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu phạt' });
        await slip.destroy();
        res.json({ message: 'Xóa phiếu phạt thành công' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getAllPunishmentSlips, getMyPunishmentSlips, getPunishmentSlipById, searchPunishmentSlips, createPunishmentSlip, markAsPaid, updatePunishmentSlip, deletePunishmentSlip };
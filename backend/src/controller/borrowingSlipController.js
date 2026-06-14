const { BorrowingSlip, Borrowing, Book, BookTitle, Member, User } = require('../models');
const { Op } = require('sequelize');

const includeAll = [
    {
        model: Member,
        attributes: ['MaThanhVien', 'HoTen', 'SoDienThoai']
    },
    {
        model: User,
        as: 'NguoiLap',
        attributes: ['MaNhanVien', 'TenNhanVien']
    },
    {
        model: User,
        as: 'NguoiThu',
        attributes: ['MaNhanVien', 'TenNhanVien']
    },
    {
        model: Borrowing,
        include: [{
            model: Book,
            attributes: ['MaCuonSach', 'TinhTrang'],
            include: [{ model: BookTitle, attributes: ['TenSach'] }]
        }]
    }
];

// GET /api/borrowing-slips
const getAllBorrowingSlips = async (req, res) => {
    try {
        const slips = await BorrowingSlip.findAll({ include: includeAll });
        res.json(slips);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/borrowing-slips/:id
const getBorrowingSlipById = async (req, res) => {
    try {
        const slip = await BorrowingSlip.findByPk(req.params.id, { include: includeAll });
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
        res.json(slip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/borrowing-slips/my — độc giả xem phiếu mượn của mình
const getMyBorrowingSlips = async (req, res) => {
    try {
        const slips = await BorrowingSlip.findAll({
            where: { MaThanhVien: req.user.MaThanhVien },
            include: includeAll
        });
        res.json(slips);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/borrowing-slips/search?mathanhvien=&tungay=&denngay=&maphieu=
const searchBorrowingSlips = async (req, res) => {
    try {
        const { mathanhvien, maphieu, tungay, denngay } = req.query;
        const where = {};
        if (maphieu)     where.MaPhieu      = { [Op.like]: `%${maphieu}%` };
        if (mathanhvien) where.MaThanhVien  = mathanhvien;
        if (tungay || denngay) {
            where.NgayLapPhieu = {};
            if (tungay)  where.NgayLapPhieu[Op.gte] = new Date(tungay);
            if (denngay) where.NgayLapPhieu[Op.lte] = new Date(denngay);
        }
        const slips = await BorrowingSlip.findAll({ where, include: includeAll });
        res.json(slips);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/borrowing-slips
// Body: { MaPhieu, NgayLapPhieu, MaThanhVien, sach: [{ MaCuonSach, HinhThucMuon, HanTra }] }
const createBorrowingSlip = async (req, res) => {
    try {
        const { MaPhieu, NgayLapPhieu, MaThanhVien, sach } = req.body;
        if (!MaPhieu || !NgayLapPhieu || !MaThanhVien)
            return res.status(400).json({ message: 'Thiếu thông tin phiếu mượn' });
        if (!sach || sach.length === 0)
            return res.status(400).json({ message: 'Phiếu mượn phải có ít nhất 1 cuốn sách' });

        const MaNhanVienLap = req.user.MaNhanVien;

        const slip = await BorrowingSlip.create({ MaPhieu, NgayLapPhieu, MaThanhVien, MaNhanVienLap });

        for (const s of sach) {
            await Borrowing.create({
                MaPhieu,
                MaCuonSach: s.MaCuonSach,
                HinhThucMuon: s.HinhThucMuon || 'Mang về',
                HanTra: s.HanTra
            });
            // Cập nhật tình trạng cuốn sách sang "Đang mượn"
            await Book.update({ TinhTrang: 'Đang mượn' }, { where: { MaCuonSach: s.MaCuonSach } });
        }

        const result = await BorrowingSlip.findByPk(MaPhieu, { include: includeAll });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/borrowing-slips/:id/return
// Xử lý trả sách: cập nhật NgayTraThucTe, TinhTrangKhiTra, MaNhanVienThu
// Body: { sach: [{ MaCuonSach, NgayTraThucTe, TinhTrangKhiTra, TienPhatSinh }] }
const returnBooks = async (req, res) => {
    try {
        const slip = await BorrowingSlip.findByPk(req.params.id);
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });

        const { sach } = req.body;
        if (!sach || sach.length === 0)
            return res.status(400).json({ message: 'Thiếu thông tin trả sách' });

        const MaNhanVienThu = req.user.MaNhanVien;

        for (const s of sach) {
            await Borrowing.update(
                {
                    NgayTraThucTe: s.NgayTraThucTe || new Date(),
                    TinhTrangKhiTra: s.TinhTrangKhiTra || 'Tốt',
                    TienTraPhatSinh: s.TienPhatSinh || 0
                },
                { where: { MaPhieu: req.params.id, MaCuonSach: s.MaCuonSach } }
            );
            // Trả về tình trạng "Trong kho"
            await Book.update({ TinhTrang: 'Trong kho' }, { where: { MaCuonSach: s.MaCuonSach } });
        }

        await slip.update({ MaNhanVienThu });

        const result = await BorrowingSlip.findByPk(req.params.id, { include: includeAll });
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/borrowing-slips/:id
const deleteBorrowingSlip = async (req, res) => {
    try {
        const slip = await BorrowingSlip.findByPk(req.params.id);
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
        await Borrowing.destroy({ where: { MaPhieu: req.params.id } });
        await slip.destroy();
        res.json({ message: 'Xóa phiếu mượn thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllBorrowingSlips, getMyBorrowingSlips, getBorrowingSlipById, searchBorrowingSlips, createBorrowingSlip, returnBooks, deleteBorrowingSlip };
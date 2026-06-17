const { Borrowing, Book, BookTitle, BorrowingSlip } = require('../models');
const { Op } = require('sequelize');

const includeDetail = [
    {
        model: Book,
        attributes: ['MaCuonSach', 'TinhTrang'],
        include: [{ model: BookTitle, attributes: ['MaDauSach', 'TenSach'] }]
    },
    {
        model: BorrowingSlip,
        attributes: ['MaPhieu', 'NgayLapPhieu', 'MaThanhVien']
    }
];

// GET /api/borrowings
const getAllBorrowings = async (req, res) => {
    try {
        res.json(await Borrowing.findAll({ include: includeDetail }));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/borrowings/overdue — sách quá hạn chưa trả
const getOverdue = async (req, res) => {
    try {
        const overdue = await Borrowing.findAll({
            where: {
                HanTra: { [Op.lt]: new Date() },
                NgayTraThucTe: null
            },
            include: includeDetail
        });
        res.json(overdue);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/borrowings/my/overdue
const getMyOverdue = async (req, res) => {
    try {
        const overdue = await Borrowing.findAll({
            where: {
                HanTra: { [Op.lt]: new Date() },
                NgayTraThucTe: null
            },
            include: [
                {
                    model: BorrowingSlip,
                    where: { MaThanhVien: req.user.MaThanhVien },
                    required: true,
                    attributes: ['MaPhieu', 'NgayLapPhieu', 'MaThanhVien']
                },
                {
                    model: Book,
                    attributes: ['MaCuonSach', 'TinhTrang'],
                    include: [{ model: BookTitle, attributes: ['TenSach'] }]
                }
            ]
        });
        res.json(overdue);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// GET /api/borrowings/slip/:maPhieu — tất cả sách trong 1 phiếu
const getBorrowingsBySlip = async (req, res) => {
    try {
        const rows = await Borrowing.findAll({
            where: { MaPhieu: req.params.maPhieu },
            include: includeDetail
        });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/borrowings/:maPhieu/:maCuonSach — cập nhật 1 dòng chi tiết
const updateBorrowing = async (req, res) => {
    try {
        const { maPhieu, maCuonSach } = req.params;
        const row = await Borrowing.findOne({ where: { MaPhieu: maPhieu, MaCuonSach: maCuonSach } });
        if (!row) return res.status(404).json({ message: 'Không tìm thấy bản ghi mượn sách' });

        const { HanTra, NgayTraThucTe, TinhTrangKhiTra, TienTraPhatSinh } = req.body;
        await row.update({ HanTra, NgayTraThucTe, TinhTrangKhiTra, TienTraPhatSinh });
        res.json(row);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllBorrowings, getOverdue, getMyOverdue, getBorrowingsBySlip, updateBorrowing };
const { Book, BookTitle, Category, Author, Publisher, WritingBook } = require('../models');
const { Op } = require('sequelize');

// GET /api/books/:id/copies
const getCopiesByTitle = async (req, res) => {
    try {
        const copies = await Book.findAll({ where: { MaDauSach: req.params.id } });
        res.json(copies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/books/copies/search?macuonsach=&madausach=&tensach=&tacgia=&nxb=&theloai=&tinhtrang=
const searchCopies = async (req, res) => {
    try {
        const { macuonsach, madausach, tensach, tacgia, nxb, theloai, tinhtrang } = req.query;

        // Điều kiện trên bảng Book
        const where = {};
        if (tinhtrang)  where.TinhTrang  = tinhtrang;
        if (madausach)  where.MaDauSach  = madausach;
        if (macuonsach) where.MaCuonSach = { [Op.like]: `%${macuonsach}%` };

        // Điều kiện trên bảng BookTitle
        const bookTitleWhere = {};
        if (tensach) bookTitleWhere.TenSach = { [Op.like]: `%${tensach}%` };

        const copies = await Book.findAll({
            where,
            include: [{
                model: BookTitle,
                where: Object.keys(bookTitleWhere).length ? bookTitleWhere : undefined,
                required: !!tensach,
                attributes: ['MaDauSach', 'TenSach'],
                include: [
                    {
                        model: Category,
                        attributes: ['MaTheLoai', 'TenTheLoai'],
                        ...(theloai ? { where: { MaTheLoai: theloai } } : {}),
                        required: !!theloai
                    },
                    {
                        model: Publisher,
                        attributes: ['MaNXB', 'TenNXB'],
                        ...(nxb ? { where: { MaNXB: nxb } } : {}),
                        required: !!nxb
                    },
                    {
                        model: WritingBook,
                        include: [{
                            model: Author,
                            attributes: ['MaTacGia', 'TenTacGia'],
                            ...(tacgia ? { where: { MaTacGia: tacgia } } : {}),
                            required: !!tacgia
                        }],
                        required: !!tacgia
                    }
                ]
            }]
        });

        res.json(copies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/books/:id/copies
const addCopy = async (req, res) => {
    try {
        const { TinhTrang } = req.body;
        const count = await Book.count();
        const MaCuonSach = `CS${String(count + 1).padStart(4, '0')}`;
        if (!MaCuonSach) return res.status(400).json({ message: 'Thiếu mã cuốn sách' });
        const copy = await Book.create({ MaCuonSach, TinhTrang: TinhTrang || 'Trong kho', MaDauSach: req.params.id });
        res.status(201).json(copy);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/books/copies/:copyId
const updateCopy = async (req, res) => {
    try {
        const copy = await Book.findByPk(req.params.copyId);
        if (!copy) return res.status(404).json({ message: 'Không tìm thấy cuốn sách' });
        await copy.update({ TinhTrang: req.body.TinhTrang });
        res.json(copy);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/books/copies/:copyId
const deleteCopy = async (req, res) => {
    try {
        const copy = await Book.findByPk(req.params.copyId);
        if (!copy) return res.status(404).json({ message: 'Không tìm thấy cuốn sách' });
        await copy.destroy();
        res.json({ message: 'Xóa cuốn sách thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getCopiesByTitle, searchCopies, addCopy, updateCopy, deleteCopy };
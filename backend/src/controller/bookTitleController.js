const { BookTitle, Book, Category, Author, Publisher, WritingBook } = require('../models');

// GET /api/books
const getAllBookTitles = async (req, res) => {
    try {
        const books = await BookTitle.findAll({
            include: [
                { model: Book, attributes: ['MaDauSach'] },
                { model: Category, attributes: ['TenTheLoai'] },
                { model: Publisher, attributes: ['TenNXB'] },
                { model: WritingBook, include: [{ model: Author, attributes: ['TenTacGia'] }] }
            ]
        });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/books/:id
const getBookTitleById = async (req, res) => {
    try {
        const book = await BookTitle.findByPk(req.params.id, {
            include: [
                { model: Category, attributes: ['TenTheLoai'] },
                { model: Publisher, attributes: ['TenNXB', 'DiaChi', 'SoDienThoai'] },
                { model: WritingBook, include: [{ model: Author, attributes: ['MaTacGia', 'TenTacGia', 'QuocTich'] }] },
                { model: Book, attributes: ['MaCuonSach', 'TinhTrang'] }
            ]
        });
        if (!book) return res.status(404).json({ message: 'Không tìm thấy đầu sách' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/books
// Input: { TenSach, NamXB, NoiDung, TenTheLoai, MaNXB, TenNXB, DiaChi, SoDienThoai, TacGia: [{ MaTacGia, TenTacGia, QuocTich }] }
const createBookTitle = async (req, res) => {
    try {
        const { TenSach, NamXB, NoiDung, TenTheLoai, MaNXB, TenNXB, DiaChi, SoDienThoai, TacGia } = req.body;

        if (!TenSach)
            return res.status(400).json({ message: 'Thiếu tên sách' });

        // Tự generate MaDauSach
        const count = await BookTitle.count();
        const MaDauSach = `DS${String(count + 1).padStart(4, '0')}`;

        // Tự generate MaTheLoai từ TenTheLoai
        let MaTheLoai = null;
        if (TenTheLoai) {
            const countTheLoai = await Category.count();
            MaTheLoai = `TL${String(countTheLoai + 1).padStart(4, '0')}`;

            await Category.findOrCreate({
                where: { TenTheLoai },
                defaults: { MaTheLoai, TenTheLoai }
            });

            // Lấy lại MaTheLoai thực tế (phòng TenTheLoai đã tồn tại)
            const category = await Category.findOne({ where: { TenTheLoai } });
            MaTheLoai = category.MaTheLoai;
        }

        // Xử lý nhà xuất bản
        if (MaNXB) {
            await Publisher.findOrCreate({
                where: { MaNXB },
                defaults: { TenNXB: TenNXB || MaNXB, DiaChi, SoDienThoai }
            });
        }

        // Tạo đầu sách
        const book = await BookTitle.create({ MaDauSach, TenSach, NamXB, NoiDung, MaTheLoai, MaNXB });

        // Xử lý tác giả
        if (TacGia && TacGia.length > 0) {
            for (const tg of TacGia) {
                await Author.findOrCreate({
                    where: { MaTacGia: tg.MaTacGia },
                    defaults: { TenTacGia: tg.TenTacGia, QuocTich: tg.QuocTich }
                });
                await WritingBook.create({ MaDauSach, MaTacGia: tg.MaTacGia });
            }
        }

        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/books/:id
// Input: { TenSach, NamXB, NoiDung, TenTheLoai, MaNXB, TenNXB, DiaChi, SoDienThoai, TacGia: [{ MaTacGia, TenTacGia, QuocTich }] }
const updateBookTitle = async (req, res) => {
    try {
        const { TenSach, NamXB, NoiDung, TenTheLoai, MaNXB, TenNXB, DiaChi, SoDienThoai, TacGia } = req.body;

        const book = await BookTitle.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Không tìm thấy đầu sách' });

        // Xử lý thể loại
        let MaTheLoai = null;
        if (TenTheLoai) {
            const countTheLoai = await Category.count();
            const newMaTheLoai = `TL${String(countTheLoai + 1).padStart(4, '0')}`;

            await Category.findOrCreate({
                where: { TenTheLoai },
                defaults: { MaTheLoai: newMaTheLoai, TenTheLoai }
            });

            const category = await Category.findOne({ where: { TenTheLoai } });
            MaTheLoai = category.MaTheLoai;
        }

        // Xử lý nhà xuất bản
        if (MaNXB) {
            await Publisher.findOrCreate({
                where: { MaNXB },
                defaults: { TenNXB: TenNXB || MaNXB, DiaChi, SoDienThoai }
            });
        }

        await book.update({ TenSach, NamXB, NoiDung, MaTheLoai, MaNXB });

        // Cập nhật tác giả
        if (TacGia) {
            await WritingBook.destroy({ where: { MaDauSach: req.params.id } });
            for (const tg of TacGia) {
                await Author.findOrCreate({
                    where: { MaTacGia: tg.MaTacGia },
                    defaults: { TenTacGia: tg.TenTacGia, QuocTich: tg.QuocTich }
                });
                await WritingBook.create({ MaDauSach: req.params.id, MaTacGia: tg.MaTacGia });
            }
        }

        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/books/:id
const deleteBookTitle = async (req, res) => {
    try {
        const book = await BookTitle.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Không tìm thấy đầu sách' });
        await WritingBook.destroy({ where: { MaDauSach: req.params.id } });
        await Book.destroy({ where: { MaDauSach: req.params.id } });
        await book.destroy();
        res.json({ message: 'Xóa đầu sách thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/books/search?theloai=TL001&nxb=NXB001&tacgia=TG001&tensach=clean
const searchBooks = async (req, res) => {
    try {
        const { theloai, nxb, tacgia, tensach } = req.query;

        const where = {};
        if (tensach) where.TenSach = { [require('sequelize').Op.like]: `%${tensach}%` };
        if (theloai) where.MaTheLoai = theloai;
        if (nxb) where.MaNXB = nxb;

        const include = [
            { model: Category, attributes: ['TenTheLoai'] },
            { model: Publisher, attributes: ['TenNXB'] },
            {
                model: WritingBook,
                include: [{
                    model: Author,
                    attributes: ['MaTacGia', 'TenTacGia'],
                    ...(tacgia ? { where: { MaTacGia: tacgia } } : {})
                }],
                required: !!tacgia
            }
        ];

        const books = await BookTitle.findAll({ where, include });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllBookTitles, getBookTitleById, createBookTitle, updateBookTitle, deleteBookTitle, searchBooks };
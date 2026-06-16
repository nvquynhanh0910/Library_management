const { BookTitle, Book, Category, Author, Publisher, WritingBook } = require('../models');
const { Op } = require('sequelize');

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

const updateBookTitle = async (req, res) => {
    try {
        const { TenSach, NamXB, TenTheLoai, TenNXB, DiaChi, SoDienThoai, TacGia } = req.body;

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
        let MaNXB = null;
        if (TenNXB) {
            const countNXB = await Publisher.count();
            const newMaNXB = `NXB${String(countNXB + 1).padStart(4, '0')}`;
            await Publisher.findOrCreate({
                where: { TenNXB },
                defaults: { MaNXB: newMaNXB, TenNXB, DiaChi, SoDienThoai }
            });
            const publisher = await Publisher.findOne({ where: { TenNXB } });
            MaNXB = publisher.MaNXB;
        }

        // Chỉ update field nào có gửi lên
        await book.update({
            ...(TenSach && { TenSach }),
            ...(NamXB && { NamXB }),
            ...(MaTheLoai && { MaTheLoai }),
            ...(MaNXB && { MaNXB })
        });

        // Xử lý tác giả
        if (TacGia && TacGia.length > 0) {
            await WritingBook.destroy({ where: { MaDauSach: req.params.id } });
            for (const tg of TacGia) {
                const countTG = await Author.count();
                const newMaTacGia = `TG${String(countTG + 1).padStart(4, '0')}`;
                const [author] = await Author.findOrCreate({
                    where: { TenTacGia: tg.TenTacGia },
                    defaults: { MaTacGia: newMaTacGia, TenTacGia: tg.TenTacGia, QuocTich: tg.QuocTich }
                });
                await WritingBook.create({ MaDauSach: req.params.id, MaTacGia: author.MaTacGia });
            }
        }

        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createBookTitle = async (req, res) => {
    try {
        const { TenSach, TenTacGia, TenTheLoai, TenNXB, NamXB } = req.body;

        if (!TenSach)
            return res.status(400).json({ message: 'Thiếu tên sách' });
        
        const exists = await BookTitle.findOne({ where: { TenSach } });
        if (exists) return res.status(400).json({ message: 'Đầu sách đã tồn tại' });

        // Tự generate MaDauSach
        const lastBook = await BookTitle.findOne({ order: [['MaDauSach', 'DESC']] });
        const lastNum = lastBook ? parseInt(lastBook.MaDauSach.replace('DS', '')) : 0;
        const MaDauSach = `DS${String(lastNum + 1).padStart(4, '0')}`;

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
        let MaNXB = null;
        if (TenNXB) {
            const countNXB = await Publisher.count();
            const newMaNXB = `NXB${String(countNXB + 1).padStart(4, '0')}`;
            await Publisher.findOrCreate({
                where: { TenNXB },
                defaults: { MaNXB: newMaNXB, TenNXB }
            });
            const publisher = await Publisher.findOne({ where: { TenNXB } });
            MaNXB = publisher.MaNXB;
        }

        // Tạo đầu sách
        const book = await BookTitle.create({ MaDauSach, TenSach, NamXB, MaTheLoai, MaNXB, SoLuong: 0 });

        // Xử lý tác giả
        if (TenTacGia) {
            const countTG = await Author.count();
            const MaTacGia = `TG${String(countTG + 1).padStart(4, '0')}`;
            const [author] = await Author.findOrCreate({
                where: { TenTacGia },
                defaults: { MaTacGia, TenTacGia }
            });
            await WritingBook.create({ MaDauSach, MaTacGia: author.MaTacGia });
        }

        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteBookTitle = async (req, res) => {
    try {
        const book = await BookTitle.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Không tìm thấy đầu sách' });

        // Chỉ xóa khi SoLuong = 0
        if (book.SoLuong > 0)
            return res.status(400).json({ message: 'Không thể xóa đầu sách khi còn bản sao' });

        await WritingBook.destroy({ where: { MaDauSach: req.params.id } });
        await book.destroy();
        res.json({ message: 'Xóa đầu sách thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const searchBooks = async (req, res) => {
    try {
        const { MaDauSach, TenSach, TenTacGia, TenNXB, TenTheLoai } = req.query;

        const where = {};
        if (MaDauSach) where.MaDauSach = { [Op.like]: `%${MaDauSach}%` };
        if (TenSach)   where.TenSach   = { [Op.like]: `%${TenSach}%` };

        const include = [
            {
                model: Category,
                attributes: ['TenTheLoai'],
                ...(TenTheLoai ? { where: { TenTheLoai: { [Op.like]: `%${TenTheLoai}%` } } } : {}),
                required: !!TenTheLoai
            },
            {
                model: Publisher,
                attributes: ['TenNXB'],
                ...(TenNXB ? { where: { TenNXB: { [Op.like]: `%${TenNXB}%` } } } : {}),
                required: !!TenNXB
            },
            {
                model: WritingBook,
                include: [{
                    model: Author,
                    attributes: ['TenTacGia'],
                    ...(TenTacGia ? { where: { TenTacGia: { [Op.like]: `%${TenTacGia}%` } } } : {}),
                    required: !!TenTacGia
                }],
                required: !!TenTacGia
            }
        ];

        const books = await BookTitle.findAll({ where, include });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllBookTitles, getBookTitleById, createBookTitle, updateBookTitle, deleteBookTitle, searchBooks };
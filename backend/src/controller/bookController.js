const { Book, BookTitle, Category, Author, Publisher, WritingBook, Borrowing, PunishmentSlip } = require('../models');
const { Op } = require('sequelize');

// GET /api/book-titles/:id/copies
const getCopiesByTitle = async (req, res) => {
    try {
        const copies = await Book.findAll({ where: { MaDauSach: req.params.id } });
        res.json(copies);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/book-titles/copies/search
const searchCopies = async (req, res) => {
    try {
        const { MaCuonSach, MaDauSach, TenSach, TenTacGia, TenNXB, TenTheLoai, TinhTrang } = req.query;

        const where = {};
        if (TinhTrang)  where.TinhTrang  = TinhTrang;
        if (MaDauSach)  where.MaDauSach  = MaDauSach;
        if (MaCuonSach) where.MaCuonSach = { [Op.like]: `%${MaCuonSach}%` };

        const bookTitleWhere = {};
        if (TenSach) bookTitleWhere.TenSach = { [Op.like]: `%${TenSach}%` };

        const copies = await Book.findAll({
            where,
            include: [{
                model: BookTitle,
                where: Object.keys(bookTitleWhere).length ? bookTitleWhere : undefined,
                required: !!TenSach,
                attributes: ['MaDauSach', 'TenSach'],
                include: [
                    {
                        model: Category,
                        attributes: ['MaTheLoai', 'TenTheLoai'],
                        ...(TenTheLoai ? { where: { TenTheLoai: { [Op.like]: `%${TenTheLoai}%` } } } : {}),
                        required: !!TenTheLoai
                    },
                    {
                        model: Publisher,
                        attributes: ['MaNXB', 'TenNXB'],
                        ...(TenNXB ? { where: { TenNXB: { [Op.like]: `%${TenNXB}%` } } } : {}),
                        required: !!TenNXB
                    },
                    {
                        model: WritingBook,
                        include: [{
                            model: Author,
                            attributes: ['MaTacGia', 'TenTacGia'],
                            ...(TenTacGia ? { where: { TenTacGia: { [Op.like]: `%${TenTacGia}%` } } } : {}),
                            required: !!TenTacGia
                        }],
                        required: !!TenTacGia
                    }
                ]
            }]
        });

        res.json(copies);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/book-titles/copies
const addCopy = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const results = [];

        for (const item of data) {
            const { TenSach, ChatLuong, SoLuong = 1 } = item;
            if (!TenSach) continue;
            if (ChatLuong && !['Mới', 'Cũ'].includes(ChatLuong))
                return res.status(400).json({ message: 'Chất lượng chỉ được là Mới hoặc Cũ' });

            const bookTitle = await BookTitle.findOne({ where: { TenSach } });
            if (!bookTitle) return res.status(404).json({ message: `Không tìm thấy đầu sách: ${TenSach}` });

            const MaDauSach = bookTitle.MaDauSach;
            const copies = [];

            for (let i = 0; i < SoLuong; i++) {
                const maxBook = await Book.findOne({
                order: [['MaCuonSach', 'DESC']]
            });
            const lastNum = maxBook ? parseInt(maxBook.MaCuonSach.replace('CS', '')) : 0;
            const MaCuonSach = `CS${String(lastNum + 1).padStart(4, '0')}`;
                const copy = await Book.create({
                    MaCuonSach,
                    TinhTrang: 'Sẵn sàng',
                    ChatLuong: ChatLuong || 'Mới',
                    MaDauSach
                });
                copies.push(copy);
            }

            await BookTitle.increment('SoLuong', { by: SoLuong, where: { MaDauSach } });
            results.push({ TenSach, SoLuong, copies });
        }

        res.status(201).json(results);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/book-titles/copies/:copyId
const updateCopy = async (req, res) => {
    try {
        const copy = await Book.findByPk(req.params.copyId);
        if (!copy) return res.status(404).json({ message: 'Không tìm thấy cuốn sách' });
        await copy.update({
            ...(req.body.TinhTrang && { TinhTrang: req.body.TinhTrang }),
            ...(req.body.ChatLuong && { ChatLuong: req.body.ChatLuong })
        });
        res.json(copy);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/book-titles/copies/:copyId
const deleteCopy = async (req, res) => {
    try {
        const copy = await Book.findByPk(req.params.copyId);
        if (!copy) return res.status(404).json({ message: 'Không tìm thấy cuốn sách' });

        // Kiểm tra còn phiếu phạt chưa thanh toán không
        const unpaid = await PunishmentSlip.findOne({
            where: { MaCuonSach: req.params.copyId, TrangThaiThanhToan: 'Chưa thanh toán' }
        });
        if (unpaid) return res.status(400).json({ message: 'Cuốn sách còn phiếu phạt chưa thanh toán' });

        const MaDauSach = copy.MaDauSach;
        await Borrowing.destroy({ where: { MaCuonSach: req.params.copyId } });
        await copy.destroy();

        const bookTitle = await BookTitle.findByPk(MaDauSach);
        if (bookTitle && bookTitle.SoLuong > 0)
            await BookTitle.decrement('SoLuong', { where: { MaDauSach } });

        res.json({ message: 'Xóa cuốn sách thành công' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getCopiesByTitle, searchCopies, addCopy, updateCopy, deleteCopy };
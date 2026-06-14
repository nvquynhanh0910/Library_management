const{Author} = require('../models');

const getAllAuthors = async (req, res) => {
    try { res.json(await Author.findAll()); }
    catch (err) { res.status(500).json({ message: err.message }); }
};
 
const createAuthor = async (req, res) => {
    try {
        const { MaTacGia, TenTacGia, QuocTich } = req.body;
        if (!MaTacGia || !TenTacGia)
            return res.status(400).json({ message: 'Thiếu mã hoặc tên tác giả' });
        res.status(201).json(await Author.create({ MaTacGia, TenTacGia, QuocTich }));
    } catch (err) { res.status(500).json({ message: err.message }); }
};
 
const updateAuthor = async (req, res) => {
    try {
        const a = await Author.findByPk(req.params.id);
        if (!a) return res.status(404).json({ message: 'Không tìm thấy tác giả' });
        await a.update({ TenTacGia: req.body.TenTacGia, QuocTich: req.body.QuocTich });
        res.json(a);
    } catch (err) { res.status(500).json({ message: err.message }); }
};
 
const deleteAuthor = async (req, res) => {
    try {
        const a = await Author.findByPk(req.params.id);
        if (!a) return res.status(404).json({ message: 'Không tìm thấy tác giả' });
        await a.destroy();
        res.json({ message: 'Xóa tác giả thành công' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {getAllAuthors,createAuthor,updateAuthor,deleteAuthor};
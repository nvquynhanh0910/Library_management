const { Category, BookTitle } = require('../models'); // thêm BookTitle
 
// GET /api/categories
const getAllCategories = async (req, res) => {
    try {
        res.json(await Category.findAll());
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
 
// GET /api/categories/:id
const getCategoryById = async (req, res) => {
    try {
        const cat = await Category.findByPk(req.params.id);
        if (!cat) return res.status(404).json({ message: 'Không tìm thấy thể loại' });
        res.json(cat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
 
// POST /api/categories
const createCategory = async (req, res) => {
    try {
        const { TenTheLoai } = req.body;
        if (!TenTheLoai) return res.status(400).json({ message: 'Thiếu tên thể loại' });

        const exists = await Category.findOne({ where: { TenTheLoai } });
        if (exists) return res.status(400).json({ message: 'Thể loại đã tồn tại' });

        const allCats = await Category.findAll({ attributes: ['MaTheLoai'] });
        const maxNum = allCats.reduce((max, c) => {
            const num = parseInt(c.MaTheLoai.replace('TL', '')) || 0;
            return num > max ? num : max;
        }, 0);
        const MaTheLoai = `TL${String(maxNum + 1).padStart(4, '0')}`;

        const cat = await Category.create({ MaTheLoai, TenTheLoai });
        res.status(201).json(cat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
 
// PUT /api/categories/:id
const updateCategory = async (req, res) => {
    try {
        const cat = await Category.findByPk(req.params.id);
        if (!cat) return res.status(404).json({ message: 'Không tìm thấy thể loại' });
        await cat.update({ TenTheLoai: req.body.TenTheLoai });
        res.json(cat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
 
// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
    try {
        const cat = await Category.findByPk(req.params.id);
        if (!cat) return res.status(404).json({ message: 'Không tìm thấy thể loại' });

        await BookTitle.update({ MaTheLoai: null }, { where: { MaTheLoai: req.params.id } });
        await cat.destroy();
        res.json({ message: 'Xóa thể loại thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
 
module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
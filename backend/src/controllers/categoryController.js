const { Category } = require('../models');

// Lấy tất cả
exports.getAll = async (req, res) => {
    try {
        const data = await Category.findAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy theo ID
exports.getById = async (req, res) => {
    try {
        const data = await Category.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm mới
exports.create = async (req, res) => {
    try {
        const newData = await Category.create(req.body);
        res.status(201).json(newData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật
exports.update = async (req, res) => {
    try {
        const data = await Category.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: 'Không tìm thấy' });
        
        await data.update(req.body);
        res.json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa
exports.delete = async (req, res) => {
    try {
        const data = await Category.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: 'Không tìm thấy' });
        
        await data.destroy();
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

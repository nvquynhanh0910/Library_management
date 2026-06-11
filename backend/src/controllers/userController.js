const { User } = require('../models');

exports.getAll = async (req, res) => {
    try {
        const data = await User.findAll({ attributes: { exclude: ['Password'] } });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await User.findByPk(req.params.id, { attributes: { exclude: ['Password'] } });
        if (!data) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newData = await User.create(req.body);
        res.status(201).json(newData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await User.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: 'Không tìm thấy' });
        
        await data.update(req.body);
        res.json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const data = await User.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: 'Không tìm thấy' });
        
        await data.destroy();
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

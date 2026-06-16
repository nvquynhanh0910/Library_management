const { PenaltyRule } = require('../models');

// GET /api/penalty-rules
const getAllPenaltyRules = async (req, res) => {
    try {
        res.json(await PenaltyRule.findAll());
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/penalty-rules/:id
const getPenaltyRuleById = async (req, res) => {
    try {
        const rule = await PenaltyRule.findByPk(req.params.id);
        if (!rule) return res.status(404).json({ message: 'Không tìm thấy hình phạt' });
        res.json(rule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/penalty-rules
const createPenaltyRule = async (req, res) => {
    try {
        const { TenHinhPhat, MucPhat } = req.body;
        if (!TenHinhPhat || MucPhat === undefined)
            return res.status(400).json({ message: 'Thiếu tên hình phạt hoặc mức phạt' });
        const exists = await PenaltyRule.findOne({ where: { TenHinhPhat } });
        if (exists) return res.status(400).json({ message: 'Hình phạt đã tồn tại' });
        const rule = await PenaltyRule.create({ TenHinhPhat, MucPhat });
        res.status(201).json(rule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/penalty-rules/:id
const updatePenaltyRule = async (req, res) => {
    try {
        const rule = await PenaltyRule.findByPk(req.params.id);
        if (!rule) return res.status(404).json({ message: 'Không tìm thấy hình phạt' });
        await rule.update({ MucPhat: req.body.MucPhat });
        res.json(rule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/penalty-rules/:id
const deletePenaltyRule = async (req, res) => {
    try {
        const rule = await PenaltyRule.findByPk(req.params.id);
        if (!rule) return res.status(404).json({ message: 'Không tìm thấy hình phạt' });
        await rule.destroy();
        res.json({ message: 'Xóa hình phạt thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllPenaltyRules, getPenaltyRuleById, createPenaltyRule, updatePenaltyRule, deletePenaltyRule };
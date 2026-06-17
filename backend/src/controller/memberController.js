const { Member } = require('../models');
const { Op } = require('sequelize');

// GET /api/members
const getAllMembers = async (req, res) => {
    try {
        const members = await Member.findAll({
            attributes: { exclude: ['MatKhau'] }
        });
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/members/:id
const getMemberById = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id, {
            attributes: { exclude: ['MatKhau'] }
        });
        if (!member) return res.status(404).json({ message: 'Không tìm thấy độc giả' });
        res.json(member);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/members/search?hoten=&email=&sodienthoai=
const searchMembers = async (req, res) => {
    try {
        const { hoten, email, sodienthoai } = req.query;
        const where = {};
        if (hoten)       where.HoTen       = { [Op.like]: `%${hoten}%` };
        if (email)       where.Email       = { [Op.like]: `%${email}%` };
        if (sodienthoai) where.SoDienThoai = { [Op.like]: `%${sodienthoai}%` };

        const members = await Member.findAll({
            where,
            attributes: { exclude: ['MatKhau'] }
        });
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/members/:id
const updateMember = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) return res.status(404).json({ message: 'Không tìm thấy độc giả' });
        const { HoTen, Email, SoDienThoai } = req.body;
        await member.update({ HoTen, Email, SoDienThoai });
        const { MatKhau: _, ...result } = member.toJSON();
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/members/:id
const deleteMember = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) return res.status(404).json({ message: 'Không tìm thấy độc giả' });
        await member.destroy();
        res.json({ message: 'Xóa độc giả thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllMembers, getMemberById, searchMembers, updateMember, deleteMember };
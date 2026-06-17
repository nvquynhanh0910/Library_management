const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Member } = require('../models');

const getNextMaPhieu = async (Model, field, prefix) => {
    const tableName = Model.getTableName();
    const [[row]] = await Model.sequelize.query(
        `SELECT MAX([${field}]) AS maxMa FROM [${tableName}]`
    );
    const last = row?.maxMa;
    const max = last ? parseInt(last.replace(prefix, ''), 10) : 0;
    return `${prefix}${String(max + 1).padStart(4, '0')}`;
};

// ==================== NHÂN VIÊN ====================

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { Username, Password } = req.body;
        if (!Username || !Password)
            return res.status(400).json({ message: 'Vui lòng nhập username và password' });

        const user = await User.findOne({ where: { Username } });
        if (!user)
            return res.status(401).json({ message: 'Tài khoản không tồn tại' });

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch)
            return res.status(401).json({ message: 'Mật khẩu không đúng' });

        const token = jwt.sign(
            { MaNhanVien: user.MaNhanVien, ChucVu: user.ChucVu, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            token,
            user: { MaNhanVien: user.MaNhanVien, TenNhanVien: user.TenNhanVien, ChucVu: user.ChucVu, role: 'admin' }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { TenNhanVien, ChucVu, Username, Password } = req.body;

        if (!TenNhanVien || !Username || !Password)
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });

        const exists = await User.findOne({ where: { Username } });
        if (exists) return res.status(400).json({ message: 'Username đã tồn tại' });

        const MaNhanVien = await getNextMaPhieu(User, 'MaNhanVien', 'NV');
        const hashed = await bcrypt.hash(Password, 10);

        const user = await User.create({ MaNhanVien, TenNhanVien, ChucVu, Username, Password: hashed });

        res.status(201).json({ message: 'Tạo tài khoản thành công', MaNhanVien: user.MaNhanVien });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ==================== ĐỘC GIẢ ====================

// POST /api/auth/member/login
const memberLogin = async (req, res) => {
    try {
        const { Email, MatKhau } = req.body;
        if (!Email || !MatKhau)
            return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });

        const member = await Member.findOne({ where: { Email } });
        if (!member)
            return res.status(401).json({ message: 'Tài khoản không tồn tại' });

        const isMatch = await bcrypt.compare(MatKhau, member.MatKhau);
        if (!isMatch)
            return res.status(401).json({ message: 'Mật khẩu không đúng' });

        const token = jwt.sign(
            { MaThanhVien: member.MaThanhVien, role: 'guest' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            token,
            user: { MaThanhVien: member.MaThanhVien, HoTen: member.HoTen, SoDienThoai: member.SoDienThoai, role: 'guest' }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/auth/member/register
const memberRegister = async (req, res) => {
    try {
        const { HoTen, Email, SoDienThoai, MatKhau } = req.body;

        if (!HoTen || !Email || !MatKhau)
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });

        const exists = await Member.findOne({ where: { Email } });
        if (exists) return res.status(400).json({ message: 'Email đã tồn tại' });

        const MaThanhVien = await getNextMaPhieu(Member, 'MaThanhVien', 'TV');
        const hashed = await bcrypt.hash(MatKhau, 10);

        const member = await Member.create({ MaThanhVien, HoTen, Email, SoDienThoai, MatKhau: hashed });

        res.status(201).json({ message: 'Tạo tài khoản thành công', MaThanhVien: member.MaThanhVien });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { login, register, memberLogin, memberRegister};
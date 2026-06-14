const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Member } = require('../models');

// ==================== NHÂN VIÊN ====================

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: 'Vui lòng nhập username và password' });

        const user = await User.findOne({ where: { Username: username } });
        if (!user)
            return res.status(401).json({ message: 'Tài khoản không tồn tại' });

        const isMatch = await bcrypt.compare(password, user.Password);
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
        const { TenNhanVien, ChucVu, username, password } = req.body;
        const exists = await User.findOne({ where: { Username } });
        if (exists) return res.status(400).json({ message: 'Username đã tồn tại' });

        const count = await User.count();
        const MaNhanVien = `NV${String(count + 1).padStart(4, '0')}`;
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
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Vui lòng nhập email và password' });

        // Fix lỗi cũ: query đúng model Member
        const member = await Member.findOne({ where: { Email: email } });
        // Fix lỗi cũ: check member thay vì check email
        if (!member)
            return res.status(401).json({ message: 'Tài khoản không tồn tại' });

        const isMatch = await bcrypt.compare(password, member.MatKhau);
        if (!isMatch)
            return res.status(401).json({ message: 'Mật khẩu không đúng' });

        const token = jwt.sign(
            { MaThanhVien: member.MaThanhVien, role: 'guest' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Fix lỗi cũ: không trả về MatKhau
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
        const exists = await Member.findOne({ where: { Email } });
        if (exists) return res.status(400).json({ message: 'Email đã tồn tại' });

        const count = await Member.count();
        const MaThanhVien = `TV${String(count + 1).padStart(4, '0')}`;
        // Fix lỗi cũ: dùng MatKhau thay vì Password, salt 10 thay vì 20
        const hashed = await bcrypt.hash(MatKhau, 10);
        const member = await Member.create({ MaThanhVien, HoTen, Email, SoDienThoai, MatKhau: hashed });

        res.status(201).json({ message: 'Tạo tài khoản thành công', MaThanhVien: member.MaThanhVien });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { login, register, memberLogin, memberRegister};
const { User } = require('../models');

// GET /api/users
// Quyền: admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['Password'] }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/users/me
// Quyền: admin – trả về thông tin nhân viên đang đăng nhập
const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.MaNhanVien, {
            attributes: { exclude: ['Password'] }
        });
        if (!user) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/users/:id
// Quyền: admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['Password'] }
        });
        if (!user) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/users/:id
// Quyền: admin
// Body: { TenNhanVien, ChucVu }
const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });

        const { TenNhanVien, ChucVu } = req.body;
        await user.update({
            ...(TenNhanVien && { TenNhanVien }),
            ...(ChucVu !== undefined && { ChucVu })
        });

        const { Password: _, ...result } = user.toJSON();
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/users/:id
// Quyền: admin
// Không cho xóa chính mình
const deleteUser = async (req, res) => {
    try {
        if (req.user.MaNhanVien === req.params.id)
            return res.status(400).json({ message: 'Không thể xóa tài khoản đang đăng nhập' });

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });

        await user.destroy();
        res.json({ message: 'Xóa nhân viên thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllUsers, getMe, getUserById, updateUser, deleteUser };
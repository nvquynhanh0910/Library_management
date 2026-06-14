const jwt = require('jsonwebtoken');

// Dùng chung: verify token, gắn req.user
const verifyToken = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
        return res.status(401).json({ message: 'Chưa đăng nhập' });

    try {
        const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

// Chỉ nhân viên (admin) mới được vào
const protect = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin')
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        next();
    });
};

// Chỉ độc giả (guest) mới được vào
const memberProtect = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'guest')
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        next();
    });
};

// Cả nhân viên lẫn độc giả đều được vào (đã đăng nhập là đủ)
const anyProtect = verifyToken;

module.exports = { protect, memberProtect, anyProtect };
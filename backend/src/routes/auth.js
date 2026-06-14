const router = require('express').Router();
const { protect, memberProtect } = require('../middleware/auth');
const {
    login, register,memberLogin, memberRegister
} = require('../controller/authController');

// Nhân viên
router.post('/login', login);
router.post('/register', register);

// Độc giả
router.post('/member/login', memberLogin);
router.post('/member/register', memberRegister);

module.exports = router;
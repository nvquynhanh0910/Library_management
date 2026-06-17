const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getAllUsers,
    getMe,
    getUserById,
    updateUser,
    deleteUser
} = require('../controller/userController');

// api là /api/users
router.get('/',        protect, getAllUsers);
router.get('/me',      protect, getMe);
router.get('/:id',     protect, getUserById);
router.put('/:id',     protect, updateUser);
router.delete('/:id',  protect, deleteUser);

module.exports = router;
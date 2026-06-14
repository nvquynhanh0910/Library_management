const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getAllMembers, getMemberById, searchMembers, updateMember, deleteMember } = require('../controller/memberController');

// Tất cả đều yêu cầu nhân viên (admin)
router.get('/search',  protect, searchMembers);
router.get('/',        protect, getAllMembers);
router.get('/:id',     protect, getMemberById);
router.put('/:id',     protect, updateMember);
router.delete('/:id',  protect, deleteMember);

module.exports = router;
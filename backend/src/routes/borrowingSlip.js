const router = require('express').Router();
const { memberProtect,protect } = require('../middleware/auth');
const {
    getAllBorrowingSlips,
    getBorrowingSlipById,
    searchBorrowingSlips,
    createBorrowingSlip,
    returnBooks,
    deleteBorrowingSlip,
    getMyBorrowingSlips  // ← thêm dòng này
} = require('../controller/borrowingSlipController');

// Tất cả chỉ nhân viên mới được thao tác
router.get('/search',        protect, searchBorrowingSlips);
router.get('/my', memberProtect, getMyBorrowingSlips);
router.get('/',              protect, getAllBorrowingSlips);
router.get('/:id',           protect, getBorrowingSlipById);
router.post('/',             protect, createBorrowingSlip);
router.put('/:id/return',    protect, returnBooks);       // trả sách
router.delete('/:id',        protect, deleteBorrowingSlip);

module.exports = router;
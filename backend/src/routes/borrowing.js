const router = require('express').Router();
const { memberProtect,protect } = require('../middleware/auth');
const { getAllBorrowings, getOverdue, getMyOverdue, getBorrowingsBySlip, updateBorrowing } = require('../controller/borrowingController');
// thêm getMyOverdue 
router.get('/overdue',             protect, getOverdue);               // sách quá hạn
router.get('/my/overdue', memberProtect, getMyOverdue);
router.get('/slip/:maPhieu', memberProtect, getBorrowingsBySlip);     // sách trong 1 phiếu
router.get('/',                    protect, getAllBorrowings);
router.put('/:maPhieu/:maCuonSach', protect, updateBorrowing);

module.exports = router;
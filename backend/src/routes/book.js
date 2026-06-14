const router = require('express').Router();
const { protect, anyProtect } = require('../middleware/auth');
const { getCopiesByTitle, searchCopies, addCopy, updateCopy, deleteCopy } = require('../controller/bookController');
 
// Phải đặt trước /:id/copies để tránh nhầm "search" là id
router.get('/copies/search',       anyProtect, searchCopies);         // tìm cuốn sách
router.get('/:id/copies',          anyProtect, getCopiesByTitle);     // lấy bản sao theo đầu sách
router.post('/:id/copies',         protect,    addCopy);              // thêm bản sao
router.put('/copies/:copyId',      protect,    updateCopy);           // cập nhật tình trạng
router.delete('/copies/:copyId',   protect,    deleteCopy);           // xóa bản sao
 
module.exports = router;
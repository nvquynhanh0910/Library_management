const router = require('express').Router();
const{protect, memberProtect, anyProtect} = require('../middleware/auth');
const{getAllAuthors,createAuthor,updateAuthor,deleteAuthor} = require('../controller/authorController');

router.get('/authors', anyProtect,getAllAuthors);
router.post('/authors', protect,createAuthor);
router.put('/authors/:id',protect,updateAuthor);
router.delete('/authors/:id',protect,deleteAuthor);

module.exports = router;
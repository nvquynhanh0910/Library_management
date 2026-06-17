const router = require('express').Router();
const{protect, memberProtect, anyProtect} = require('../middleware/auth');
const{getAllAuthors,createAuthor,updateAuthor,deleteAuthor} = require('../controller/authorController');

router.get('/', anyProtect, getAllAuthors);
router.post('/', protect, createAuthor);
router.put('/:id', protect, updateAuthor);
router.delete('/:id', protect, deleteAuthor);

module.exports = router;
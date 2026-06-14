const{protect, memberProtect, anyProtect} = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {
    getAllBookTitles,
    getBookTitleById,
    createBookTitle,
    updateBookTitle,
    deleteBookTitle,
    searchBooks
} = require('../controller/bookTitleController');

// GET /api/books/search?theloai=TL001&nxb=NXB001&tacgia=TG001&tensach=clean
// Phải đặt trước /:id để tránh bị nhầm "search" là một id
router.get('/search',anyProtect,searchBooks);

// GET /api/books
router.get('/', anyProtect,getAllBookTitles);

// GET /api/books/:id
router.get('/:id', getBookTitleById);

// POST /api/books
router.post('/',protect,createBookTitle);

// PUT /api/books/:id
router.put('/:id',protect,updateBookTitle);

// DELETE /api/books/:id
router.delete('/:id',protect,deleteBookTitle);

module.exports = router;
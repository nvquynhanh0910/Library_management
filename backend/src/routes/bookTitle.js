const { protect, memberProtect, anyProtect } = require('../middleware/auth');
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
// api là api/book-titles
// Phải đặt trước /:id để tránh bị nhầm "search" là một id
router.get('/search', anyProtect, searchBooks);  // GET /api/book-titles/search?TenSach=Mắt
router.get('/', anyProtect, getAllBookTitles);    // GET /api/book-titles
router.get('/:id', anyProtect, getBookTitleById);// GET /api/book-titles/:id
router.post('/', protect, createBookTitle);       // POST /api/book-titles
router.put('/:id', protect, updateBookTitle);     // PUT /api/book-titles/:id
router.delete('/:id', protect, deleteBookTitle);  // DELETE /api/book-titles/:id

module.exports = router;
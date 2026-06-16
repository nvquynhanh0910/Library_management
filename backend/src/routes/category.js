const router = require('express').Router();
const { protect, anyProtect } = require('../middleware/auth');
const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controller/categoryController');
//api là /api/categories
router.get('/',        anyProtect, getAllCategories);
router.get('/:id',     anyProtect, getCategoryById);
router.post('/',       protect,    createCategory);
router.put('/:id',     protect,    updateCategory);
router.delete('/:id',  protect,    deleteCategory);

module.exports = router;
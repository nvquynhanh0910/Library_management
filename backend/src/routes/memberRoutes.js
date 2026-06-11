const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.get('/', memberController.getAll);
router.get('/:id', memberController.getById);
router.post('/', memberController.create);
router.put('/:id', memberController.update);
router.delete('/:id', memberController.delete);
router.get('/:id/history', memberController.getHistory);

module.exports = router;

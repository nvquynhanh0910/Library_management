const express = require('express');
const router = express.Router();
const penaltyRuleController = require('../controllers/penaltyRuleController');

router.get('/', penaltyRuleController.getAll);
router.get('/:id', penaltyRuleController.getById);
router.post('/', penaltyRuleController.create);
router.put('/:id', penaltyRuleController.update);
router.delete('/:id', penaltyRuleController.delete);

module.exports = router;

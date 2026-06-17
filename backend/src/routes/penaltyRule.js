const router = require('express').Router();
const { protect, anyProtect } = require('../middleware/auth');
const { getAllPenaltyRules, getPenaltyRuleById, createPenaltyRule, updatePenaltyRule, deletePenaltyRule } = require('../controller/penaltyRuleController');

router.get('/',        anyProtect, getAllPenaltyRules);
router.get('/:id',     anyProtect, getPenaltyRuleById);
router.post('/',       protect,    createPenaltyRule);
router.put('/:id',     protect,    updatePenaltyRule);
router.delete('/:id',  protect,    deletePenaltyRule);

module.exports = router;
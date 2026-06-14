const router = require('express').Router();
const { memberProtect, protect } = require('../middleware/auth');
const {
    getAllPunishmentSlips,
    getMyPunishmentSlips,
    getPunishmentSlipById,
    searchPunishmentSlips,
    createPunishmentSlip,
    markAsPaid,
    updatePunishmentSlip,
    deletePunishmentSlip
} = require('../controller/punishmentSlipController');

router.get('/search',   protect,       searchPunishmentSlips);
router.get('/my',       memberProtect, getMyPunishmentSlips);
router.get('/',         protect,       getAllPunishmentSlips);
router.get('/:id',      protect,       getPunishmentSlipById);
router.post('/',        protect,       createPunishmentSlip);
router.put('/:id/pay',  protect,       markAsPaid);
router.put('/:id',      protect,       updatePunishmentSlip);
router.delete('/:id',   protect,       deletePunishmentSlip);

module.exports = router;
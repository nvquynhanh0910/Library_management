const express = require('express');
const router = express.Router();

const categoryRoutes = require('./categoryRoutes');
const authorRoutes = require('./authorRoutes');
const publisherRoutes = require('./publisherRoutes');
const userRoutes = require('./userRoutes');
const penaltyRuleRoutes = require('./penaltyRuleRoutes');
const memberRoutes = require('./memberRoutes');

router.use('/categories', categoryRoutes);
router.use('/authors', authorRoutes);
router.use('/publishers', publisherRoutes);
router.use('/users', userRoutes);
router.use('/penalty-rules', penaltyRuleRoutes);
router.use('/members', memberRoutes);

module.exports = router;

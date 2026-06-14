const express = require('express');
const router = express.Router();
const{protect, memberProtect, anyProtect} = require('../middleware/auth');
const{getAllPublishers,createPublisher,updatePublisher,deletePublisher} = require('../controller/publisherController');

router.get('/publishers',           anyProtect, getAllPublishers);   // cả 2 đều xem được
router.post('/publishers',          protect, createPublisher);
router.put('/publishers/:id',       protect, updatePublisher);
router.delete('/publishers/:id',    protect, deletePublisher);

module.exports = router;
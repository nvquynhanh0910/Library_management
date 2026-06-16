const express = require('express');
const router = express.Router();
const{protect, memberProtect, anyProtect} = require('../middleware/auth');
const{getAllPublishers,createPublisher,updatePublisher,deletePublisher} = require('../controller/publisherController');

//api là /api/publishers
router.get('/',           anyProtect, getAllPublishers);   // cả 2 đều xem được
router.post('/',          protect, createPublisher);
router.put('/:id',       protect, updatePublisher);
router.delete('/:id',    protect, deletePublisher);

module.exports = router;
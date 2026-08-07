const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const {
    getServices, getServiceById, createService, updateService, deleteService
} = require('../controllers/serviceController');

router.use(protect);

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', adminOnly, deleteService);

module.exports = router;
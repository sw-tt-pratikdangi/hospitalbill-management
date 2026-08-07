const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const {
    getBills, getBillById, createBill, updateBillStatus, deleteBill
} = require('../controllers/billController');

router.use(protect);

router.get('/', getBills);
router.get('/:id', getBillById);
router.post('/', createBill);
router.put('/:id/status', updateBillStatus);
router.delete('/:id', adminOnly, deleteBill);

module.exports = router;
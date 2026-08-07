const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const {
    getPatients, getPatientById, createPatient, updatePatient, deletePatient, getPatientList
} = require('../controllers/patientController');

router.use(protect); // every route below requires a valid token
router.get('/dropdown', getPatientList);
router.get('/', getPatients);
router.get('/:id', getPatientById);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', adminOnly, deletePatient);

module.exports = router;
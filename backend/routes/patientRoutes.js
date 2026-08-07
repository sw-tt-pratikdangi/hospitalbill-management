const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
    getPatients, getPatientById, createPatient, updatePatient, deletePatient
} = require('../controllers/patientController');

router.use(protect); // every route below requires a valid token

router.get('/', getPatients);
router.get('/:id', getPatientById);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;
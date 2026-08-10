const Patient = require('../models/Patient');
const getNextSequence = require('../utils/getNextSequence');

exports.checkPhoneExists = async (req, res) => {
    const { phone } = req.params;
    const { excludeId } = req.query; // used on the Edit form, to ignore the patient's own record

    const query = { phone };
    if (excludeId) query._id = { $ne: excludeId };

    const existing = await Patient.findOne(query).select('name patientId phone');
    res.json({ exists: !!existing, patient: existing || null });
};

exports.getPatientList = async (req, res, next) => {
    try {

        const patients = await Patient.find(
            {},
            {
                name: 1,
                phone: 1,
                email: 1
            }
        ).sort({ name: 1 });

        res.json(patients);

    } catch (error) {
        next(error);
    }
};

exports.getPatients = async (req, res, next) => {
    try {

        // Read query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        // Total number of records
        const totalRecords = await Patient.countDocuments();

        // Fetch only current page records
        const patients = await Patient.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            data: patients,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalRecords,
                totalPages: Math.ceil(totalRecords / limit),
                hasNextPage: page < Math.ceil(totalRecords / limit),
                hasPreviousPage: page > 1
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.getPatientById = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (error) {
        next(error);
    }
};

exports.createPatient = async (req, res) => {
    const seq = await getNextSequence('patientId');
    const patientId = 'P' + String(seq).padStart(3, '0');

    try {
        const patient = new Patient({ ...req.body, patientId });
        const saved = await patient.save();
        res.status(201).json(saved);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'A patient with this phone number already exists' });
        }
        throw err; // let errorHandler.js handle anything unexpected
    }
};

exports.updatePatient = async (req, res, next) => {
    try {
        const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Patient not found' });
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

exports.deletePatient = async (req, res, next) => {
    try {
        const deleted = await Patient.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Patient not found' });
        res.json({ message: 'Patient deleted' });
    } catch (error) {
        next(error);
    }
};
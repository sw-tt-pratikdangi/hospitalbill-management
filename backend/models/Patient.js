const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patientId: { type: String, unique: true }, // e.g. "P001"
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    phone: { type: String, required: true, unique: true }, // <-- added unique
    address: { type: String },
    admissionDate: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);
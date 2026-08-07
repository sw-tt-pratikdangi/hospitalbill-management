const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    name: { type: String, required: true },   // snapshot of service name at billing time
    price: { type: Number, required: true },  // snapshot of price at billing time
    quantity: { type: Number, default: 1 }
});

const billSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    items: [billItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Partial'], default: 'Unpaid' }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
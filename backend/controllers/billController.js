const Bill = require('../models/Bill');

exports.getBills = async (req, res) => {
    const bills = await Bill.find().populate('patient', 'name phone').sort({ createdAt: -1 });
    res.json(bills);
};

exports.getBillById = async (req, res) => {
    const bill = await Bill.findById(req.params.id).populate('patient');
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json(bill);
};

exports.createBill = async (req, res) => {
    const { patient, items, discount = 0, tax = 0 } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'A bill needs at least one service item' });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const grandTotal = subtotal - discount + tax;

    const bill = new Bill({ patient, items, subtotal, discount, tax, grandTotal });
    const saved = await bill.save();
    const populated = await saved.populate('patient', 'name phone');
    res.status(201).json(populated);
};

exports.updateBillStatus = async (req, res) => {
    const { status } = req.body;
    const updated = await Bill.findByIdAndUpdate(req.params.id, { status }, { new: true })
        .populate('patient', 'name phone');
    if (!updated) return res.status(404).json({ message: 'Bill not found' });
    res.json(updated);
};

exports.deleteBill = async (req, res) => {
    const deleted = await Bill.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Bill not found' });
    res.json({ message: 'Bill deleted' });
};
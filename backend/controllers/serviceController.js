const Service = require('../models/Service');

exports.getServices = async (req, res) => {
    const services = await Service.find().sort({ category: 1, name: 1 });
    res.json(services);
};

exports.getServiceById = async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
};

exports.createService = async (req, res) => {
    const service = new Service(req.body);
    const saved = await service.save();
    res.status(201).json(saved);
};

exports.updateService = async (req, res) => {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Service not found' });
    res.json(updated);
};

exports.deleteService = async (req, res) => {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
};
const adminOnly = (req, res, next) => {
    // This runs AFTER `protect`, so req.user already exists and holds { id, role }
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

module.exports = adminOnly;
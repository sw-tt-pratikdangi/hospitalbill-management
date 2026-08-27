const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');


const generateToken = (user) => {
    return jwt.sign({
        id: user._id,
        role: user.role
    },
        process.env.JWT_SECRET,
        { expiresIn: '7d' });
};

// @desc   Register new user
// @route  POST /api/auth/register
// @access Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        const token = generateToken(user);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc   Auth user (Login)
// @route  POST /api/auth/login
// @access Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user);
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond the same way whether or not the email exists — avoids leaking which emails are registered
    const genericResponse = { message: 'If that email is registered, a reset link has been sent.' };

    if (!user) return res.json(genericResponse);

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

    try {
        await sendEmail({
            to: user.email,
            subject: 'Password Reset — Hospital Billing System',
            html: `
        <p>You requested a password reset.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a> (expires in 10 minutes).</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `
        });
    } catch (err) {
        // Roll back the token if the email genuinely failed to send, so a stale unusable token isn't left behind
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return res.status(500).json({ message: 'Email could not be sent, please try again later' });
    }

    res.json(genericResponse);
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Reset link is invalid or has expired' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
};
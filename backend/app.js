const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const errorHandler = require('./middleware/errorHandler');
const assistantRoutes = require('./code-assistant/assistant');

const app = express();

// --------------------------------------------------
// Security middleware
// --------------------------------------------------

app.use(cors({
    origin: [
        'http://localhost:4200',
        process.env.CLIENT_URL
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());

// --------------------------------------------------
// Body parsing middleware
// --------------------------------------------------

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

// Prevent HTTP Parameter Pollution
app.use(hpp());

// --------------------------------------------------
// General rate limiter
// --------------------------------------------------

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
});

app.use(generalLimiter);

// --------------------------------------------------
// Authentication rate limiter
// --------------------------------------------------

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        message: 'Too many attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// --------------------------------------------------
// Routes
// --------------------------------------------------

app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.use('/api/assistant', assistantRoutes);

// --------------------------------------------------
// Root route
// --------------------------------------------------

app.get('/', (req, res) => {
    res.send('Hospital Bill Management API is running');
});

// --------------------------------------------------
// Error handler
// --------------------------------------------------

app.use(errorHandler);

module.exports = app;
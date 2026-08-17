const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');


dotenv.config();
connectDB();

const app = express();
// --- Security middleware (applied before routes) ---

app.use(cors({
    origin: [
        'http://localhost:4200',
        process.env.CLIENT_URL
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(express.json({ limit: '100kb' })); // caps request body size
app.use(express.urlencoded({ extended: true }));
app.use(hpp()); // blocks duplicate query-param pollution//

// General rate limit: applies to every request
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,                 // 200 requests per IP per window
    standardHeaders: true,
    legacyHeaders: false
});
app.use(generalLimiter);

// Stricter limit specifically on auth routes — this is the one that actually matters most
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // only 10 login/register attempts per IP per 15 minutes
    message: { message: 'Too many attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/', (req, res) => res.send('Hospital Bill Management API is running'));


// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
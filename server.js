const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Config
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (optional but useful)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ✅ Serve static files (THIS handles index.html automatically)
app.use(express.static(path.join(__dirname)));

// ✅ Health check (for ALB)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: "UP",
        environment: ENV
    });
});

// ✅ Readiness (optional)
app.get('/ready', (req, res) => {
    res.status(200).json({ ready: true });
});

// ❌ DO NOT add app.get('/') — express.static already handles it

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log("=================================");
    console.log(`🚀 Server started`);
    console.log(`🌍 Environment : ${ENV}`);
    console.log(`📡 URL         : http://localhost:${PORT}`);
    console.log("=================================");
});

// Graceful shutdown (for ECS)
process.on('SIGTERM', () => {
    console.log('Shutting down...');
    process.exit(0);
});

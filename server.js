const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

// Logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health (Liveness)
app.get('/health', (req, res) => {
    res.status(200).json({ status: "UP", environment: ENV });
});

// Readiness
app.get('/ready', (req, res) => {
    res.status(200).json({ ready: true });
});

app.listen(port, '0.0.0.0', () => {
    console.log("=================================");
    console.log(`🚀 Server started`);
    console.log(`🌍 Environment : ${ENV}`);
    console.log(`📡 URL         : http://localhost:${port}`);
    console.log("=================================");
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down...');
    process.exit(0);
});

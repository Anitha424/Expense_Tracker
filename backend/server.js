const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const recurringRoutes = require('./routes/recurringRoutes');
const reportRoutes = require('./routes/reportRoutes');
const incomeTargetRoutes = require('./routes/incomeTargetRoutes');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

// Log startup message
console.error('🚀 Starting backend server...');
console.error('Initializing database connection...');

connectDB();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const clientBuildCandidates = [
  path.join(__dirname, '../frontend/dist'),
  path.join(__dirname, '../frontend/build'),
  path.join(__dirname, '../client/dist'),
  path.join(__dirname, '../client/build'),
];
const clientBuildPath = clientBuildCandidates.find((p) => fs.existsSync(p));
const allowedOrigins = (process.env.CLIENT_URL || '*').split(',').map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
  })
);
app.use(express.json());

if (isProduction && clientBuildPath) {
  app.use(express.static(clientBuildPath));
}

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/income', incomeTargetRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

if (isProduction && clientBuildPath) {
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.error(`✅ Server running on port ${PORT}`);
  console.error(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
  if (isProduction) {
    console.error(
      clientBuildPath
        ? `🧩 Serving client from: ${clientBuildPath}`
        : '⚠️  Production mode enabled, but no client build directory found'
    );
  }
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const registrationRoutes = require('./src/routes/registrationRoutes');
const teamRoutes = require('./src/routes/teamRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const qrRoutes = require('./src/routes/qrRoutes');
const healthController = require('./src/controllers/healthController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/qr', qrRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'EventNexus API is running' });
});

// Database check
app.get('/api/health/database', healthController.checkDatabase);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Database check: http://localhost:${PORT}/api/health/database`);
});

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
// Route imports
const clubRoutes = require('./routes/clubRoutes');
const productRoutes = require('./routes/productRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const orderRoutes = require('./routes/orderRoutes');
// Connect to database
connectDB();
const app = express();
// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static uploads folder (fallback for local uploads)
app.use('/uploads', express.static('uploads'));
// API Routes
app.use('/api/clubs', clubRoutes);
app.use('/api/products', productRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/orders', orderRoutes);
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Voûte API is running',
    timestamp: new Date().toISOString(),
  });
});
// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Voûte Jersey Shop API',
    version: '1.0.0',
  });
});
// Error handler (must be last)
app.use(errorHandler);
module.exports = app;

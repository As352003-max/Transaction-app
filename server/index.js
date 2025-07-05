require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

const allowedOrigins = [
  'http://localhost:5173',
  'https://transaction-app-xi.vercel.app/'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

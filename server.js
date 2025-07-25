const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); 

// Routes
app.use('/api/products', productRoutes); 

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Smart Inventory Management API is running!' });
});

// Debug: Check if environment variable is loaded
console.log('MONGO_URI loaded:', process.env.MONGO_URI ? 'Yes' : 'No');
if (!process.env.MONGO_URI) {
  console.error(' MONGO_URI not found in environment variables');
  process.exit(1);
}

// DB connection with better error handling
console.log(' Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log(' MongoDB connected successfully to Codved database');
  console.log(' Database:', mongoose.connection.name);
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` API available at: http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error(' DB connection error:', err.message);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n Shutting down gracefully...');
  await mongoose.connection.close();
  console.log(' MongoDB connection closed.');
  process.exit(0);
});
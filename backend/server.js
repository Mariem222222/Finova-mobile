const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const app = express();
const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: user._id }, 'your-secret-key');
res.json({ token, user: userData });

// Middleware must come BEFORE routes
app.use(cors({
  origin: '*', // Allow all origins (for testing)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);

// Rest of your code...
// Connect to MongoDB (local or cloud)
mongoose.connect('mongodb://localhost:27017/Register', {
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a simple route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
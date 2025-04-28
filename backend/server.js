const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { router: authRouter } = require('./routes/auth');
const app = express();
const transactionRoutes = require('./routes/transaction');

app.use(cors({ origin: '*' }));
app.use(bodyParser.json()); 
// Routes
app.use('/api/transaction', transactionRoutes);
app.use('/api/auth', authRouter); 
mongoose.connect('mongodb://localhost:27017/Mobile', {
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start server
const PORT = 3000;
app.listen(PORT,'0.0.0.0',() => {
  console.log(`Server running on http://localhost:${PORT}`);
});
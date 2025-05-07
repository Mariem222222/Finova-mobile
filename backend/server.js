const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
const app = express();
connectDB();
const transactionRoutes = require('./routes/transaction');
const budget=require('./routes/budgets')
const userRoutes = require('./routes/user');
const dataRoutes = require('./routes/data');
app.use(cors({ origin: '*' }));
app.use(bodyParser.json()); 
// Routes
app.use('/api/transaction', transactionRoutes);
app.use('/api/auth', authRouter); 
app.use('/api/user', userRoutes);
app.use('/api/data', dataRoutes); 
app.use('/api/budgets',budget);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start server
const PORT = 3000;
app.listen(PORT,'0.0.0.0',() => {
  console.log(`Server running on http://localhost:${PORT}`);
});
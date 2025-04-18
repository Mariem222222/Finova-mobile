const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { router: authRouter } = require('./routes/auth');


const app = express();
const transactionRoutes = require('./routes/transaction');

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json()); 

// Routes
app.use('/api/auth', authRouter); // ✅ now it's a proper function
mongoose.connect('mongodb://localhost:27017/Mobile', {
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/transaction', transactionRoutes);


app.get('/', (req, res) => {
  res.send('Backend is running!');
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
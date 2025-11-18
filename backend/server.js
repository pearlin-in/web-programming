console.log("--- THIS IS THE CORRECT SERVER FILE ---");

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  console.log("Test endpoint was called");
  res.json({ status: "Backend is alive" });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/savings', require('./routes/funds'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/categories', require('./routes/categories'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server running on port ' + port));

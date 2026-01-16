// Import express
const express = require('express');
const app = express();
const db = require('./config/db');


// Middleware to parse JSON
app.use(express.json());


// Test route
// app.get('/', (req, res) => {
//   res.send('Hello Node.js!');
// });

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

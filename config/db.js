const mysql = require('mysql2');
require('dotenv').config();

const connection  = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node_practice'
});

// connection.connect((err) => {
//   if (err) {
//     console.error('Database connection failed:', err);
//   } else {
//     console.log('MySQL connected...');
//   }
// });

module.exports = connection;

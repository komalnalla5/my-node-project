const db = require("../config/db");

//Get all users
exports.getAllUsers= callback =>{
    db.query("SELECT * FROM users",callback);
};

// Fetch user data by user ID
exports.getUserById = (id,callback)=>{
    db.query("SELECT * FROM users WHERE id = ?", [id],callback);
};

//Manage phone uniqe value
exports.checkPhoneExists = (phone, callback) => {
  db.query(
    "SELECT id FROM users WHERE contact_no = ?", //check request phone value with table have that value
    [phone],
    (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0); //if have then send true other wise false
    }
  );
};

//Manage email uniqe value
exports.checkEmailExists = (email, callback)=>{
    db.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
        (err, results) => {
            if(err) return callback (err);
            callback(null, results.length > 0); //return true false
        }
    )
};

//Create new user
exports.addUser = (userData,callback)=>{
    db.query("INSERT INTO users SET ?",userData,callback);
};

//Update user
exports.updateUser=(id,userData,callback) => {
    db.query("UPDATE users SET ? WHERE id = ?", [userData, id], callback);
};

// //Delete users
// exports.deleteUser= (id,callback) => {
//     db.query("DELETE from users WHERE id = ?",[id],callback);
// };
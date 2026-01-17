const { json } = require("body-parser");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");

//Get all users data
exports.getUsers = (req, res) => {
  User.getAllUsers((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

//Get user by id
exports.getUserData =(req, res)=>{
    User.getUserById(req.params.id, (err, results)=> {
        if (err) return res.status(500).json({ error: err.message });
        if(results.length === 0) return res.status(400).json({ message: "User not found" });
        res.json(results[0]);
    });
}

//Add new user
exports.addUserData = (req, res) => {
    //handle validation
    const errors = validationResult(req);
        if (!errors.isEmpty()) { //If there ARE validation errors
        return res.status(422).json({ errors: errors.array() }); //return from here with error 
    }    

    // image check
    const path = require("path");

        if (!req.file) {
           return res.status(400).json({ error: "Profile image required" });
        }

        // create unique file name
        const timestamp = Date.now();
        const ext = path.extname(req.file.originalname);
        const fileName = `${timestamp}${ext}`;

        const userData = {
        ...req.body,
        profile: fileName 
        };


    //uniqe phone number validation manage
    User.checkPhoneExists(userData.contact_no, (err, phoneExists)=> {
       if (err) return res.status(500).json({ error: err.message });

       if(phoneExists){
          return res.status(409).json({ error: "Phone number already exists" });
       }
       
        //uniqe email validation manage
        User.checkEmailExists (userData.email,(err,EmailExists) => {
            if(err) return res.status(500).json({error: err.message});

             if(EmailExists){
                return res.status(409).json({error:"Email is alredy exists, please enter uniqe email address"});
             }

        User.addUser(userData,(err, results)=> {
            if(err) return res.status(500).json({error: err.message});
            res.status(201).json({ message: "User succefully created", userId: results.insertId });
        });

        });
    });

    //all comon store into table without validation and image
    // User.addUser(req.body,(err, results)=> { 
    //     if(err) return res.status(500).json({error: err.message});
    //     res.status(201).json({ message: "User succefully created", userId: results.insertId });
    // });

}

//--------------------------------------------------------------------------------

//Update user data
exports.updateUserData = (req, res) => {

    const { validationResult } = require("express-validator");
    const fs = require("fs"); //NOTE: node.js inbulit function File System (read file,rename file,delete file ,change file)
    const path = require("path");

    //  handle validation (from updateUserValidation)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const userId = req.params.id; //id wise update

    //nothing sent
    if (Object.keys(req.body).length === 0 && !req.file) {
        return res.status(400).json({ error: "No data provided to update" });
    }

    // get existing user
    User.getUserById(userId, (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: "User not found" });

        let userData = { ...req.body };

        // image update
        if (req.file) {
            // delete old image
            if (user.profile) {
                const oldPath = path.join(__dirname, "../uploads/", user.profile);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            const timestamp = Date.now();
            const ext = path.extname(req.file.originalname);
            const fileName = `${timestamp}${ext}`;
            userData.profile = fileName;
        }

        // unique phone check (only if changed)
        if (userData.contact_no && userData.contact_no !== user.contact_no) {
            return User.checkPhoneExists(userData.contact_no, (err, phoneExists) => {
                if (err) return res.status(500).json({ error: err.message });
                if (phoneExists) {
                    return res.status(409).json({ error: "Phone number already exists" });
                }
                checkEmail();
            });
        }

        checkEmail();

        // unique email check (only if changed)
        function checkEmail() {
            if (userData.email && userData.email !== user.email) {
                return User.checkEmailExists(userData.email, (err, emailExists) => {
                    if (err) return res.status(500).json({ error: err.message });
                    if (emailExists) {
                        return res.status(409).json({ error: "Email already exists" });
                    }
                    updateUser();
                });
            }
            updateUser();
        }

        // 6️⃣ update user
        function updateUser() {
            User.updateUser(userId, userData, (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "User updated successfully" });
            });
        }
    });
};


// Delete user
exports.deleteUser = (req, res) => {
  User.deleteUser(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted succefully" });
  });
};

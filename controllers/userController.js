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
}
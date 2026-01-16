const express = require("express");
const router = express.Router();
const multer = require('multer');
const userController = require("../controllers/userController");
const { createUserValidation } = require("../validators/UserValidator");
const path = require("path");

//image store into folder 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users"); // 👈 folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName); // 👈 saved file name
  }
});

/* image upload */
const upload = multer({
    storage: storage,   //very import  for store image into folder
    limits: { fileSize: 2 * 1024 * 1024 },

    fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".jfif"];
    const ext = path.extname(file.originalname).toLowerCase();

        if (
            allowedMimeTypes.includes(file.mimetype) ||
            allowedExtensions.includes(ext)
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }

    }
});

//NOTE: this is post route where need to call validation and controller file also uplod method here call so no
//need to do image validation code into controller there we just check if condition thas it
router.post(
  "/save",
  upload.single("profile"),       // image
  createUserValidation,           // validation
  userController.addUserData      // controller
);

/* route */
router.get("/", userController.getUsers); //fetch all users
router.get("/:id", userController.getUserData); //fetch user by id

//all must be line wise order matter 
router.put(
  "/update/:id",
  upload.single("profile"),   // image 
  updateUserValidation,       // validation
  userController.updateUser   // controller
);

module.exports = router;

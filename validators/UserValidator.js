const { body } = require("express-validator");



exports.createUserValidation = [
    body("name")
      .optional()
    .notEmpty()
    .withMessage("Name is required"),

    body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

    body("contact_no")
    .notEmpty()
    .withMessage("Contact number is required")
    .isNumeric()
    .withMessage("Contact number must contain only digits")
    .isLength({ min: 10, max: 10 })
    .withMessage("Contact number must be 10 digits"),

    body("age")
    .notEmpty()
    .withMessage("Age is required")
    .isNumeric()
    .withMessage("Age must be numeric"),

    body("gender")
    .notEmpty()
    .withMessage("Gender is required"),

    body("hobbey")
    .notEmpty()
    .withMessage("Hobby is required")
];

exports.requireFields = (fields = []) => {
  return (req, res, next) => {
    const missing = fields.filter(field => !req.body[field]);

    if (missing.length) {
      return res.status(422).json({
        message: "Missing required fields",
        fields: missing
      });
    }

    next();
  };
};

exports.updateUserValidation = [
  body("name")
    .optional() //added this for update in all filed
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("email")
    .optional()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Invalid email"),

  body("contact_no")
    .optional()
    .notEmpty()
    .withMessage("Contact cannot be empty")
    .isNumeric()
    .withMessage("Contact must be numeric")
    .isLength({ min: 10, max: 10 })
    .withMessage("Must be 10 digits"),

  body("age")
    .optional()
    .notEmpty()
    .withMessage("Age cannot be empty"),

  body("gender")
    .optional()
    .notEmpty()
    .withMessage("Gender cannot be empty"),

  body("hobbey")
    .optional()
    .notEmpty()
    .withMessage("Hobby cannot be empty"),
];


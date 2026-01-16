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

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require("mongoose-type-email");

const emailValidationSchema = new Schema(
  {
    email: {
      type: mongoose.SchemaTypes.Email,
      required: true,
      unique: true,
    },
    validationCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var EmailValidation = mongoose.model("EmailValidation", emailValidationSchema);

module.exports = EmailValidation;
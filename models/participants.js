const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require("mongoose-type-email");

const participantSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    hideLastName: {
      type: Boolean,
      default: false,
    },

    gender: {
      type: String,
      enum: ["male", "female", "diverse"],
      required: true,
    },

    yearOfBirth: {
      type: Number,
      required: true,
    },

    email: {
      type: mongoose.SchemaTypes.Email,
      required: true,
      unique: true
    },

    emailIsValid: {
      type: Boolean,
      required: true,
      deafult: false
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  },
  {
    timestamps: true,
  }
);

var Participants = mongoose.model("Participant", participantSchema);

module.exports = Participants;
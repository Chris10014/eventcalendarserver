const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        default: false
    },

    gender: {
      type: String,
      required: true,
    },

    yearOfBirth: {
      type: Number,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: "",
    },

    estimatedFinishTime: {
      type: String,
      default: "",
    },

    acceptTermsAndConditions: {
      type: Date,
      required: true,
    },

    acceptRaceInfo: {
      type: Date,
      required: true,
    },

    validationCode: {
        type: String,
        default: "1234"
    }
  },
  {
    timestamps: true,
  }
);

var Participants = mongoose.model("Participant", participantSchema);

module.exports = Participants;
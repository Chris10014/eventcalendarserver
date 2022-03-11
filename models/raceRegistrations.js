const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const raceRegistrationSchema = new Schema({
  date: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "date",
  },
  race: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "race",
  },
  regOpen: {
    type: Boolean,
    default: false,
  },
  results: [
    {
      participantId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      confirmedTermsCoditions: {
        type: Boolean,
        required: true,
      },
      confirmedRaceInfo: {
        type: Boolean,
        required: true,
      },
      ageGroup: {
        type: String,
        required: true,
      },
      estFinishtime: {
        type: String,
      },
      bibNumber: {
        type: Number,
      },
      startTime: {
        type: String,
      },
      bruttoFinishtime: {
        type: String,
      },
      nettoFinishtime: {
        type: String,
      },
      rank: {
        type: Number,
      },
    },
  ],
});

var RaceRegistrations = mongoose.model("RaceRegistration", raceRegistrationSchema);

module.exports = RaceRegistrations;

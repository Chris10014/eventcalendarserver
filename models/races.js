const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sport",
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
});

const raceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sport",
  },
  competition: {
    type: Boolean,
    default: true,
  },
  virtual: {
    type: Boolean,
    default: false,
  },
  multisport: {
    type: Boolean,
    default: false,
  },
  membersOnly: {
    type: Boolean,
    default: false,
  },
  courses: [courseSchema],
});

var Races = mongoose.model("Race", raceSchema);

module.exports = Races;

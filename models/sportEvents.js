const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dateSchema = new Schema({
  from: {
    type: Date,
    default: ""
  },
  to: {
    type: Date,
    default:  ""
  }
});

const raceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    racedates: [dateSchema]
});

const SportEventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    host: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    visual: {
      type: String,
      required: true,
    },
    homepage: {
      type: String,
      required: true,
    },
    dates: [dateSchema],
    city: {
      type: String,
      required: true,
    },
    postalCode: {
        type: Number,
        required: true
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Countries"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    featured: {
      type: Boolean,
      default: false,
    },
    races: [raceSchema],
  },
  {
    timestamps: true,
  }
);

var SportEvents = mongoose.model("SportEvent", SportEventSchema);

module.exports = SportEvents;
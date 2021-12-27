const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const raceSchema = new Schema({
  race: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Race"
  }
});

const dateSchema = new Schema({
  date: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Date"
  }
});

const sportEventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    logo: {
      type: String,
      required: true,
    },
    visual: {
      type: String,
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
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    owners: [ownerSchema],

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

var SportEvents = mongoose.model("SportEvent", sportEventSchema);

module.exports = SportEvents;
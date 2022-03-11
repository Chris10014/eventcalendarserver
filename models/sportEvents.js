const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
      required: true,
    },
    logo: {
      type: String,
    },
    visual: {
      type: String,
    },
    homepage: {
      type: String,
      required: true,
    },
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    races: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Race",
      },
    ],
  },
  {
    timestamps: true,
  }
);

var SportEvents = mongoose.model("SportEvent", sportEventSchema);

module.exports = SportEvents;
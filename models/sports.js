const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sportSchema = new Schema(
  {
    abbr: {
      type: String,
      required: true,
      unique: true,
    },
    sport_de: {
      type: String,
      required: true,
      unique: true,
    },
    sport_en: {
      type: String,
      required: true,
      unique: true,
    },
    verb_de: {
      type: String,
    },
    verb_en: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

var Sports = mongoose.model("Sport", sportSchema);

module.exports = Sports;
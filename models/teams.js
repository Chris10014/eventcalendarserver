const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: {
    type: String,
    unique: true,
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
    required: true
  },
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sport"
  }
});

var Teams = mongoose.model("Team", teamSchema);

module.exports = Teams;

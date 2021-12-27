const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dateSchema = new Schema({
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    default: "",
  },
  sportEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SportEvent",
    required: true
  }
});

var Dates = mongoose.model("Date", dateSchema);

module.exports = Dates;
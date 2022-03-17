const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dateSchema = new Schema({
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
  },
  sportEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SportEvent",
  },
  regOpen: {
    type: Boolean,
    default: false
  },
  races: [
    {
      type: Schema.Types.ObjectId,
      ref: "Race",
    },
  ],
});

var Dates = mongoose.model("Date", dateSchema);

module.exports = Dates;
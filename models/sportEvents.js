const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dateSchema = new Schema({
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    default:  ""
  }
});



const sportEventSchema = new Schema(
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
      type: String
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
    owners: [
      {
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
        
      }
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    races: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Races"
    }],
  },
  {
    timestamps: true,
  }
);

var SportEvents = mongoose.model("SportEvent", sportEventSchema);

module.exports = SportEvents;
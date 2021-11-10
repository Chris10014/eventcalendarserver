const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sportSchema = new Schema(
  {
      abbreviation: {
          type: String,
          required: true,
          unique: true
      },
      noun_de: {
        type: String,
        required: true,
        unique: true 
      },
      noun_en: {
          type: String,
          required: true,
          unique: true
      },  
      verb_de: {
        type: String,
        required: true,
        unique: true 
      },
      verb_en: {
          type: String,
          required: true,
          unique: true
      }
  },
  {
    timestamps: true,
  });

var Sports = mongoose.model("Sport", sportSchema);

module.exports = Sports;
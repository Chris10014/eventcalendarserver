const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySchema = new Schema ({
    phoneCode: {
        type: Number,
        required: true
    },

    countryCode: {
        type: String,
        required: true
    },

    countryNameEn: {
        type: String,
        required: true
    },

    countryNameDe: {
        type: String,
        default: ""
    },

    alpha_3: {
        type: String,
        default: ""
    },

    continentCode: {
        type: String,
        default: true
    },

    continentNameEn: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Countries = mongoose.model("Country", countrySchema);

module.exports = Countries;
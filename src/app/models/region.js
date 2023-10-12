//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RegionSchema = new Schema({
    region_code: {type: String},
    region_name: {type: String},  
    region_note: {type: String,min:[10]},  
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('regions', RegionSchema)

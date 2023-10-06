//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RegionSchema = new Schema({
    region_id: {type: String},
    region_name: {type: String},  
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('regions', RegionSchema)

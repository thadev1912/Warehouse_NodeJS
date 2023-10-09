//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PositionSchema = new Schema({
    position_id: {type: String},
    position_name: {type: String},  
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('positions', PositionSchema)
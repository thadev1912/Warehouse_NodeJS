
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const LocationSchema = new Schema({  
    location_code:{type: String},   
    location_name: {type: String},   
    note: {type: String},   
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('location_imss', LocationSchema)

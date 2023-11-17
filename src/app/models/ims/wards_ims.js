
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const WardsSchema = new Schema({    
    wards_id: {type: String},   
    wards_name: {type: String},   
    wards_note:{type: String},
    district_id: {type: String},  
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('wards_imss', WardsSchema)

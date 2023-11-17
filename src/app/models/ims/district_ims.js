
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DistrictSchema = new Schema({    
    district_id: {type: String},   
    district_name: {type: String},     
    district_note:{type: String},
    province_id:{type: String},   
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('district_imss', DistrictSchema)

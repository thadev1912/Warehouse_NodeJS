
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProvinceSchema = new Schema({  
    province_id:{type: String},   
    province_name: {type: String},   
    province_note:{type: String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('province_imss', ProvinceSchema)
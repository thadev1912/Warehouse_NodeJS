//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const StandardSchema = new Schema({    
    standard_code:{type:String},    
    standard_name:{type:String},    
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('wms_standards', StandardSchema)

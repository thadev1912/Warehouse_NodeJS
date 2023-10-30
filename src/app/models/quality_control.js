//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const QualityControlSchema = new Schema({    
    quality_control_code: {type: String},  
    jobsheet_code: {type: String},
    quality_control_create_date: {type: String},
    user_id: {type: String},
    quality_control_specification: {type: String},
    quality_control_note: {type: String},
    quality_control_status: {type: String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('quality_controls', QualityControlSchema)

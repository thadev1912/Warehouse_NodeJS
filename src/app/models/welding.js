//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const WeldingSchema = new Schema({    
    jobsheet_code: {type: String},  
    welding_create_date: {type: String},
    welding_status: {type: String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('weldings', WeldingSchema)

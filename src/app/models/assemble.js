//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AssembleSchema = new Schema({    
    jobsheet_code: {type: String},  
    assemble_create_date: {type: String},
    assemble_status: {type: String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('assembles', AssembleSchema)

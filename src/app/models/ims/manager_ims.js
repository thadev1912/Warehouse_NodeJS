//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ManagerIMSSchema = new Schema({    
    area_name: {type: String,},  
    installed: {type: String},
    next_phase: {type: String},
    note:{type: String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('manager_imss', ManagerIMSSchema)

//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DepartmentSchema = new Schema({    
    department_code: {type: String,require:true},  
    department_name: {type: String,require:true},
    department_note: {type: String,require:true},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('departments', DepartmentSchema)

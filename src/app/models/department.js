//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DepartmentSchema = new Schema({
    department_id: {type: Number},
    department_code: {type: String},  
    department_name: {type: String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('departments', DepartmentSchema)

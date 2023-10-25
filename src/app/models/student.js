//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const StudentSchema = new Schema({   
    student_code: {type: String,require:true},  
    student_name: {type: String,require:true},
    class: {type: String,require:true},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('students', StudentSchema)
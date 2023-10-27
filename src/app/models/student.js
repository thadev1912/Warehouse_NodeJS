//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const StudentSchema = new Schema({   
    Student_Code: {type: String,require:true},  
    Student_LastName: {type: String,require:true},
    Student_FirstName: {type: String,require:true},  
    Student_LastName: {type: String,require:true},
    Address: {type: String,require:true},
    Phone: {type: String,require:true},  
    Gender: {type: String,require:true},
    Course: {type: String,require:true},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('students', StudentSchema)


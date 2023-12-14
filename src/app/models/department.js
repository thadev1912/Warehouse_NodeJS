//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DepartmentSchema = new Schema({
    department_code: { type: String, require: true },
    department_name: { type: String, require: true },
    department_note: { type: String, require: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});
DepartmentSchema.pre('save', function (next) {   
   
    if (this.isNew) {
        console.log('ban đang tạo mới');
        this.created = new Date();
        this.updated = new Date();        
    }    
    next();
});
DepartmentSchema.pre(["updateOne", "findByIdAndUpdate", "findOneAndUpdate"], function (next) { 
        console.log('ban đang cập nhật');       
        this.updated = new Date();    
        next();
});
const Department = mongoose.model('departments', DepartmentSchema);
module.exports = Department;
//module.exports = mongoose.model('departments', DepartmentSchema)

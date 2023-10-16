//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductTypeSchema = new Schema({    
    product_type_code: {type: String,require:true},  
    product_type_name: {type: String,require:true},
    product_type_note: {type: String,require:true},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('product_types', ProductTypeSchema)

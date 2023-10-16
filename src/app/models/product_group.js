//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductGroupSchema = new Schema({
    product_group_code: {type: String},
    product_group_name: {type: String}, 
    product_group_note: {type: String},  
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('product_groups', ProductGroupSchema)

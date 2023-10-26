//  src/models/PostModels.js
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ProductSchema = new Schema({    
    product_code:{type:String},
    product_serial:{type:String},
    jobsheet_id :{type: Schema.Types.ObjectId},
    product_assembler:{type:String},
    product_tester:{type:String},
    product_assembly_date:{type:Date},
    product_test_date:{type:Date},
    semi_product_id:{type: Schema.Types.ObjectId},
    product_status:{type:String},
    product_result:{type:String},
    product_note:{type:String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
});

module.exports = mongoose.model('products', ProductSchema)

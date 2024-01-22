//  src/models/PostModels.js
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ProductSchema = new Schema({    
    product_code:{type:String},
    product_serial:{type:String},
    jobsheet_code :{type:String},
    product_id:{type:String},
    product_name:{type:String},
    product_assembler:{type:String},
    product_tester:{type:String},
    product_assembly_date:{type:Date},
    product_test_date:{type: Date},
    semi_product_id:{type: Schema.Types.ObjectId},
    product_status:{type:String},
    product_result:{type:String},
    product_note:{type:String},
    product_unit:{type:String},
    product_assemble_status:{type:String},
    product_qc_status:{type:String},
    quality_control_id:{type:String},
    semi_product_lot:{type:String},
    product_used:{type:String,default:0},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
});

module.exports = mongoose.model('products', ProductSchema)

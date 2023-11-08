//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SemiProductSchema = new Schema({
    semi_product_lot: {type: String},
    semi_product_code: {type: String}, 
    semi_product_name: {type: String}, 
    semi_product_unit: {type: String},
    semi_product_assembler: {type: String}, 
    semi_product_tester: {type: String},  
    semi_product_assembly_date: {type: String}, //ngày hoàn thành
    semi_product_test_date: {type: String}, 
    expiration_date:{type:Date},   // ngày hết hạn 
    semi_product_status: {type: String},  
    semi_product_result: {type: String},     
    semi_product_note: {type: String}, 
    activation_date:{type: Date},  //ngày kích hoạt
    purpose:{type: String},
    jobsheet_code:{type:String},
    categories_sim_id:{type:String},
    sim_package_id:{type:String},
    semi_product_welding_status:{type:String},
    semi_product_qc_status:{type:String},
    quality_control_id:{type:String},
    semi_product_used:{type:String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('semi_products', SemiProductSchema)

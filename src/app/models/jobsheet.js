const mongoose = require('mongoose')
const Schema = mongoose.Schema
const JobSheetSchema = new Schema({ 
    jobsheet_code: {type: String},
    jobsheet_create_date: {type: Date},
    jobsheet_finish_date: {type: Date},
    jobsheet_purpose: {type: String},    
    production_order_code: {type: String},
    user_id: {type: Schema.Types.ObjectId},
    product_id: {type: Schema.Types.ObjectId},   // mã sản phẩm
    product_name:{type: String},  // tên sản phẩm
    BOM_code:{type: String},
    product_unit:{type: String},
    product_quantity:{type:Number},
    product_type_id:{type: Schema.Types.ObjectId}, 
    product_range_id:{type: String}, 
    specification:{type: String},  //quy cách
    jobsheet_note:{type: String}, 
    production_type:{type: String}, //loại sản phẩm
    jobsheet_status:{type: String}, 
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
});
module.exports = mongoose.model('jobsheets', JobSheetSchema)

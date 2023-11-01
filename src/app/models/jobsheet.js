const mongoose = require('mongoose')
const Schema = mongoose.Schema
const JobSheetSchema = new Schema({ 
    jobsheet_code: {type: String},
    jobsheet_create_date: {type: String},
    jobsheet_finish_date: {type: Date},
    jobsheet_purpose: {type: String},    
    production_order_code: {type: String}, //mã YCSX
    user_id: {type: String},
    product_id: {type: String},   // mã sản phẩm 
    product_name:{type: String},  // tên sản phẩm
    BOM_code:{type: String},
    product_unit:{type: String},
    product_quantity:{type:Number},
    product_type_code:{type: String}, //loại thành phẩm hoặc bán thành phẩm  (obj)
    product_series_code:{type: String}, //(obj)
    specification:{type: String},  //quy cách
    jobsheet_note:{type: String}, 
    production_style:{type: String}, //kiểu sản xuất New or Fix (obj)
    jobsheet_status:{type: String}, 
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
});
module.exports = mongoose.model('jobsheets', JobSheetSchema)

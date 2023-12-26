const { number } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DetailProductOrderSchema = new Schema({  
     product_order_code:{type:String},
    detail_product_order_name:{type:String},
    detail_product_order_quantity:{type:Number},
    detail_product_order_unit:{type:String},
    detail_product_order_finish:{type:String},
    detail_product_order_packing:{type:String},
    detail_product_order_detail:{type:String}, 
    detail_product_order_purpose:{type:String}, 
    detail_product_order_type:{type:String},    
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
});

module.exports = mongoose.model('detail_product_orders', DetailProductOrderSchema)

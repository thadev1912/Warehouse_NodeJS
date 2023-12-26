const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductOrderSchema = new Schema({    
    product_order_No:{type:String},
    production_order_create: {type: String},  
    production_order_invoice:{type:String},
    user_create_by:{type:String},
    date_create_by:{type: Date},
    production_order_note:{type:String},
    production_order_status:{type:String},
    production_order_receiver:{type:String},
    purpose:{type:String},
    product_order_type:{type:Number},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
});
module.exports = mongoose.model('product_orders', ProductOrderSchema)

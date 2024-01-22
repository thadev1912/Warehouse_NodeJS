//  src/models/PostModels.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const DetailManagerWMSSchema = new Schema({     
    name_station: {type: String,}, 
    serial_sim:{type:String}, 
    serial_station:{type:String},
    installtion_date: {type: Date},
    installed:{type:Number,default:1},    
    active_status:{type: Number,default:1},
    address_of_station: {type: String},   
    version_board:{type:String},
    standard:{type:String},
    lot_board:{type:String},    
    area_id:{ type: String},
    location:{type:String}, //tọa độ
    location_area:{type:String},
    image:{type: String},     
    note:{type:String},
    created: {type: Date, default: Date.now},   
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('wms_detail_managers', DetailManagerWMSSchema)

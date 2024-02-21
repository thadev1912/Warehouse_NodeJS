//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SmartPumpSchema = new Schema({   
    seri_number:{type:String},
    serial_sim:{type:String},
    device_type:{type:String},
    active_code:{type:String},
    active_status:{type:String},
    topic_publish:{type:String}, //nhận 
    topic_subscribe:{type:String}, //gửi   
    IMEI_board:{type:String},
    entry_date:{type:String},
    production_date:{type:String},
    description:{type:String},    
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('smart_bump', SmartPumpSchema)

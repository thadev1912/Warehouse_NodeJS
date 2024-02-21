//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const GatewaySchema = new Schema({    
    gateway_code:{type:String},
    sim_number:{type:String},
    region:{type:String},
    topic_publish:{type:String}, //nhận 
    topic_subscribe:{type:String}, //gửi
    gateway_type:{type:String},
    gateway_status:{type:String},
    location:{type:String},
    address:{type:String},
    setup_date:{type:Date},
    description:{type:String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('gateway', GatewaySchema)

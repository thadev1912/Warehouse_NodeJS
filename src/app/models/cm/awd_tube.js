//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AWDTubeSchema = new Schema({    
    gateway_id:{type:String},
    awdTube_name:{type:String},
    awdTube_type:{type:String},
    installed_date:{type:Date},
    active_status:{type:String},
    description:{type:String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('awd_tube', AWDTubeSchema)

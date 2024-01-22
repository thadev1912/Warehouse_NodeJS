//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ManagerWMSSchema = new Schema({    
    area_id: {type: String},  
    installed: {type: Number,default:'0'},
    next_phase: {type: Number},
    active_status: {type: Number,default:0},   
    inactive_status: {type: Number,default:0},
    maintenance_status: {type: Number,default:0},
    totalStation:{type:Number},
    location_area:{type:String},
    note:{type: String},   
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('wms_managers', ManagerWMSSchema)

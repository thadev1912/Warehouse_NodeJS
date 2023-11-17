//  src/models/PostModels.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const DetailManagerIMSSchema = new Schema({      
    name_station: {type: String,},  
    installtion_date: {type: String},
    address_of_station: {type: String},
    customer:{type: String},
    image:{type: String},
    area_id:{ type: String},
    active_status:{type: String,default:'1'},
    detail_installtion:{type: String},
    location:{type:String},
    created: {type: Date, default: Date.now},   
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('detail_manager_imss', DetailManagerIMSSchema)

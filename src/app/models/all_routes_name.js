//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AllRoutersNameSchema = new Schema({   
    routes_code: {type: String,require:true},  
    routes_id:{type: String,require:true},  
    routes_name: {type: String,require:true},  
    routes_id_group:{type: String,default:null},
    routes_group: {type: String,require:true},  
    routes_note:{type: String,require:true}, 
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('all_routes_names', AllRoutersNameSchema)

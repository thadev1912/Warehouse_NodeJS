//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SimPackageSchema = new Schema({    
    sim_package_expiration: {type: String,require:true},  
    sim_package_description: {type: String,require:true},   
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('sim-packages', SimPackageSchema)

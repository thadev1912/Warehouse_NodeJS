//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RoleSchema = new Schema({
    role_id: {type: String},
    role_name: {type: String},  
    user_id: {type: String},  
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('roles', RoleSchema)
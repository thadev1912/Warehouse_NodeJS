//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    user_id: {type: String},
    username: {type: String},  
    fullname: {type: String},  
    password: {type: String},  
    email:{type: String},
    role:{type: String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('users', UserSchema)
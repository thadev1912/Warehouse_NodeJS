//  src/models/PostModels.js
const { number } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    user_code: {type: String},
    username: {type: String},  
    fullname: {type: String},  
    sex:{type: Boolean},
    address:{type: String},
    phone:{type: Number},
    password: {type: String},
    repeat_password:{type: String},
    email:{type: String},
    role_id:{type: String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('users', UserSchema)
//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    user_code: {type: String},
    username: {type: String},  
    fullname: {type: String},  
    gender:{type: Boolean},
    birthdate:{type: Date},    //new
    address:{type: String},
    phone:{type: Number},
    password: {type: String},
    repeat_password:{type: String},
    email:{type: String},
    email_verified_at:{type: String},  //new
    role_id:{type: String},
    position_id:{type: String},    //new
    region_id:{type: String},     //new
    department_id:{type: String},    //new
    avatar:{type: String},     //new
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('users', UserSchema)
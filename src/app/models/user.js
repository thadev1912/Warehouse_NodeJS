//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({     
    username: {type: String},  
    fullname: {type: String},  
    gender:{type: Boolean},
    birthday:{type: Date},    //new
    address:{type: String},
    phone:{type: Number},
    password: {type: String},
    repeat_password:{type: String},
    email:{type: String},
    email_verified_at:{type: String},  //new
    role_id:{type: String},
    position_id:{ type: Schema.Types.ObjectId},    //new
    region_id:{ type: Schema.Types.ObjectId},     //new
    department_id:{ type: Schema.Types.ObjectId},    //new
    avatar:{type: String},     //new
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('users', UserSchema)
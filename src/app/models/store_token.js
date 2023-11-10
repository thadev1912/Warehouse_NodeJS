//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const StoreTokenPwSchema = new Schema({    
    token_code: {type: String},
    email_code:{type: String}, 
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('token_resetpws', StoreTokenPwSchema)

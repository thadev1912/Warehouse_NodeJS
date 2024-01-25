//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NotificationSchema = new Schema({
    content_notification:{type:String},
    date_notification:{type: String},
    action_notification:{type:String},
    type_notification:{type:String},    
    created_by:{type:String},
    user_id:{type:String},
    is_read:{type:String,default:0},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('notifications', NotificationSchema)

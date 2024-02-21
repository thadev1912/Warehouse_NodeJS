const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NotificationUserSchema = new Schema({ 
    notify_id:{type:String},
    user_id:  { type:String},
    is_read:{type:String},      
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('notification_user', NotificationUserSchema)
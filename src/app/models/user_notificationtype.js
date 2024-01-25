//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserNotificationSchema = new Schema({ 
    user_id:  { type:String},
    notificationtype:[{ type: String }],    
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('user_notificationtype', UserNotificationSchema)
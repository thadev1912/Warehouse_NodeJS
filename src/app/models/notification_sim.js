//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NotificationSimSchema = new Schema({    
    content_notification:{type:String},
    date_notification:{type: String},
    user_id:{type:String},
    is_read:{type:String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
});
module.exports = mongoose.model('notification_sims', NotificationSimSchema)

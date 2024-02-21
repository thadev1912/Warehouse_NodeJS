//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NotificationTypeSchema = new Schema({
    notification_code:{type:String},
    notification_name:{type:String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('notification_types',  NotificationTypeSchema)
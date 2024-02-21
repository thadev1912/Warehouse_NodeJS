//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserRoleSchema = new Schema({ 
    user_id:  { type: Schema.Types.ObjectId},
    role_permission_id:{ type: Schema.Types.ObjectId,required: false},        
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('user_roles', UserRoleSchema)
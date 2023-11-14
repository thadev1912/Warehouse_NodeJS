//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RolePermissionSchema = new Schema({ 
    role_permission_name:  { type: String},
    role_permission_group: { type: String},    
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('role_permissions', RolePermissionSchema)
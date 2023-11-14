//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TestImageSchema = new Schema({ 
    image_path:  { type: String},  
    username:{ type: String},
    email:{ type: String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('test_images', TestImageSchema)
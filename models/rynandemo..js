//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DemoSchema = new Schema({
    title: {type: String},
    content: {type: String},
    poster: {type: Schema.Types.ObjectId},
    created: {type: Date, default: Date.now},
    updated: {type: Date}
});

module.exports = mongoose.model('demo', DemoSchema)

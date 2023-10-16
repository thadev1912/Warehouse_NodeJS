//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductSeriesSchema = new Schema({
    product_series_code: {type: String},
    product_series_name: {type: String}, 
    product_series_note: {type: String},  
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('product_series', ProductSeriesSchema)

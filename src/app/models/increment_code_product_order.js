//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const IncrementCodeProductOrderSchema = new Schema({
    invoice_number: { type: String },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});
module.exports = mongoose.model('increment_code_product_order', IncrementCodeProductOrderSchema)

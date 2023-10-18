//  src/models/PostModels.js
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const CategoriesSimSchema = new Schema({    
    serial_sim: {type: String},
    board_lot_number: {type: String}, 
    board_name: {type: String}, 
    sim_status: {type: String},
    activation_date: {type: String}, 
    expiration_date: {type: String},   
    deadline_warning: {type: String},
    purpose: {type: String}, 
    emanage_sim_note: {type: String},  
    sim_package_id: {type: Number},
    semi_product_id : {type: Number},
    sim_type: {type: String},    
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('categories_sims', CategoriesSimSchema)

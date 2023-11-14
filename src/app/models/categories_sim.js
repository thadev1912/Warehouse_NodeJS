//  src/models/PostModels.js
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const CategoriesSimSchema = new Schema({    
    serial_sim: {type: String},  
    sim_status: {type: String},
    activation_date: {type: Date}, 
    expiration_date: {type: Date},   
    deadline_warning: {type: String},
    purpose: {type: String}, 
    manage_sim_note: {type: String},  
    sim_package_id: {type: Number},
    semi_product_id : {type: String},
    sim_type: {type: String},    
    use_sim:{type: String}, 
    sim_package_id:{type: String},    
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
});
module.exports = mongoose.model('categories_sims', CategoriesSimSchema)

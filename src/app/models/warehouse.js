const mongoose = require('mongoose')
const Schema = mongoose.Schema
const WarehouseSchema = new Schema({  
    No_invoice:  {type: String},  
    jobsheet_code: {type: String},  
    employee_warehouse:{type: String},  
    date_warehouse:{type: String},  
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('warehouses', WarehouseSchema)

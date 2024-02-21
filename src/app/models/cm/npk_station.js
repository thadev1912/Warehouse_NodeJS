//  src/models/PostModels.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NpkStationSchema = new Schema({   
    jobsheet:{type:String},
    lot_number:{type:String},
    serial_number:{type:String},
    rx_topic:{type:String},
    tx_topic:{type:String},
    lot_board:{type:String},
    serial_sim:{type:String},
    active_date:{type:String},
    note:{type:String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});
module.exports = mongoose.model('npk_station', NpkStationSchema)

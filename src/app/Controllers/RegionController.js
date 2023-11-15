
const Region = require('../models/region');
const { checkRegion } = require('../../request/RegionRequest');
let index = async (req, res) => {
    try {
        let getData = await Region.find({});
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data:getData,
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}

let create = async (req, res) => {
    try {
        const getRegion = new Region(req.body);      
        checkId = await Region.find({ region_code:req.body.region_code}).count();      
        if (checkId>0) {
            return res.status(200).json({
                success: true, message: 'This ID exits!!',
            });
        }
        let getData = await getRegion.save();       
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                data: getData,
            });
        }
        else
        {
            throw new Error('Error connecting Database on Server');
        }
 
     }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}

let edit = async (req, res) => {
    try {       
        id = req.query.id;
        getId = await Region.find({ _id:id });       
        if (getId) {
            return res.status(200).json({
                success: true, message: 'Infomation Field need to edit!!', data: getId,
            });
        }
        else {
            throw new Error('Error connecting Database on Server');

        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}

let update = async (req, res) => {
    try {        
        let id = req.params.id;        
        getData = await Region.findByIdAndUpdate(id, { $set: req.body });        
        if (getData) {
            getNewData = await Region.findOne({ _id: id });
            return res.status(200).json({
                success: true, data: getNewData, message: 'Infomation field has been updated !!!'
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}
let destroy = async (req, res) => {
    try {
        let id = req.query.id;
        getId = await Region.findByIdAndRemove({ _id: id });
        if (getId) {
            return res.status(200).json({
                success: true, message: 'This field has been removed!!!',
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
module.exports =
{
    index: index,
    create: create,
    update: update,
    destroy: destroy,
    edit: edit,
}
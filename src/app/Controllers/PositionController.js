const Position = require('../models/position');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const setLogger = require('../../helper/setLogger');

let index = async (req, res) => {
    try {       
        const token = req.headers.token; 
        let _getData = await Position.find({});
        getData= await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,_getData);  
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData,
            });
        }
        else {
             res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
         res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}
let create = async (req, res) => {
    try {
        const getPosition = new Position(req.body);      
        checkId = await Position.find({ position_code:req.body.position_code}).count();      
        if (checkId>0) {
             res.json({
                status:200,
                success: true, message: 'This ID exits!!',
            });
        }        
        let getData = await getPosition.save();
        if (getData) {
            res.json({
                status: 200,
                message: 'Add new field comleted!!!',
               // data: getData,
            });
            setLogger.logStore(getInfoUser,req);  
        }
        else {
            res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
         res.json({
            status:500,
            success: false,           
            error: err.message,
        });
      
    }

}
let edit = async (req, res) => {
    try {
        const token = req.headers.token; 
        id = req.query.id;
        _getId = await Position.findOne({ _id: id });
        getId= await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,_getId);  
        if (getId) {
            res.json({
                status:200,
                success: true, message: 'Infomation Field need to edit!!', data: getId,
            });
        }
        else {
             res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });

        }
    }
    catch (err) {
        console.log(err);
            res.json({
            status:500,
            success: false,           
            error: err.message,
        });
      
    }

}
let update = async (req, res) => {
    try {
        req.body.updated=new Date();
        let id = req.params.id;
        getData = await Position.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {
            getNewData = await Position.findOne({ _id: id });
            res.json({
                status:200,
                success: true, message: 'Infomation field has been updated !!!'
            });
            setLogger.logUpdate(getInfoUser,req);
        }
        else {
             res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    } 
    catch (err) {
        console.log(err);
           res.json({
            status:500,
            success: false,           
            error: err.message,
        });
      
    }

}
let destroy = async (req, res) => {
    try {
        let id = req.query.id;
        getId = await Position.findByIdAndRemove({ _id: id });
        if (getId) {
             res.json({
                status:200,
                success: true, message: 'This field has been removed!!!',
            });
            setLogger.logDelete(getInfoUser,req);
        }
        else {
             res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
         res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}
module.exports = {
    index: index,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
}
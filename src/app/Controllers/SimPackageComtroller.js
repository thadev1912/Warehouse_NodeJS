const SimPackage = require('../models/sim_packages');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const setLogger = require('../../helper/setLogger');
let index = async (req, res) => {
    try { 
        const token = req.headers.token;        
        let getData =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await SimPackage.find({}));
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData,
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
			
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}
let create = async (req, res) => {
    try {       
        const getSimPackage = new SimPackage(req.body);      
        checkId = await SimPackage.find({ sim_package_expiration:req.body.sim_package_expiration}).count();      
        if (checkId>0) {
            return res.json({
                status:200,
                success: true, message: 'This ID exits!!',
            });
        }
        let getData = await getSimPackage.save();       
        if (getData) {
            setLogger.logStore(getInfoUser,req);
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                //data: getData,
            });
        }
        else
        {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
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
        getId = await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await SimPackage.findOne({ _id: id }));
        if (getId) {
            return res.json({
                status:200,
                success: true, message: 'Infomation Field need to edit!!', data: getId,
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });

        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}
let update = async (req, res) => {
    try {
        let id = req.params.id;
        getData = await SimPackage.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {           
            getNewData = await SimPackage.findOne({ _id: id });
            setLogger.logUpdate(getInfoUser,req);
            return res.json({
                status:200,
                success: true, message: 'Infomation field has been updated !!!'
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}
let destroy = async (req, res) => {
    try {
        let id = req.query.id;
        getId = await SimPackage.findByIdAndRemove({ _id: id });
        if (getId) {
            setLogger.logDelete(getInfoUser,req);
            return res.json({
                status:200,
                success: true, message: 'This field has been removed!!!',
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
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
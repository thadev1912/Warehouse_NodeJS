const ProductType = require('../models/product_type');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const setLogger = require('../../helper/setLogger');
let index = async (req, res) => {
    try {
        const token = req.headers.token; 
        let getData =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProductType.find({}));
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
        const getProductType = new ProductType(req.body);      
        checkId = await ProductType.find({ product_type_code:req.body.product_type_code}).count();      
        if (checkId>0) {
            return res.json({
                status:200,
                success: true, message: 'This ID exits!!',
            });
        }
        let getData = await getProductType.save();       
        if (getData) {
            setLogger.logStore(getInfoUser,req);
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                data: getData,
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
        getId =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProductType.findOne({ _id: id }));
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
        getData = await ProductType.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {           
            getNewData = await ProductType.findOne({ _id: id });
            setLogger.logUpdate(getInfoUser,req);
            return res.json({
                status:200,
                success: true, data: getNewData, message: 'Infomation field has been updated !!!'
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
        getId = await ProductType.findByIdAndRemove({ _id: id });
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
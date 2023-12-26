const ProductGroup = require('../models/product_group');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const setLogger = require('../../helper/setLogger');
let index = async (req, res) => {
    try {
        const token = req.headers.token; 
        let getData =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProductGroup.find({}));
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
let index1 = async (req, res) => {
    try {
        const token = req.headers.token; 
        let getData =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProductGroup.find({}));
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

     console.log(req.body);
        const getProductGroup = new ProductGroup(req.body);      
        checkId = await ProductGroup.find({ product_group_code:req.body.product_group_code}).count();      
        if (checkId>0) {
            return res.json({
                status:200,
                success: true, message: 'This ID exits!!',
            });
        }
        let getData = await getProductGroup.save();       
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
               // data: getData,
            });
            setLogger.logStore(getInfoUser,req);
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
        getId = await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProductGroup.findOne({ _id: id }));
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
        req.body.updated=new Date();
        let id = req.params.id;
        getData = await ProductGroup.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {           
            getNewData = await ProductGroup.findOne({ _id: id });
             res.json({
                status:200,
                success: true, data: getNewData, message: 'Infomation field has been updated !!!'
            });
            setLogger.logUpdate(getInfoUser,req);
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
        getId = await ProductGroup.findByIdAndRemove({ _id: id });
        if (getId) {
             res.json({
                status:200,
                success: true, message: 'This field has been removed!!!',
            });
            setLogger.logDelete(getInfoUser,req);
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
    index1:index1,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
}
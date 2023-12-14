const DetailProductOrder = require('../models/detail_product_order');
const User = require('../models/user');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const setLogger = require('../../helper/setLogger');
let index = async (req, res) => {
    try {         
       const token = req.headers.token; 
        let getData = await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await DetailProductOrder.find({}));       
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData
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
let store = async (req, res) => {
    try {
        console.log(req.body);
        const getDetailProductOrder = new DetailProductOrder(req.body);   
        let getData = await getDetailProductOrder.save();         
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


let update = async (req, res) => {
    try {
        let id = req.params.id;
        getData = await DetailProductOrder.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {           
            getNewData = await DetailProductOrder.findOne({ _id: id });
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
        console.log(id);
        getId = await DetailProductOrder.findByIdAndRemove({ _id: id });        
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
    store:store, 
    update:update,   
    destroy:destroy,   
}
const smartBump = require('../../models/cm/smart_bump');
const Gateway = require('../../models/cm/gateway');
const cryptJSon = require('../../../helper/cryptJSon');
const configCrypt = require('../../../../config/cryptJson');
const { ObjectId } = require('mongodb');
let index = async (req, res) => {
    try {      
     const token = req.headers.token;
     getsmartBump=await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await smartBump.find());   
     if (getsmartBump) {
        res.json({
            status: 200,
            message: 'Get Data Completed',
            data: getsmartBump
        });
    }
    else {
        return res.json({
            status: 500,
            success: false,
            message: 'Error connecting Database on Server'
        });
    }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}

let store = async (req, res) => {
    try {
        
        const getsmartBump = new smartBump(req.body);
        let getData = await getsmartBump.save(); 
        console.log(getData);      
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted',
                //data: getData,
            });           
        }
        else {
            return res.json({
                status: 500,
                success: false,
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}

let edit = async (req, res) => {
    try {
        res.json("bạn gọi tôi à")
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }

}

let update = async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id);
        req.body.updated = new Date();
        getsmartBump = await smartBump.findByIdAndUpdate(id, { $set: req.body });
        if (getsmartBump) {
            getNewData = await smartBump.findOne({ _id: id });
            res.json({
                status: 200,
                success: true, data: getNewData, message: 'Infomation field has been updated'
            });          
        }
        else {
            return res.json({
                status: 500,
                success: false,
                message: 'Error connecting Database on Server'
            });

        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
let destroy = async (req, res) => {
    try {
        console.log(req.query.id);
        let id =new ObjectId (req.query.id);
        getId = await smartBump.findByIdAndRemove({ _id: id });
        if (getId) {
            res.json({
                status: 200,
                success: true, message: 'This field has been removed',
            });           
        }
        else {
            return res.json({
                status: 500,
                success: false,
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
module.exports =
{
    index: index,   
    store: store,
    update: update,
    destroy: destroy,
    edit: edit,
}
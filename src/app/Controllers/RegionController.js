
const Region = require('../models/region');
const cryptJSon = require('../../helper/cryptJSon');
let index = async (req, res) => {
    try {
        const token = req.headers.token; 
        let _getData = await Region.find({});
        getData= await cryptJSon.encryptData(token,_getData);  
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data:getData,
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
        const getRegion = new Region(req.body);      
        checkId = await Region.find({ region_code:req.body.region_code}).count();      
        if (checkId>0) {
            return res.json({
                status:200,
                success: true, message: 'This ID exits!!',
            });
        }
        let getData = await getRegion.save();       
        if (getData) {
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
        id = req.query.id;
        getId = await Region.find({ _id:id });       
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
        getData = await Region.findByIdAndUpdate(id, { $set: req.body });        
        if (getData) {
            getNewData = await Region.findOne({ _id: id });
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
        getId = await Region.findByIdAndRemove({ _id: id });
        if (getId) {
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
module.exports =
{
    index: index,
    create: create,
    update: update,
    destroy: destroy,
    edit: edit,
}
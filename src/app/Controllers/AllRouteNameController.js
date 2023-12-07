const AllRouterName = require('../models/all_routes_name');
const cryptJSon = require('../../helper/cryptJSon');
let index = async (req, res) => {
    try {
       
        let getData = await AllRouterName.find({});       
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
        console.log(req.body);
        const getAllRouterName = new AllRouterName(req.body);  
       
        let getData = await getAllRouterName.save();       
        if (getData) {
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
        id = req.params.id;
        console.log(id);
        getId = await AllRouterName.find({ _id:id });       
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
        getData = await AllRouterName.findByIdAndUpdate(id, { $set: req.body });        
        if (getData) {
            getNewData = await AllRouterName.findOne({ _id: id });
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
        let id = req.params.id;
        getId = await AllRouterName.findByIdAndRemove({ _id: id });
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
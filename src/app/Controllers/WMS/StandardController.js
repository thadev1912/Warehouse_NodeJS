const Standard= require('../../models/wms/standard_wms');
const { ObjectId } = require('mongodb');
let index = async (req, res) => {
    try {       
       getData=await Standard.find();
       if (getData) {
        res.json({
            status: 200,
            message: 'Get Data completed',
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
        const getStandard = new Standard(req.body);      
        checkId = await Standard.find({ location_code:req.body.standard_code}).count();      
        if (checkId>0) {
             res.json({
                status:200,
                success: true, message: 'This ID exits',
            });
        }        
        let getData = await getStandard.save();
        if (getData) {
            res.json({
                status: 200,
                message: 'Add new field comleted',
               // data: getData,
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
let edit = async (req, res) => {
    try {
       res.json('bạn gọi tôi à');
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
        console.log(id);
        getData = await Standard.findByIdAndUpdate(id, { $set: req.body })        
        if (getData) {          
            res.json({
                status:200,
                success: true, message: 'Infomation field has been updated'
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
let destroy = async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id);
        getId = await Standard.findByIdAndRemove({ _id: id });
        if (getId) {
             res.json({
                status:200,
                success: true, message: 'This field has been removed',
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
module.exports = {
    index: index,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
}
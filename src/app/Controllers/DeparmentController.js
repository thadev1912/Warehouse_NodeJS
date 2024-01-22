const Department = require('../models/department');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const setLogger = require('../../helper/setLogger'); 
const { paginate } = require('../../helper/pagination');
const i18n = require('../../helper/languague');
let index = async (req, res) => {
    try {        
        const token = req.headers.token;    
        let _getData = await Department.find({});      
      getData= await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,_getData); 
            if (getData) {
           res.json({
                status: 200,
                message: 'Get Data Completed',
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
        const getDepartment = new Department(req.body);      
        checkId = await Department.find({ department_code:req.body.department_code}).count();      
        if (checkId>0) {
            return res.json({
                 status:200,
                 success: true,
                 message: 'This ID exits!!',
            });
        }
      let getData = await getDepartment.save();
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted',                
            });                
           // global.io.emit('event-global',`Phòng ban vừa được tạo bởi ${getInfoUser.user}`);
             global.io.emit('event-global',{message:'Server tạo'});
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
        id = req.params.id;
        getId = await Department.findOne({ _id: id });
        if (getId) {
            return res.json({
                status:200,
                success: true, message: 'Infomation Field need to edit', data: getId,
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
        req.body.updated=new Date();
        getData = await Department.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {           
            getNewData = await Department.findOne({ _id: id });
            res.json({
                status:200,
                success: true, message: 'Infomation field has been updated'
            });
            global.io.emit('eventUpdate',`Phòng ban vừa được cập nhật bởi ${getInfoUser.user}`);
            setLogger.logUpdate(getInfoUser,req)
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
        getId = await Department.findByIdAndRemove({ _id: id });
        if (getId) {
             res.json({
                status:200,
                success: true, message: 'This field has been removed',
            });
            global.io.emit('eventChange',`Phòng ban vừa được xóa bởi ${getInfoUser.user}`);
            setLogger.logDelete(getInfoUser,req)
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
const Location = require('../../models/ims/location');
let index = async (req, res) => {
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
let create = async (req, res) => {
    try {
        const getLocation = new Location(req.body);      
        checkId = await Location.find({ location_code:req.body.location_code}).count();      
        if (checkId>0) {
             res.json({
                status:200,
                success: true, message: 'This ID exits',
            });
        }        
        let getData = await getLocation.save();
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
let destroy = async (req, res) => {
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
module.exports = {
    index: index,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
}
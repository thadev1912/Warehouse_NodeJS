const userNoficationType = require('../models/user_notificationtype');
let index = async (req, res) => {
    try {       
      getData =await userNoficationType.find();
      if (getData) {
        res.json({
            status: 200,
            message: 'Add new field comleted',
             data: getData,
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
        const getuserNoficationType = new userNoficationType(req.body);           
        let getData = await getuserNoficationType.save();
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
const getType =async(req,res)=>
{
   // Lấy danh sách người dùng có notificationtype là "/JobSheet"
const usersWithJobSheetNotification = await userNoficationType.find({
    notificationtype: '/JobSheet',
}).select('user_id');
const userIDsArray = usersWithJobSheetNotification.map(item => item.user_id);

}
module.exports = {
    index: index, 
    create:create, 
    getType
}
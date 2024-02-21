const NotificationUser = require('../models/user_notification');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const { ObjectId } = require('mongodb');
const User = require('../models/user');
let showNotification =async(req,res)=>
{
  const token = req.headers.token;  
  getIdUser=req.params.id;  
 // getData=await NotificationUser.find({user_id:getIdUser}).sort({ created: -1 });
 getInfo=await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await NotificationUser.aggregate([
    {
       $addFields:
       {
        notify_id: { $toObjectId: "$notify_id" }
       }
    },
    {
        $match:{
            user_id:getIdUser
        }
    },
    {
        $lookup:{
            from: "notifications",
            localField: "notify_id",
            foreignField: "_id",
            as: "getDetail"
        }
    },
    {
        $sort:
        {
            created:-1
        }
    }
 ]));
  countNotRead=await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await NotificationUser.find({user_id:getIdUser,is_read:'0'}).countDocuments()); 
  
  if(getInfo)
  { 
    return res.json({
    status:200,
    success: true,
    getInfo,countNotRead,
    message: 'get Infomation Completed'
});

  }
}
//update seen status notify 
const updateNotification =async(req,res)=>
{
    const token = req.headers.token;  
    req.body.updated=new Date();
    let id = req.params.id;      
    getData =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await NotificationUser.findByIdAndUpdate(id, { $set: req.body }));
    if (getData) {
        getNewData = await NotificationUser.findOne({ _id: id });
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
const getType =async(req,res)=>
{  
    const type =String(2);   
    const getUsersByRolePermission = await User.aggregate([
        {
            $lookup: {
                from: 'user_roles',
                localField: '_id',
                foreignField: 'user_id',
                as: 'userRole',
            },
        },
        {
            $unwind: '$userRole',
        },
        {
            $lookup: {
                from: 'role_permissions',
                localField: 'userRole.role_permission_id',
                foreignField: '_id',
                as: 'rolePermission',
            },
        },
        {
            $unwind: {
                path: '$rolePermission',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $match: {
                $and:
                    [
                        {'rolePermission.role_notification_group': { $regex: type }},   
                        {'rolePermission.role_id': { $regex: String(1) }},                      
                    ]
                
               
               
                
            }
        },
        {
            $group: {
                _id: '$_id', 
                username: { $first: '$username' },             
            }
        },
    ]);   
    const resultArray = getUsersByRolePermission.map(user => user._id.toString('hex'));    
    
    
  


   // Lấy danh sách người dùng có notificationtype là "/JobSheet"
// const usersWithJobSheetNotification = await userNoficationType.find({
//     notificationtype:'3',
// }).select('user_id');
// getData= await usersWithJobSheetNotification.map(item => item.user_id);
// console.log('giá trị data lấy được là',getData);
}
// const getType =async(req,res)=>
// {  
//     const type =String(3);   
//     const getUsersByRolePermission = await User.aggregate([
//         {
//             $lookup: {
//                 from: 'user_roles',
//                 localField: '_id',
//                 foreignField: 'user_id',
//                 as: 'userRole',
//             },
//         },
//         {
//             $unwind: '$userRole',
//         },
//         {
//             $lookup: {
//                 from: 'role_permissions',
//                 localField: 'userRole.role_permission_id',
//                 foreignField: '_id',
//                 as: 'rolePermission',
//             },
//         },
//         {
//             $unwind: {
//                 path: '$rolePermission',
//                 preserveNullAndEmptyArrays: true,
//             },
//         },
//         {
//             $match: {
//                 'rolePermission.role_permission_group': { $regex: type }
//             }
//         },
//         {
//             $group: {
//                 _id: '$_id', 
//                 username: { $first: '$username' },             
//             }
//         },
//     ]);
//     console.log(getUsersByRolePermission);
//     const resultArray = getUsersByRolePermission.map(user => user._id.toString('hex'));
//     console.log(resultArray);
    
    
  


//    // Lấy danh sách người dùng có notificationtype là "/JobSheet"
// // const usersWithJobSheetNotification = await userNoficationType.find({
// //     notificationtype:'3',
// // }).select('user_id');
// // getData= await usersWithJobSheetNotification.map(item => item.user_id);
// // console.log('giá trị data lấy được là',getData);
// }

module.exports = {  
    showNotification,
    updateNotification,
    
    getType,
    
   
}
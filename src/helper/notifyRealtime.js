const Telegram = require('./telegram');
const cronJob = require('./cronJob');
const CategoriesSim = require('../app/models/categories_sim');
const NotificationSim = require('../app/models/notification_sim');
const userNoficationType = require('../app/models/user_notificationtype');
const User = require('../app/models/user');
const Notification = require('../app/models/notification');
const NotificationUser = require('../app/models/user_notification');
const mongoose = require('mongoose');
const RealtimeWarningSim = async (type) => {
    getCount = await CategoriesSim.find({ deadline_warning: "Sắp hết hạn" }).countDocuments();   
    let today = new Date();
    dd = String(today.getDate()).padStart(2, '0');
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    createDay = mm + '/' + dd + '/' + yyyy;
    isCompleted = true;
    if (getCount > 0) {       
        getNotification = new Notification({
            content_notification: getCount,
            date_notification: createDay,
            type_notification: type,
            action_notification: 'Create',
            user_id: getInfoUser._id,
        })
        getData = await getNotification.save();
        arrUser = await getType(type);        
        arrUser.map(async (user) => {
            const getNotificationUser = new NotificationUser({
                user_id: user,
                notify_id: getNotification._id,
                is_read: '0',
            });
            getData = await getNotificationUser.save();
        })
        isCompleted = getData > 0 ? true : false;
       // const message = `Có ${getCount} sim sắp hết hạn. Thông tin đến nhóm`;
        message=await cronJob.showAlert();
        global.io.emit('eventChange', `Có ${getCount} sim sắp hết hạn`);
        Telegram.sendMessageToGroup(message);
    }
    if (isCompleted) {
        console.log('cập nhật tổng số lượng sim sắp hết hạn mới thành công!!!');
    }
}
const RealtimeCreateProductOrder = async (content, getInfoUser, type) => {
    let today = new Date();
    dd = String(today.getDate()).padStart(2, '0');
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    createDay = mm + '/' + dd + '/' + yyyy;
    const getNotification = new Notification({
        content_notification: content,
        date_notification: createDay,
        type_notification: type,
        action_notification: 'Create',
        created_by: getInfoUser._id,
    });
    getData = await getNotification.save();
    arrUser = await getType(type);    
    arrUser.map(async (user) => {
        const getNotificationUser = new NotificationUser({
            user_id: user,
            notify_id: getData._id,
            is_read: '0',
        });
        getData = await getNotificationUser.save();
    })   
        const getFullname=await User.find({_id:getInfoUser._id}).select('fullname');  
        const message = `Yêu cầu sản xuất ${content} vừa được tạo bởi ${getFullname[0].fullname}`;
        global.io.emit('eventChange', `Yêu cầu sản xuất ${content} vừa được tạo bởi ${getFullname[0].fullname}`);
        Telegram.sendMessageToGroup(message);   
   
}
const RealtimeApproveProductOrder = async (content, getInfoUser,createdBy,type) => {
    let today = new Date();
    dd = String(today.getDate()).padStart(2, '0');
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    createDay = mm + '/' + dd + '/' + yyyy;
    const getNotification = new Notification({
        content_notification: content,
        date_notification: createDay,
        type_notification: type,
        action_notification: 'Aprrove',
        created_by: getInfoUser._id,
    });
    getData = await getNotification.save();   
    arrAdmin = await getTypeByAdmin(type);
    if (!arrAdmin.includes(createdBy)) {
        arrAdmin.push(createdBy);
    }    
    arrAdmin.map(async (user) => {
        const getNotificationUser = new NotificationUser({
            user_id: user,
            notify_id: getData._id,
            is_read: '0',
        });
        getData = await getNotificationUser.save();
    })
          
        const getFullname=await User.find({_id:getInfoUser._id}).select('fullname');        
        const message = `Yêu cầu sản xuất ${content} vừa duyệt bởi ${getFullname[0].fullname}`;
        global.io.emit('eventChange', `Yêu cầu sản xuất ${content} vừa duyệt bởi ${getFullname[0].fullname}`);
        Telegram.sendMessageToGroup(message)
 
}
const RealtimeReApproveProductOrder = async (content, getInfoUser,createdBy,type) => {
    let today = new Date();
    dd = String(today.getDate()).padStart(2, '0');
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    createDay = mm + '/' + dd + '/' + yyyy;
    const getNotification = new Notification({
        content_notification: content,
        date_notification: createDay,
        type_notification: type,
        action_notification: 'ReAprrove',
        created_by: getInfoUser._id,
    });
    getData = await getNotification.save(); 
    arrAdmin = await getTypeByAdmin(type);
    if (!arrAdmin.includes(createdBy)) {
        arrAdmin.push(createdBy);
    }    
    arrAdmin.map(async (user) => {
        const getNotificationUser = new NotificationUser({
            user_id: user,
            notify_id: getData._id,
            is_read: '0',
        });
        getData = await getNotificationUser.save();        
    })    
    const getFullname=await User.find({_id:getInfoUser._id}).select('fullname');  
    const message = `Yêu cầu sản xuất ${content} vừa được hoàn duyệt bởi ${getFullname[0].fullname}`;
    global.io.emit('eventChange', `Yêu cầu sản xuất ${content} vừa được hoàn duyệt bởi ${getFullname[[0].fullname]}`);
    Telegram.sendMessageToGroup(message);   
}
const RealtimeCreateJobsheet = async (content, getInfoUser, type) => {
    let today = new Date();
    dd = String(today.getDate()).padStart(2, '0');
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    createDay = mm + '/' + dd + '/' + yyyy;
    //Telegram     
    getNotification = new Notification({
        content_notification: content,
        date_notification: createDay,
        type_notification: type,
        action_notification: 'Create',
        created_by: getInfoUser._id,
    });
    getData = await getNotification.save();
    arrUser = await getType(type);    
    arrUser.map(async (user) => {
        const getNotificationUser = new NotificationUser({
            user_id: user,
            notify_id: getNotification._id,
            is_read: '0',
        });
        getData = await getNotificationUser.save();
    })
    _isPermission = await hasPermission(getInfoUser._id, type);  
    const getFullname=await User.find({_id:getInfoUser._id}).select('fullname');  
    const message = `Jobsheet ${content} vừa được tạo bởi ${getFullname[0].fullname}`;
    global.io.emit('eventChange', `Jobsheet ${content} vừa được tạo bởi ${getFullname[0].fullname}`);
    Telegram.sendMessageToGroup(message);   
}
const RealtimeUpdateJobsheet = async (content, getInfoUser,createdBy, type) => {
    let today = new Date();
    dd = String(today.getDate()).padStart(2, '0');
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    createDay = mm + '/' + dd + '/' + yyyy;
    const getNotification = new Notification({
        content_notification: content,
        date_notification: createDay,
        type_notification: type,
        action_notification: 'Update',
        created_by: getInfoUser._id,
    });
    getData = await getNotification.save();
    arrAllUser = await getType(type);  
    if ((createdBy !== undefined && createdBy !== null) && !arrAllUser.includes(createdBy))  {
        arrAllUser.push(createdBy);
    } 
   
    arrAllUser.map(async (user) => {
        const getNotificationUser = new NotificationUser({
            user_id: user,
            notify_id: getData._id,
            is_read: '0',
        });
        getData = await getNotificationUser.save();
    })   
    const getFullname=await User.find({_id:getInfoUser._id}).select('fullname');  
    const message = `Jobsheet ${content} vừa được cập nhật bởi ${getFullname[0].fullname}`;
    global.io.emit('eventChange', `Jobsheet ${content} vừa được cập nhật bởi ${getFullname[0].fullname}`);
    Telegram.sendMessageToGroup(message);   
}
const hasPermission = async (userId, type) => {    
    PermissionById = await getUserRolebyId(userId);   
    return PermissionById.includes(String(type));
}
const checkExitsPermssion = async (_arrUser, arrPermission) => {
    return arrPermission.includes(_arrUser);
}
const getType = async (type) => {
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
                'rolePermission.role_notification_group': { $regex: String(type) },
            }
        },
        {
            $group: {
                _id: '$_id',
            }
        },
    ]);

    return getUsersByRolePermission.map(user => user._id.toString('hex'));
}
const getTypeByAdmin = async (type) => {
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
                        { 'rolePermission.role_notification_group': { $regex: String(type) } },
                        { 'rolePermission.role_id': { $regex: String(1) } },
                    ]
            }
        },
        {
            $group: {
                _id: '$_id',
            }
        },
    ]);
    return getUsersByRolePermission.map(user => user._id.toString('hex'));
}
const getUserRolebyId =async(userID) =>
{    
    const getUser=await User.find({_id:userID});
       getRoleUser= await User.aggregate([
        {
            $match: {
                _id:getUser[0]._id,
            },
        },
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
            $group: {
                _id: null,              
                role_notification_group: { $addToSet: '$rolePermission.role_notification_group' },
            },
        },
        {
            $project: {
                _id: 0,              
               role_notification_group:1,
            },
        },
    ]);    
       const _getNotifiCationGroup = (getRoleUser[0].role_notification_group).flat();
        return getNotifiCationGroup=[...new Set(_getNotifiCationGroup)];         
}
module.exports = {
    RealtimeWarningSim,
    RealtimeCreateProductOrder,
    RealtimeApproveProductOrder,
    RealtimeReApproveProductOrder,
    RealtimeCreateJobsheet,
    RealtimeUpdateJobsheet,
    getType,
    getTypeByAdmin,
    getUserRolebyId,
    hasPermission,
    checkExitsPermssion,
};

const RolePermission = require('../models/role_permission');
const UserRole = require('../models/user_role');
const User = require('../models/user');
const { ObjectId } = require('mongodb');
const AllPermission = require('../models/all_routes_name');
const NotifyType = require('../models/notification_type');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const setLogger = require('../../helper/setLogger');
let listPermissionGroup=async(req,res)=>{   //can show detail Roles
    try{
   //Show detail infomation PermissionGroup
   const token = req.headers.token;
    getId=req.params.id;
    getPermissionGroupById=await RolePermission.findById(getId);
    CovertArrPermissionbyId =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,JSON.parse(getPermissionGroupById.role_permission_group));
   
  if(getPermissionGroupById) {
    res.json({
        status: 200,
        message: 'Get Detail Completed Completed',
        data:CovertArrPermissionbyId
    });
} else {
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

let InfotoStore = async (req, res) => {
    try {
    const token = req.headers.token;
    getAllPermission = await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await AllPermission.find());
    getNotifyType=await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await NotifyType.find());    
    if (getAllPermission) {
        res.json({
            success: true,
            status: 200,
            message: 'Get Data Completed',
            data: getAllPermission,getNotifyType
        });
    }
    else {
        res.json({
            success: false,
            status: 500,
            message: 'Error connecting Database on Server',

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
let storePermisionsGroup = async (req, res) => {
    try {    
       
        getArray = req.body.getArray;       
        getrole_permission_name = req.body.role_permission_name          
        const arrPermissionGroup =  JSON.stringify(getArray.filter(value => isNaN(parseInt(value))));      
        const arrNotifiCationGroup = getArray.filter(value => !isNaN(parseInt(value)));          
           _rolePermission = new RolePermission({
            role_permission_name: getrole_permission_name,
            role_permission_group: arrPermissionGroup,
            role_notification_group:arrNotifiCationGroup,
            role_id:'0'
        });
        isComplete = await _rolePermission.save();
        if (isComplete) {
           setLogger.logStore(getInfoUser,req);
           res.json({
            status: 200,
            messege: 'Add data completed',
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
let InfotoUpdatePermisionsGroup = async (req, res) => {
    try{
    const token = req.headers.token;    
    PermisionsGroupId = new ObjectId(req.params.id);
    getAllRouteName = await AllPermission.find({});
    const getAllRouteNameToJson = JSON.stringify(getAllRouteName.map(permission => ({ permision_group: permission.routes_group,permision_code: permission.routes_code, permision_name: permission.routes_name })));
    const _getAllPermissions = JSON.parse(getAllRouteNameToJson);    
    getRolePermissionbyId = await RolePermission.findOne({ _id: PermisionsGroupId });  
    getNameRolePermissionbyId=getRolePermissionbyId.role_permission_name;   
    const _getPermissionGroupById = JSON.parse(getRolePermissionbyId.role_permission_group);   
    const _getNotifiCationGroupById=getRolePermissionbyId.role_notification_group;    
    //gop
    // const mergPermission = _getPermissionGroupById.reduce((acc, item, index) => {
    //     if (_getNotifiCationGroupById.includes((index + 1).toString())){
    //         acc.push(item);
    //       }
    //       return acc;
    //     }, []).concat(_getNotifiCationGroupById);
    _getNotifiCationGroupById.forEach(item => {           
        if (!_getPermissionGroupById.includes(item)) {
            _getPermissionGroupById.push(item);
        }
    });     
    const checkboxStatus =await Promise.all(_getAllPermissions.map(async (permission) => ({
        routes_group:permission.permision_group,
        routes_code: permission.permision_code,
        routes_name: permission.permision_name,
        checked: await checkPermissionByIdExist(_getPermissionGroupById,permission.permision_code),
    })));   
      return res.json({
        status:200,
        success: true,
        data:{getNameRolePermissionbyId,checkboxStatus}
    });
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
let updatePermisionsGroup = async (req, res) => {
    try {    
    getId = new ObjectId(req.params.id);   
    getArray = req.body.getArray;
    const arrPermissionGroup =  JSON.stringify(getArray.filter(value => isNaN(parseInt(value))));      
    const arrNotifiCationGroup = getArray.filter(value => !isNaN(parseInt(value)));          
   // const covertJsonPermissions = JSON.stringify(getArrayPermissionGroup);        
    _updaterolePermission = new RolePermission({
        _id:getId,
        role_permission_name: req.body.role_permission_name,
        role_permission_group: arrPermissionGroup,
        role_notification_group:arrNotifiCationGroup,

    });
   isCompleted=  await RolePermission.findOneAndUpdate(getId, {$set:_updaterolePermission});
   if (isCompleted) {
    setLogger.logUpdate(getInfoUser,req);
    res.json({
        status: 200,
        message: 'Update Completed',
    });
} else {
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
//User-Roles
let listUserRole=async(req,res)=>{
    try{
 const token = req.headers.token;
  getListUserRole=await RolePermission.find();
  covertArrListUserRole=await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,JSON.stringify(getListUserRole.map(role=>({role_id:role._id,role_name:role.role_permission_name}))));
  if (covertArrListUserRole) {
    res.json({
        status: 200,
        message: 'Update Completed',
        data:covertArrListUserRole,
    });
} else {
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
let storeUserRole = async (req, res) => {
    //
}
//list Role by User
let ShowDetailRoleByUser =async(req,res)=>
{
    try{
    const token = req.headers.token;    
    getUserId=new ObjectId(req.params.id);
    getRoles=await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await getRolesbyUser(getUserId));
    if (getRoles) {
        res.json({
            status: 200,
            message: 'Get Data Completed',
            data:getRoles,
        });
    } else {
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
let infotoUpdateUserRole =async(req,res)=>
{
    try
    {
    const token = req.headers.token; 
    getUserId = new ObjectId(req.params.id);
    getRolesbyUser = await getRolesbyIdUser(getUserId);
    let _getRolesbyUser = getRolesbyUser.map(item => item.role_permission_name).flat();
    getListUserRole = await RolePermission.find();
    covertArrListUserRole = JSON.stringify(getListUserRole.map(role => ({ role_id: role._id, role_name: role.role_permission_name })));
    const _getAllRoles = JSON.parse(covertArrListUserRole);    
    const checkboxStatus =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await Promise.all(_getAllRoles.map(async (role) => ({
        role_permission_id: role.role_id,
        role_permission_name: role.role_name,
        checked: await checkRoleByIdExist(_getRolesbyUser, role.role_name),
    }))));    
        res.json({
            status: 200,
            message: 'Get Data Completed',
            data:checkboxStatus,
        });  
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
let UpdateUserRole = async (req,res) => {
    try{    
    getUserId = new ObjectId(req.params.id);
    getArrayRolesId = req.body.arrayRolesId;    
    ischeckStatus = true;
    checkExitsIdUser = await UserRole.findOne({ user_id: getUserId }).count();   
    if (checkExitsIdUser > 0) {
        isDeleted = await UserRole.deleteMany({ user_id: getUserId });
        if (isDeleted) {
            for (let i = 0; i < getArrayRolesId.length; i++) {
                getUserRole = new UserRole({
                    user_id: getUserId,
                    role_permission_id: getArrayRolesId[i],
                });
                isComplete = await getUserRole.save();
                ischeckStatus = isComplete ? true : false;
            }
        }
    }
    //create role when not exits
    if(checkExitsIdUser === 0)
    {
    for (let i = 0; i < getArrayRolesId.length; i++) {
        getUserRole = new UserRole({
            user_id: getUserId,
            role_permission_id: getArrayRolesId[i],
        });
        isComplete = await getUserRole.save();
        ischeckStatus = isComplete ? true : false;
    }
}
    if (ischeckStatus) {
        setLogger.logUpdate(getInfoUser,req);
        res.json({            
            status: 200,
            message: 'Update Data Completed',
        });
    } else {
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
let DeleteUserRole = async (res,req) => {
    try{
    getIdUser = req.params.id;
    getIdRole = req.body.IdRole;
    isComplete = await UserRole.deleteOne({ user_id: getIdUser, role_permission_id: getIdRole });
    if (isComplete) {
        res.json({
            status: 200,
            message: 'Delete Data Completed',
        });
    } else {
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
 let DeletePermissionGroup = async (req,res) => {
    try{    
    getIdPermissionGroup = new ObjectId(req.params.id);   
    isComplete = await RolePermission.deleteOne({ _id: getIdPermissionGroup });
    checkIdRoleUser = await UserRole.find({ role_permission_id: getIdPermissionGroup }).count();
    if (checkIdRoleUser > 0) {
        await UserRole.deleteMany({ role_permission_id: getIdPermissionGroup });
    }
    if (isComplete) {
        setLogger.logDelete(getInfoUser,req); 
        res.json({
            status: 200,
            message: 'Delete Data Completed',
        });
    } else {
        res.json({
            status:500,
            success: false,
            message: 'Error connecting Database on Server'
        });
    }
 }
 catch (err) {
    res.json({
        status:500,
        success: false,
        error: err.message,
    });
}
}
let checkPermissionByIdExist = async (array, element) => {
    return await array.includes(element);
}
let checkRoleByIdExist = async (array, element) => {
    return await array.includes(element);
}
let getRolesbyUser = async (data) => {
try {
    return await User.aggregate([
        {

            $match: {
                _id: data,
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
                role_permission_name: { $addToSet: '$rolePermission.role_permission_name' },
            },
        },
        {
            $project: {
                _id: 0, // Exclude _id from the output
                role_permission_name: 1,              
            },
        },
    ]);
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
let getRolesbyIdUser = async (data) => {

    return await User.aggregate([
        {

            $match: {
                _id: data,
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
                role_permission_name: { $addToSet: '$rolePermission.role_permission_name' },
            },
        },
        {
            $project: {
                _id: 0, // Exclude _id from the output
                role_permission_name: 1,
            },
        },
    ]);
}
module.exports = {
    //Permissions Group
    listPermissionGroup:listPermissionGroup,
    InfotoStore: InfotoStore,
    storePermisionsGroup: storePermisionsGroup,
    InfotoUpdatePermisionsGroup: InfotoUpdatePermisionsGroup,
    checkPermissionByIdExist: checkPermissionByIdExist,
    updatePermisionsGroup: updatePermisionsGroup,
    getRolesbyUser:getRolesbyUser,
    DeletePermissionGroup: DeletePermissionGroup,
     //User_Roles
    listUserRole:listUserRole,
    storeUserRole: storeUserRole,
    ShowDetailRoleByUser:ShowDetailRoleByUser,
    infotoUpdateUserRole:infotoUpdateUserRole,
    UpdateUserRole:UpdateUserRole,
    checkRoleByIdExist:checkRoleByIdExist,
    DeleteUserRole:DeleteUserRole,
    getRolesbyIdUser:getRolesbyIdUser,
}
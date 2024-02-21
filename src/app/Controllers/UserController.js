
const User = require('../models/user');
const RolePermission = require('../models/role_permission');
const UserRole = require('../models/user_role');
const Position = require('../models/position');
const Region = require('../models/region');
const Department = require('../models/department');
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');
const mailer = require('../../helper/sendmail');
const crypto = require('crypto');
const StoreToken = require('../models/store_token');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const fs = require('fs');
const path = require('path');
const setLogger = require('../../helper/setLogger');
const i18n = require('../../helper/languague');
//Lấy danh sách user
let listUser = async (req, res) => {
    try {
        const token = req.headers.token;
        let dataPosition = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Position.find({}));
        let dataRegion = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Region.find({}));
        let dataDepartment = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Department.find({}));
        let dataRole = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await RolePermission.find({}).select('role_permission_name'));
        // let getData = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await User.aggregate([
        //     {
        //         $addFields: {
        //             region_id: {
        //                 $toObjectId: "$region_id"
        //             },
        //             position_id: {
        //                 $toObjectId: "$position_id"
        //             },
        //             department_id: {
        //                 $toObjectId: "$department_id"
        //             },
        //             user_id: {
        //                 $toObjectId: "$user_id"
        //             },
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "regions",
        //             localField: "region_id",
        //             foreignField: "_id",
        //             as: "getRegion"
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "positions",
        //             localField: "position_id",
        //             foreignField: "_id",
        //             as: "getPostion"
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "departments",
        //             localField: "department_id",
        //             foreignField: "_id",
        //             as: "getDepartment"
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "user_roles",
        //             localField: "_id",
        //             foreignField: "user_id",
        //             pipeline: [
        //                 {
        //                     $lookup: {
        //                         from: 'role_permissions',
        //                         localField: 'role_permission_id',
        //                         foreignField: '_id',
        //                         as: 'role_permissions',
        //                     },
        //                 },
        //                 {
        //                     $project: {
        //                         'role_permissions.role_permission_group': 0,
        //                         'role_permissions.role_notification_group': 0
        //                     }
        //                 }
        //             ],
        //             as: "getRoleUser"
        //         }
        //     },


        // ]));
        let getData = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await User.aggregate([
            {
                $addFields: {
                    region_id: { $toObjectId: "$region_id" },
                    position_id: { $toObjectId: "$position_id" },
                    department_id: { $toObjectId: "$department_id" },
                    user_id: { $toObjectId: "$user_id" },
                }
            },
            {
                $lookup: {
                    from: "regions",
                    let: { regionId: "$region_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$regionId"] }
                            }
                        }
                    ],
                    as: "getRegion"
                }
            },
            {
                $lookup: {
                    from: "positions",
                    let: { positionId: "$position_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$positionId"] }
                            }
                        }
                    ],
                    as: "getPosition"
                }
            },
            {
                $lookup: {
                    from: "departments",
                    let: { departmentId: "$department_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$departmentId"] }
                            }
                        }
                    ],
                    as: "getDepartment"
                }
            },
            {
                $lookup: {
                    from: "user_roles",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$user_id", "$$userId"] }
                            }
                        },
                        {
                            $lookup: {
                                from: "role_permissions",
                                localField: "role_permission_id",
                                foreignField: "_id",
                                as: "role_permissions",
                            },
                        },
                        {
                            $project: {
                                'role_permissions.role_permission_group': 0,
                                'role_permissions.role_notification_group': 0
                            }
                        }
                    ],
                    as: "getRoleUser"
                }
            },
        ]));        
        
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed',
                data: getData, dataPosition, dataDepartment, dataRegion, dataRole,
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
let Infomation = async (req, res) => {
    const token = req.headers.token;
    let dataPosition = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Position.find({}));
    let dataRegion = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Region.find({}));
    let dataDepartment = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Department.find({}));
    // let dataRole = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Role.find({}));
    let dataRole = await RolePermission.find({});
    getData = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await User.aggregate([
        {
            $project: {
                _id: 1,
                password: 0,
                username: 0,
            }
        },
        {
            $addFields: {
                region_id: {
                    $toObjectId: "$region_id"
                },
                position_id: {
                    $toObjectId: "$position_id"
                },
                department_id: {
                    $toObjectId: "$department_id"
                },
            }
        },
        {
            $lookup: {
                from: "regions",
                localField: "region_id",
                foreignField: "_id",
                as: "getRegion"
            }
        },
        {
            $lookup: {
                from: "positions",
                localField: "position_id",
                foreignField: "_id",
                as: "getPostion"
            }
        },
        {
            $lookup: {
                from: "departments",
                localField: "department_id",
                foreignField: "_id",
                as: "getDepartment"
            }
        },


    ]));
    if (getData) {
        res.json({
            status: 200,
            message: 'Get Data Completed',
            data: getData, dataPosition, dataRegion, dataDepartment, dataRole
        });
    }
}

//Lấy danh sách user
let listRoleUser = async (req, res) => {
    try {
        getData = await User.aggregate([
            {
                $lookup: {
                    from: "roles",
                    localField: "user_code",
                    foreignField: "role_id",
                    as: "roles",
                },
            },
            { $match: { 'user_code': '1' } },
        ]);
        if (getData) {
            res.json({
                status: 200,
                getData,
                message: 'Get Data Completed',

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
//Thêm mới user
let register = async (req, res) => {
    try {
        getArrayRolesId = JSON.parse(req.body.ArrRoleID);       
        if (req.file) {
            if (req.file.originalname !== undefined) {
                getPw = req.body.password ? await hashpw(req.body.password) : req.body.password;
                reqName = new Date().toISOString().split('T')[0] + req.file.originalname;
                getNameImage = 'uploads/' + reqName;
                const getUser = new User({
                    fullname: req.body.fullname,
                    username: req.body.username,
                    role_id: req.body.role_id,
                    email: req.body.email,
                    address: req.body.address,
                    phone: req.body.phone,
                    password: getPw,
                    position_id: req.body.position_id,
                    region_id: req.body.region_id,
                    department_id: req.body.department_id,
                    gender: req.body.gender,
                    birthday: req.body.birthday,
                    avatar: getNameImage,
                });
                let getData = await getUser.save();
                // getUserRoles=new UserRole({
                //     user_id:getData._id,
                //     role_permission_id:req.body.RolePermissionID
                // });                  
                for (let i = 0; i < getArrayRolesId.length; i++) {
                    getUserRole = new UserRole({
                        user_id: getData._id,
                        role_permission_id: new ObjectId(getArrayRolesId[i]),
                    });
                    await getUserRole.save();
                }
                if (getData) {
                    res.json({
                        status: 200,
                        message: 'Get Data Completed',
                        data: getData,
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
        }
        else {
            getPw = req.body.password ? await hashpw(req.body.password) : req.body.password;
            const getUser = new User({
                fullname: req.body.fullname,
                username: req.body.username,
                role_id: req.body.role_id,
                email: req.body.email,
                address: req.body.address,
                phone: req.body.phone,
                password: getPw,
                position_id: req.body.position_id,
                region_id: req.body.region_id,
                department_id: req.body.department_id,
                gender: req.body.gender,
                birthday: req.body.birthday,
                avatar: 'uploads/avatar.png',
            });
            let getData = await getUser.save();
            for (let i = 0; i < getArrayRolesId.length; i++) {
                getUserRole = new UserRole({
                    user_id: getData._id,
                    role_permission_id: getArrayRolesId[i],
                });
                await getUserRole.save();
            }
            if (getData) {
                res.json({
                    status: 200,
                    message: 'Get Data Completed',
                    data: getData,
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
let checkLogin = async (req, res) => {
    try {
        let user = req.body.username;
        let pws = req.body.password;
        lang = req.query.lang || 'vi';       
        let checkExits = await User.findOne({ username: user }).count();
        if (checkExits <= 0) {
            return res.json({ status: 422, message: 'Username or password incorect' });
        }
        let checkUser = await User.findOne({ username: user });      
        getRoleUser = await User.aggregate([
            {

                $match: {
                    _id: checkUser._id,
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
                    role_permission_group: { $addToSet: '$rolePermission.role_permission_group' },
                    role_notification_group: { $addToSet: '$rolePermission.role_notification_group' },
                },
            },
            {
                $project: {
                    _id: 0,
                    role_permission_name: 1,
                    role_permission_group: 1,
                    role_notification_group: 1,
                },
            },
        ]);
       
        const encryptionEnabled = configCrypt.encryptionEnabled;
        const isAdmin = getRoleUser.length > 0 && getRoleUser[0].role_permission_name.includes('admin') ? 'admin' : '';
        // getRoleUser[0].role_permission_group.map(JSON.parse).flat();  
        const _getPermissionGroup = getRoleUser[0].role_permission_group.flatMap(group => JSON.parse(group));
        const getPermissionGroup = [...new Set(_getPermissionGroup)];       
        const _getNotifiCationGroup = (getRoleUser[0].role_notification_group).flat();
        const getNotifiCationGroup = [...new Set(_getNotifiCationGroup)];       
        getNotifiCationGroup.forEach(item => {
            if (!getPermissionGroup.includes(item)) {
                getPermissionGroup.push(item);
            }
        });       
        getInfo = await User.aggregate([
            {
                $project: {
                    _id: 1,
                    username: 1,
                    fullname: 1,
                    region_id: 1,
                    department_id: 1,
                    position_id: 1,
                    gender: 1,
                    birthday: 1,
                    email: 1,
                    avatar: 1,
                    role_id: 1,

                }
            },
            {
                $addFields: {
                    region_id: {
                        $toObjectId: "$region_id"
                    },
                    position_id: {
                        $toObjectId: "$position_id"
                    },
                    department_id: {
                        $toObjectId: "$department_id"
                    },
                }
            },
            {
                $lookup: {
                    from: "regions",
                    localField: "region_id",
                    foreignField: "_id",
                    as: "getRegion"
                }
            },
            {
                $lookup: {
                    from: "positions",
                    localField: "position_id",
                    foreignField: "_id",
                    as: "getPostion"
                }
            },
            {
                $lookup: {
                    from: "departments",
                    localField: "department_id",
                    foreignField: "_id",
                    as: "getDepartment"
                }
            },
            {
                $match: {
                    username: checkUser.username,
                }
            }


        ]);
        if (!checkUser) {
            // res.json({ status: 500, message: 'Username or passsword incorect' });
            return res.json({
                status: 422,
                success: false,
                message: 'Username or passsword incorect'
            });

        }
        let checkPw = await bcrypt.compare(pws, checkUser.password);
        const language = i18n.getCatalog(lang);
        const _SecurityKey = crypto.randomBytes(32).toString('hex');
        const _initVector = crypto.randomBytes(16).toString('hex');
        let AccessToken = jwt.sign({ _id: checkUser._id, user: checkUser.username, encryptionEnabled, _SecurityKey, _initVector },
            process.env.JWT_SECRET,
            { expiresIn: "4h" }
        );
        checkUser && checkPw ? res.json({ status: 200, message: 'You has been login completed', AccessToken, getInfo, getPermissionGroup }) : res.json({ status: 422, message: 'Username or passsword incorect' })
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 200,
            success: false,
            error: err.message,
        });
    }
}
let checkLogout = async (req, res) => {
    try {
        //
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
let hashpw = async (pw) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pw, salt);
}
let destroyUser = async (req, res) => {
    try {
        let id = req.query.id;
        getId = await User.findByIdAndRemove({ _id: id });
        if (getId) {
            setLogger.logDelete(getInfoUser, req);
            return res.json({
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
let updateUser = async (req, res) => {
    try {
        let id = req.query.id;       
        getArrayRolesId = JSON.parse(req.body.ArrRoleID);
        if (req.file) {
            if (req.file.originalname !== undefined) {
                getName = 'uploads/' + new Date().toISOString().split('T')[0] + req.file.originalname;
                req.body.avatar = getName;
                getData = await User.findByIdAndUpdate(id, { $set: req.body });
                //update RoleUser
                _objectID = new ObjectId(id);                
                checkExitsIdUser = await UserRole.findOne({ user_id: getData._id }).count();
                if (checkExitsIdUser > 0) {
                    isDeleted = await UserRole.deleteMany({ user_id: getData._id });
                    if (isDeleted) {
                        for (let i = 0; i < getArrayRolesId.length; i++) {
                            getUserRole = new UserRole({
                                user_id: getData._id,
                                role_permission_id: new ObjectId(getArrayRolesId[i]),
                            });
                            isComplete = await getUserRole.save();
                        }
                    }
                }
                if (checkExitsIdUser === 0)
                {
                    for (let i = 0; i < getArrayRolesId.length; i++) {
                        getUserRole = new UserRole({
                            user_id: getData._id,
                            role_permission_id: new ObjectId(getArrayRolesId[i]),
                        });
                        isComplete = await getUserRole.save();
                    }
                }
                if (getData) {
                    getNewData = await User.findOne({ _id: id });
                    setLogger.logUpdate(getInfoUser, req);
                    return res.json({
                        status: 200,
                        success: true, message: 'Infomation field has been updated'
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
        }
        else {
            if (req.body.old_avatar) {
                getOldAvatar = req.body.old_avatar;
                req.body.avatar = getOldAvatar;
                getData = await User.findByIdAndUpdate(id, { $set: req.body });              
                avatar = req.body.old_avatar;
                //update RoleUser
                _objectID = new ObjectId(id);               
                checkExitsIdUser = await UserRole.findOne({ user_id:getData._id }).count();               
                if (checkExitsIdUser > 0) {
                    isDeleted = await UserRole.deleteMany({ user_id: getData._id });
                    if (isDeleted) {
                        for (let i = 0; i < getArrayRolesId.length; i++) {
                            getUserRole = new UserRole({
                                user_id: getData._id,
                                role_permission_id: new ObjectId(getArrayRolesId[i]),
                            });
                            isComplete = await getUserRole.save();
                        }
                    }
                }
                if (checkExitsIdUser === 0)
                {
                    for (let i = 0; i < getArrayRolesId.length; i++) {
                        getUserRole = new UserRole({
                            user_id: getData._id,
                            role_permission_id: new ObjectId(getArrayRolesId[i]),
                        });
                        isComplete = await getUserRole.save();
                    }
                }
                if (getData) {
                    getNewData = await User.findOne({ _id: id });
                    return res.json({
                        status: 200,
                        success: true, message: 'Infomation field has been updated'
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
let changeAvatar = async (req, res) => {
    try {       
        if (req.file) {
            if (req.file.originalname !== undefined) {
                let id = new ObjectId(req.params.id);               
                getName = 'uploads/' + new Date().toISOString().split('T')[0] + req.file.originalname;                
                getData = await User.findByIdAndUpdate(id, { avatar: getName });
                if (getData) {
                    setLogger.logUpdate(getInfoUser, req);
                    return res.json({
                        status: 200,
                        success: true, message: 'Infomation field has been updated',
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
        }
        else {
            res.json("undefinde avatar");
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
let changePassword = async (req, res) => {
    try {
        getIdUser = req.params.id;
        Oldpw = req.body.old_password;
        Newpw = req.body.new_password;
        Repeatpw = req.body.repeat_password;
        checkUser = await User.find({ _id: getIdUser }).count();
        if (checkUser > 0) {
            getInfoUser = await User.findOne({ _id: getIdUser });
            let checkOldPw = await bcrypt.compare(Oldpw, getInfoUser.password);
            if (checkOldPw) {
                if (Newpw === Repeatpw) {
                    hashNewpw = await hashpw(Newpw);
                    isComplete = await User.findByIdAndUpdate({ _id: getIdUser }, { password: hashNewpw });
                    if (isComplete) {
                        // getNewData = await User.findOne({ _id: getIdUser});
                        res.json({
                            status: 200,
                            success: true, message: 'Password has been updated'
                        });
                    }
                }
                else {
                    res.json({
                        status: 422,
                        message: 'Repeat password incorect',
                    });

                }
            }
            else {
                res.json({
                    status: 421,
                    message: 'Old password incorect',
                });
            }
        }
        else {
            res.json({
                status: 404,
                message: 'This user no exits',
            });
        }

    }
    catch (err) {
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
const changeLanguage = async (req, res) => {
    lang = req.query.lang || 'vi';
    const language = await i18n.getCatalog(lang);
    if (language) {
        res.json({
            status: 200,
            message: 'Get Data Completed',
            data: language, lang
        });
    }
}
///***********Mail****************
let sendMail = async (req, res) => {
    try {
        const randomToken = await generateRandomToken(32);
        getMail = req.body.to;
        ischeckMail = await User.findOne({ email: getMail }).count();
        if (ischeckMail === 0) {
            res.json({
                status: 200,
                error:'This mail not exits'               

            });
        }
        else {
            TokenResetPw = await generateResetToken(randomToken, getMail);
            getInfo=await User.find({ email: getMail }).select('fullname');           
            const htmlString = `
            <html>
            <head>
               <style>
                  .banner-color {
                  background-color: #0f71b8;
                  }
                  .title-color {
                  color: #0066cc;
                  }
                  .button-color {
                  background-color: #0066cc;
                  }
                  @media screen and (min-width: 500px) {
                  .banner-color {
                  background-color: #45a049;
                  }
                  .title-color {
                  color: #eb681f;
                  }
                  .rounded-button {
                    background-color: #4CAF50; /* Màu xanh */
                    color: white; /* Màu chữ trắng */
                    border: none; /* Loại bỏ đường viền */
                    padding: 10px 20px; /* Kích thước nút */
                    text-align: center; /* Canh giữa chữ */
                    text-decoration: none; /* Loại bỏ gạch chân */
                    display: inline-block; /* Hiển thị nút như một phần tử inline */
                    font-size: 16px; /* Kích thước chữ */
                    border-radius: 20px; /* Bo tròn góc */
                    cursor: pointer; /* Hiển thị con trỏ khi di chuột */
                    transition-duration: 0.4s; /* Thời gian chuyển đổi */
                }
                
                .rounded-button:hover {
                    background-color: #45a049; /* Màu xanh đậm khi di chuột qua */
                }
                  }
               </style>
            </head>
            <body>
               <div style="background-color:#000099;padding:0;margin:0 auto;font-weight:200;width:100%!important">
                  <table align="center" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;font-weight:200;font-family:Helvetica,Arial,sans-serif" width="100%">
                     <tbody>
                        <tr>
                           <td align="center">
                              <center style="width:100%">
                                 <table bgcolor="#FFFFFF" border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;max-width:512px;font-weight:200;width:inherit;font-family:Helvetica,Arial,sans-serif" width="512">
                                    <tbody>                                     
                                       <tr>
                                          <td align="left">
                                             <table border="0" cellspacing="0" cellpadding="0" style="font-weight:200;font-family:Helvetica,Arial,sans-serif" width="100%">
                                                <tbody>
                                                   <tr>
                                                      <td width="100%">
                                                         <table border="0" cellspacing="0" cellpadding="0" style="font-weight:200;font-family:Helvetica,Arial,sans-serif" width="100%">
                                                            <tbody>
                                                               <tr>
                                                                  <td align="center" bgcolor="#8BC34A" style="padding:20px 48px;color:#ffffff" class="banner-color">
                                                                     <table border="0" cellspacing="0" cellpadding="0" style="font-weight:200;font-family:Helvetica,Arial,sans-serif" width="100%">
                                                                        <tbody>
                                                                           <tr>
                                                                              <td align="center" width="100%">
                                                                                 <h1 style="padding:0;margin:0;color:#ffffff;font-weight:500;font-size:20px;line-height:24px">XÁC MINH TÀI KHOẢN</h1>
                                                                              </td>
                                                                           </tr>
                                                                        </tbody>
                                                                     </table>
                                                                  </td>
                                                               </tr>
                                                               <tr>
                                                                  <td align="center" style="padding:20px 0 10px 0">
                                                                     <table border="0" cellspacing="0" cellpadding="0" style="font-weight:500;font-family:Helvetica,Arial,sans-serif" width="100%">
                                                                        <tbody>
                                                                           <tr>
                                                                              <td align="center" width="100%" style="padding: 0 15px;text-align: justify;color: rgb(76, 76, 76);font-size: 12px;line-height: 18px;">
                                                                                 <h3 style="font-weight: 600; padding: 0px; margin: 0px; font-size: 16px; line-height: 24px; text-align: center;" class="title-color">Chào ${getInfo[0].fullname},</h3>
                                                                                 <p style="margin: 20px 0 30px 0;font-size: 15px;text-align: center;">Yêu cầu xác minh tài khoản của bạn đã được nhận, vui lòng nhấp vào liên kết bên dưới để xác nhận tài khoản.</b>!</p>
                                                                                 <p style="font-weight: 200; text-align: center; margin: 25px;text-decoration:none";font-size: 25px ><a href="http://192.168.48.145:8080/reset-password/${TokenResetPw}">Xác nhận tài khoản</a></p>
                                                                                 <p style="margin: 20px 0 30px 0;font-size: 15px;text-align: center;">Liên kết của bạn sẽ hết hạn trong 3 phút </p>
                                                                              </td>
                                                                           </tr>
                                                                        </tbody>
                                                                     </table>
                                                                  </td>
                                                               </tr>
                                                               <tr>
                                                               </tr>
                                                               <tr>
                                                               </tr>
                                                            </tbody>
                                                         </table>
                                                      </td>
                                                   </tr>
                                                </tbody>
                                             </table>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td align="left">
                                             <table bgcolor="#FFFFFF" border="0" cellspacing="0" cellpadding="0" style="padding:0 24px;color:#999999;font-weight:200;font-family:Helvetica,Arial,sans-serif" width="100%">
                                                <tbody>                                                  
                                                   <tr>
                                                      <td align="center" width="100%">
                                                         <table border="0" cellspacing="0" cellpadding="0" style="font-weight:200;font-family:Helvetica,Arial,sans-serif" width="100%">
                                                            <tbody>
                                                               <tr>
                                                                  <td align="center" style="padding:0 0 8px 0" width="100%"></td>
                                                               </tr>
                                                            </tbody>
                                                         </table>
                                                      </td>
                                                   </tr>
                                                </tbody>
                                             </table>
                                          </td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </center>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </body>
         </html>
         
         
        `;
        
        // Gửi HTML với CSS đã tích hợp đến client hoặc làm bất kỳ việc nào khác bạn cần
        
            const { to, subject } = req.body;
            body = htmlString;
            const getToken = new StoreToken({
                token_code: randomToken,
                email_code: getMail,
            });
            isSendMail = await mailer.sendMail(to, subject, body);
            isComplete = await getToken.save();
            if (isSendMail) {
                res.json({
                    status: 200,
                    messege: 'Your email has been sent successfully',
                    //token: TokenResetPw,
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
let resetPassword = async (req, res) => {    
    AccessToken = req.params.id;
    if (AccessToken !== null) {
        jwt.verify(AccessToken, process.env.JWT_SECRET, async (err, info) => {
            if (info) {                
                getToken = info;
                isCheck = await StoreToken.findOne({ token_code: getToken.randomToken }).count();
                if (isCheck > 0) {
                    Newpw = req.body.new_password;
                    Repeatpw = req.body.repeat_password;
                    if (Newpw === Repeatpw) {
                        hashNewpw = await hashpw(Newpw);                       
                        isComplete = await User.findOneAndUpdate({ email: getToken.getMail }, { password: hashNewpw });
                        if (isComplete) {
                            res.json({
                                status: 200,
                                success: true,
                                message: 'Password has been updated',
                            });
                        }
                    }
                    else {
                        res.json({
                            status: 422,
                            message: 'Repeat password incorect',
                        });
                    }
                }
            }
            if (err) {
                res.json({
                    status: 401,
                    message: 'Token Has been expried or Invalid',
                });
            }
        });
    }
    else {
        res.json({
            status: 422,
            message: 'Token Invalid',
        });
    }
}

let generateRandomToken = (length) => {
    return crypto.randomBytes(length).toString('hex');
}
let generateResetToken = async (randomToken, getMail) => {
    return jwt.sign({ randomToken, getMail },
        process.env.JWT_SECRET,
        { expiresIn: '3m' }
    );
}
const setConfigCryptJson = async (req, res) => {
    const configFilePath = path.resolve(__dirname, '../../../config/cryptJson.js');
    const configContent = require(configFilePath);
    configContent.encryptionEnabled = !configContent.encryptionEnabled;   
    fs.writeFileSync(configFilePath, `module.exports = ${JSON.stringify(configContent, null, 2)};\n`);
    res.json({ message: 'encryptionEnabled updated config to ' + configContent.encryptionEnabled + ' successfully.' });
}
module.exports =
{
    listUser: listUser,
    listRoleUser: listRoleUser,
    register: register,
    checkLogin: checkLogin,
    checkLogout: checkLogout,
    hashpw: hashpw,   
    Infomation: Infomation,
    destroyUser: destroyUser,
    updateUser: updateUser,
    changePassword: changePassword,
    changeAvatar: changeAvatar,
    changeLanguage: changeLanguage,
    sendMail: sendMail,
    generateRandomToken: generateRandomToken,
    resetPassword: resetPassword,
    generateResetToken, generateResetToken,
    setConfigCryptJson: setConfigCryptJson,
}
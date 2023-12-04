
const User = require('../models/user');
const Position = require('../models/position');
const Region = require('../models/region');
const Department = require('../models/department');
const Role = require('../models/role');
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');
const mailer = require('../../helper/sendmail');
const crypto = require('crypto');
const StoreToken = require('../models/store_token');
const TestImage = require('../models/test_image');
const cryptJSon = require('../../helper/cryptJSon');
//Lấy danh sách user
let listUser = async (req, res) => {
    try {
        const token = req.headers.token; 
        let dataPosition =await cryptJSon.encryptData(token, await Position.find({}));
        let dataRegion =await cryptJSon.encryptData(token, await Region.find({}));
        let dataDepartment =await cryptJSon.encryptData(token, await Department.find({}));
        let getData =await cryptJSon.encryptData(token, await User.aggregate([
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
                message: 'Lấy dữ liệu thành công!!!',
                data: getData,dataPosition,dataDepartment,dataRegion
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
let Infomation = async (req, res) => {
    const token = req.headers.token;
    let dataPosition =await cryptJSon.encryptData(token, await Position.find({}));
    let dataRegion =await cryptJSon.encryptData(token, await Region.find({}));
    let dataDepartment =await cryptJSon.encryptData(token, await Department.find({}));
    let dataRole = await cryptJSon.encryptData(token,await Role.find({}));
    getData =await cryptJSon.encryptData(token, await User.aggregate([
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
            message: 'Get Data Completed!!',
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
                message: 'Get Data Completed!!',

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
//Thêm mới user
let register = async (req, res) => {
    try {
        console.log(req.body);
        myObject = req.body;
        if (req.file) { 
            if (req.file.originalname !== undefined)
            {       
            getPw = req.body.password ? await hashpw(req.body.password) : req.body.password;
            reqName=new Date().toISOString().split('T')[0]+req.file.originalname;      
           getNameImage='uploads/'+reqName;          
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
            if (getData) {
                res.json({
                    status: 200,
                    message: 'Get Data Completed!!',
                    data: getData,
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
    }
    else
    {
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
            avatar:'uploads/avatar.png',     
            
        });
        let getData = await getUser.save();
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData,
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
let checkLogin = async (req, res) => {
    try
    {
    console.log(res.body);
    let user = req.body.username;
    let pws = req.body.password;
    let checkExits = await User.findOne({ username: user }).count();
    if (checkExits <= 0) {
        return res.json({ status: 500, message: 'Username or passsword incorect!!!' });
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
            },
        },
        {
            $project: {
                _id: 0, 
                role_permission_name: 1,
                role_permission_group: 1,
            },
        },       
    ]);  
    const isAdmin = getRoleUser.length > 0 && getRoleUser[0].role_permission_name.includes('admin')?'admin':'';    
   // getRoleUser[0].role_permission_group.map(JSON.parse).flat();  
    const _getPermissionGroup = getRoleUser[0].role_permission_group.flatMap(group => JSON.parse(group));
    const getPermissionGroup = [...new Set(_getPermissionGroup)];
    console.log('nhóm quyền của user là',getPermissionGroup)
    console.log('user này có quyền admin:',isAdmin);
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
        res.json({ status: 500, message: 'Username or passsword incorect!!!' });
        return;
    }   
    let checkPw = await bcrypt.compare(pws, checkUser.password);
    const _SecurityKey = crypto.randomBytes(32).toString('hex');
    const _initVector = crypto.randomBytes(16).toString('hex');      
    let AccessToken = jwt.sign({ _id: checkUser._id, user: checkUser.username,_SecurityKey,_initVector,roles:{isAdmin,getPermissionGroup}},
        process.env.JWT_SECRET,       
        { expiresIn: "1h" }
    );    
    checkUser && checkPw ? res.json({ status: 200, message: 'You has been login completed!!!', AccessToken, getInfo }) : res.json({ status: 500, message: 'Username or passsword incorect!!!' })
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
let checkLogout = async (req, res) => {   
    try{
    const token = req.headers.token;
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (user) {
            res.clearCookie("jwt", { maxAge: 1 })
            return res.json('You has been sign out!!!');
        }
        if (err) {
            return res.json('Error!!!');
        }
    })
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
let hashpw = async (pw) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pw, salt);
}
let uploadImage = async (req, res) => {  

   reqName=new Date().toISOString().split('T')[0]+req.file.originalname
     getNameImage='uploads/'+reqName;
   StoreTestImage =new TestImage({
    username:req.body.username,
    email:req.body.email,
    image_path:reqName,
   })
   isComplete=await StoreTestImage.save();
   if (isComplete) {
    res.json({
        status: 200,
        messege: 'Update data Image successfully',     
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
let destroyUser = async (req, res) => {
    try {
        let id = req.query.id;
        getId = await User.findByIdAndRemove({ _id: id });
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
let updateUser = async (req, res) => {
    try {
        let id = req.query.id;     
        console.log(req.body);       
        if(req.file)
          {
            if (req.file.originalname !== undefined)
            {
                getName='uploads/'+new Date().toISOString().split('T')[0]+req.file.originalname;
                req.body.avatar=getName;
                getData = await User.findByIdAndUpdate(id, { $set: req.body });
                if (getData) {
                    getNewData = await User.findOne({ _id: id });
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
          }
          else
          {
            if(req.body.old_avatar)
            {
                getOldAvatar=req.body.old_avatar;
                req.body.avatar= getOldAvatar;    
                getData = await User.findByIdAndUpdate(id, { $set:req.body });
                avatar=req.body.old_avatar;
                if (getData) {
                    getNewData = await User.findOne({ _id: id });
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
let changePassword = async (req, res) => {
    try {
        console.log(req.body);
        getIdUser = req.params.id;
        Oldpw = req.body.old_password;
        Newpw = req.body.new_password;
        Repeatpw = req.body.repeat_password;
        checkUser = await User.find({ _id: getIdUser }).count();
        if (checkUser > 0) {
            getInfoUser = await User.findOne({ _id: getIdUser });
            let checkOldPw = await bcrypt.compare(Oldpw, getInfoUser.password);
            console.log(checkOldPw);
            if (checkOldPw) {
                if (Newpw === Repeatpw) {
                    hashNewpw = await hashpw(Newpw);
                    isComplete = await User.findByIdAndUpdate({ _id: getIdUser }, { password: hashNewpw });
                    if (isComplete) {
                        // getNewData = await User.findOne({ _id: getIdUser});
                        res.json({
                            status:200,
                            success: true, message: 'Password has been updated !!!'
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
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}
///***********Mail****************
let sendMail = async (req, res) => {
    try {
        const randomToken = await generateRandomToken(32); 
        getMail = req.body.to;
        ischeckMail=await User.findOne({email:getMail}).count();
        if(ischeckMail===0)
        {
            res.json({
                status: 404,
                messege: 'This mail not exits',
                
            });        }
        else 
              {        
        TokenResetPw = await generateResetToken(randomToken, getMail);        
        const htmlString = `
                <div>
                  <h1>XÁC MINH TÀI KHOẢN</h1>
                  <p>
                    Yêu cầu xác minh tài khoản của bạn đã được nhận, vui lòng nhấp vào liên kết bên dưới để xác nhận tài khoản.
                  </p>
                  <a href="http://192.168.48.145:8080/reset-password/${TokenResetPw}">Xác nhận tài khoản </a>
                
                  <p>
                    Liên kết của bạn sẽ hết hạn trong 3 phút 
                  </p>
                </div>
              `;
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
                token: TokenResetPw,
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
let resetPassword = async (req, res) => {
    console.log(req.params.id);
    AccessToken = req.params.id;
    if (AccessToken !== null) {
        jwt.verify(AccessToken, process.env.JWT_SECRET, async (err, info) => {
            if (info) {
                console.log("giá trị thông tin nhận được là:",info);
                getToken = info;
                isCheck = await StoreToken.findOne({ token_code: getToken.randomToken }).count();
                if (isCheck > 0) {
                    Newpw = req.body.new_password;
                    Repeatpw = req.body.repeat_password;
                    if (Newpw === Repeatpw) {
                        hashNewpw = await hashpw(Newpw);
                        console.log(hashNewpw);
                        isComplete = await User.findOneAndUpdate({ email: getToken.getMail }, { password: hashNewpw });
                        if (isComplete) {
                            res.json({
                                status: 200,
                                success: true,
                                message: 'Password has been updated !!!',
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
module.exports =
{
    listUser: listUser,
    listRoleUser: listRoleUser,
    register: register,
    checkLogin: checkLogin,
    checkLogout: checkLogout,
    hashpw: hashpw,
    uploadImage: uploadImage,
    Infomation: Infomation,
    destroyUser: destroyUser,
    updateUser: updateUser,
    changePassword: changePassword,
    sendMail: sendMail,
    generateRandomToken: generateRandomToken,
    resetPassword: resetPassword,
    generateResetToken, generateResetToken
}
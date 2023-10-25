
const User = require('../models/user');
const Position = require('../models/position');
const Region = require('../models/region');
const Department = require('../models/department');
const Role=require('../models/role');
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');
//Lấy danh sách user
let listUser = async (req, res) => {
    try {
        // let getPosition = await Position.find({});
        // let getRegion = await Region.find({});
        // let getDepartment = await Department.find({});
        //let getData = await User.find({});
        let getData = await User.aggregate([
            // {
            //     $addFields: {
            //         region_id: {
            //             $toObjectId: "$region_id"
            //         },
            //          position_id: {
            //             $toObjectId: "$position_id"
            //         },
            //           department_id: {
            //             $toObjectId: "$department_id"
            //         },
            //     }
            // },
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
            
            
            
        ]);
        if (getData) {
            res.json({
                status: 200,
                message: 'Lấy dữ liệu thành công!!!',
                data: getData,
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}
let Infomation = async (req, res) => {
     let dataPosition = await Position.find({});
     let dataRegion = await Region.find({});
     let dataDepartment = await Department.find({});
     let dataRole = await Role.find({});
    // let getData = await User.find({}, { password: 0, repeat_password: 0, username: 0, });
    getData=await User.aggregate([
        {           
            $project: {
              _id: 1,
              password: 0,
              username:0,
            
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
        
        
            ])
    if (getData) {
        res.json({
            status: 200,
            message: 'Lấy dữ liệu thành công!!!',
            data: getData,dataPosition,dataRegion,dataDepartment,dataRole
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
                message: 'Đã lấy dữ liệu thành công!!!',

            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}
//Thêm mới user
let register = async (req, res) => {
    try {      
        //     checkId = await User.find({ user_code: req.body.user_code }).count();
        //     if (checkId > 0) {
        //         return res.status(200).json({
        //             success: true, message: 'This User ID exits!!',
        //         });
        //    }
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
            gender:req.body.gender,
            birthday:req.body.birthday,
            // avatar: req.file.originalname,
            avatar: 'uploads/avatar.png',
        });
        // console.log(getUser); 
        let getData = await getUser.save();
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData,
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}
let checkLogin = async (req, res) => {
    let user = req.body.username;
    let pws = req.body.password;   
    let checkUser = await User.findOne({ username: user }); 
   // let getInfo = await User.findOne({ username: user });    
    getInfo=await User.aggregate([
        {           
            $project: {
              _id: 1,             
              username:1,
              fullname:1,
              region_id:1,
              department_id:1,
              position_id:1            
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
            console.log(checkUser.username);
   // let idUser=checkUser._id;
   // console.log('giá trị user nhận được là',getInfo);  
    if (!checkUser) {
        res.json({ status: 500, message: 'Username or passsword incorect!!!' });
        return;
    }
    console.log('thông tin user', checkUser);
    let checkPw = await bcrypt.compare(pws, checkUser.password);
   // let AccessToken = jwt.sign({ user_code: checkUser.user_code, user: checkUser.username },
     let AccessToken = jwt.sign({ _id: checkUser._id, user: checkUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("jwt", AccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 2hrs in ms
    });
    getCookie = req.cookies.jwt;
    checkUser && checkPw ? res.json({ status: 200, message: 'You has been login completed!!!', AccessToken,getInfo }) : res.json({ status: 500, message: 'Username or passsword incorect!!!' })
}

let checkLogout = async (req, res) => {

    //const token = req.cookies.jwt;
    const token = req.headers.token;
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (user) {
            res.clearCookie("jwt", { maxAge: 1 })
            // *********sử dụng cho set Cookie*****************
            //   let NewToken=  await jwt.sign({ user_code: user.user_code, user: user.user },
            //         process.env.JWT_SECRET,
            //         { expiresIn: "10s" } 
            //    );              
            return res.json('You has been sign out!!!');
        }
        if (err) {
            return res.json('Error!!!');
        }
    })

}
let hashpw = async (pw) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pw, salt);

}
let uploadImage = async (req, res) => {
    console.log(req.file.originalname);
    //console.log('insert image');
    // console.log(req.body.image)
    // var img = fs.readFileSync(req.file.path);
    // var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database

    // var finalImg = {
    //   contentType: req.file.mimetype,
    //   image:  new Buffer(encode_image, 'base64')
    // };
}
let destroyUser = async (req, res) => {
    try {
        let id = req.query.id;
        getId = await User.findByIdAndRemove({ _id: id });
        if (getId) {

            return res.status(200).json({
                success: true, message: 'This field has been removed!!!',
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
let updateUser=async(req,res)=>{
    try {
        let id = req.query.id;       
        console.log(req.body);      
        getData = await User.findByIdAndUpdate(id, { $set: req.body });       
        if (getData) {           
            getNewData = await User.findOne({ _id: id });
            return res.status(200).json({
                success: true, data: getNewData, message: 'Infomation field has been updated !!!'
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
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
    destroyUser:destroyUser,
    updateUser:updateUser,
}
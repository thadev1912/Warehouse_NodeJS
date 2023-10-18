
const User = require('../models/user');
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
//Lấy danh sách user
let listUser = async (req, res) => {
    try {
        let getData = await User.find({});
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
        console.log(req.body);
        checkId = await User.find({ user_code: req.body.user_code }).count();
        if (checkId > 0) {
            return res.status(200).json({
                success: true, message: 'This User ID exits!!',
            });
        }
        getPw = req.body.password ? await hashpw(req.body.password) : req.body.password;
        const getUser = new User({
            user_code: req.body.user_code,
            fullname: req.body.fullname,
            username: req.body.username,
            role_id: req.body.role_id,
            email: req.body.email,
            sex: req.body.sex,
            address: req.body.address,
            phone: req.body.phone,
            password: getPw,
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
    if (!checkUser) {
        res.json({ status: 500, message: 'Username or passsword incorect!!!' });
        return;
    }
    console.log('thông tin user', checkUser);
    let checkPw = await bcrypt.compare(pws, checkUser.password);
    let AccessToken = jwt.sign({ user_code: checkUser.user_code, user: checkUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("jwt", AccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 2hrs in ms
    });
    getCookie = req.cookies.jwt;
    checkUser && checkPw ? res.json({ status: 200, message: 'You has been login completed!!!', AccessToken }) : res.json({ status: 500, message: 'Username or passsword incorect!!!' })
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
let uploadImage=async (req, res) => {
    console.log('insert image');
}

module.exports =
{
    listUser: listUser,
    listRoleUser: listRoleUser,
    register: register,
    checkLogin: checkLogin,
    checkLogout: checkLogout,
    hashpw: hashpw,
    uploadImage:uploadImage,
}
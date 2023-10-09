
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
                    localField: "user_id",
                    foreignField: "user_id",
                    as: "oles",
                },
            },
            { $match: { 'user_id': 'UHP' } },
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
        getPw = req.body.password ? await hashpw(req.body.password) : req.body.password;
        const getUser = new User({
            user_id: req.body.user_id,
            username: req.body.username,
            password: getPw,
        });
        // console.log(getUser); 
        let getData = await getUser.save();
        if (getData) {
            res.json({
                status: 200,
                message: 'Đã thêm mới dữ liệu!!!',
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
    let checkPw = await bcrypt.compare(pws, checkUser.password);
    let AccessToken = jwt.sign({ id: checkUser.user_id, user: checkUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }  //thời gian token tồn tại
    );
    res.cookie("jwt", AccessToken, {
        httpOnly: true,
        maxAge: 200000, // 3hrs in ms
    });
    getCookie=req.cookies.jwt;
    console.log('giá trị cookie của token là:',getCookie);
    checkUser && checkPw ? res.json({ status: 200, message: 'Đăng nhập thành công!!!', AccessToken }) : res.json({ status: 500, message: 'Đăng nhập thất bại!!!' })

}

let checkLogout = async (req, res) => {
    res.clearCookie("jwt", { maxAge: 1 })
    // res.redirect("/")  
    getCookie=req.cookies;
    console.log('giá trị cookie của token là:',getCookie);
    res.json('bạn đã đăng xuất');

}
let hashpw = async (pw) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pw, salt);

}


module.exports =
{
    listUser: listUser,
    listRoleUser:listRoleUser,
    register: register,
    checkLogin: checkLogin,
    checkLogout: checkLogout,
    hashpw: hashpw,
}
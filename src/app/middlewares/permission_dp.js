const jwt = require("jsonwebtoken");
const User = require('../models/user');
const middlewarePermision = {
    checkPermision: (req, res, next) => {
        // const token = req.headers.token; //cách lấy từ header
        //  const token = req.cookies.jwt;
        req.headers.token = req.cookies.jwt;
        const token = req.headers.token;
        console.log('giá trị token nhận được là', token);
        if (token != null) {
            const AccessToken = token;
            jwt.verify(AccessToken, process.env.JWT_SECRET, async (err, user) => {
                if (user) {
                    getInfoUser = user;//thông tin user                   
                    // getRole = await User.findOne({ user_id: getInfoUser.id });
                    getRole = await middlewarePermision.getRoles(getInfoUser.id);                     
                    console.log(getRole[0].roles[0].role_name);
                    if(getRole[0].roles[0].role_name!=='admin')
                    {
                           res.status(401).json("Bạn chưa có quyền truy cập vào danh mục này!!");
                           return;
                    }
                    next();
                }

            });

        }
        else {
            res.status(401).json(" Vui lòng đăng nhập tài khoản hệ thống.....");
        }
    },
    getRoles: async (data) => {

        getData = await User.aggregate([
            {
                $lookup: {
                    from: "roles",
                    localField: "user_id",
                    foreignField: "user_id",
                    as: "roles",
                },
            },
            { $match: { 'user_id': data } },
        ]);
        return getData
    }

}
module.exports = middlewarePermision
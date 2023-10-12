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
                   // console.log('gia tri id',getInfoUser);
                    getRole = await middlewarePermision.getRoles(getInfoUser.user_code); 
                    console.log(getRole[0].roles[0].role_name);
                   let _isRole=getRole[0].roles[0].role_name;
                    if((_isRole!=='admin')&&(_isRole!=='qtv'))
                    {
                        res.status(401).json("Bạn chưa có quyền truy cập chức năng này.....");
                          return;
                    }                                             
                    
                     next();
                }

            });

        }
        else {
            res.status(401).json("Vui lòng đăng nhập tài khoản hệ thống.....");
        }
    },
    getRoles: async (data) => {

        getData = await User.aggregate([
            {
                $lookup: {
                    from: "roles", 
                    localField: "role_id",
                    foreignField: "role_code",
                    as: "roles",                    
                },
            },
            { $match: { 'user_code':data } },
        ]);    
        return getData
    },
    

}
module.exports = middlewarePermision
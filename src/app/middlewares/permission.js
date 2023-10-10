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
            jwt.verify(AccessToken, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    res.status(403).json("Token không hợp lệ");
                }
                if (user) {
                    getInfoUser = user;//thông tin user
                    console.log('thông tin user', getInfoUser.id)
                    User.findOne({ user_id: getInfoUser.id })
                        .then((data) => {
                            getRole = data.role;
                            if (getRole === 'admin' &&getInfoUser) {
                                console.log(getRole);
                              return  next();
                            }
                            else {
                                res.status(401).json("Bạn chưa có quyền truy cập vào danh mục này!!");
                            }
                        })
                }
                next();
            });
        }


        else {
            res.status(401).json("Bạn chưa có token! Vui lòng đăng nhập.....");
        }
    }

}
module.exports = middlewarePermision
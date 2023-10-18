const jwt = require("jsonwebtoken");
const User = require('../models/user');
const middlewarePermision = {
    checkPermision: (req, res, next) => {
        //   req.headers.token = req.cookies.jwt;
        const token = req.headers.token;
        //console.log('giá trị token nhận được là là', token);
        const AccessToken = token.split(" ")[1];
        if (token != null) {
            jwt.verify(AccessToken, process.env.JWT_SECRET, async (err, user) => {
                if (user) {
                    getInfoUser = user;//thông tin user                  
                    //console.log('gia tri id', getInfoUser);
                    getRole = await middlewarePermision.getRoles(getInfoUser.user_code);
                    //console.log(getRole[0].roles[0].role_name);
                    let _isRole = getRole[0].roles[0].role_name;
                    if ((_isRole !== 'admin') && (_isRole !== 'user')) {
                        res.status(401).json("You haven't permision for this page.....");
                        return;
                    }

                    next();
                }
                else {
                    return res.status(401).json("Please login acccount system.....");
                }

            });

        }
        else {
            res.status(401).json("Please login acccount system.....");
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
            { $match: { 'user_code': data } },
        ]);
        return getData
    },


}
module.exports = middlewarePermision
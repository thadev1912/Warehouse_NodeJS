const { ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const middlewarePermision = {
    checkPermision: (req, res, next) => {        
        const token = req.headers.token;   
        if (token != null) {
            const AccessToken = token.split(" ")[1];
            jwt.verify(AccessToken, process.env.JWT_SECRET, async (err, user) => {
                if (user) {
                    getInfoUser = user;//thông tin user                 
                    const _id = new ObjectId(getInfoUser._id);
                    getRole = await middlewarePermision.getRoles(_id);
                    //console.log(getRole[0].roles[0].role_name);
                    let _isRole = getRole[0].roles[0].role_name;
                    if (_isRole === 'admin') {
                        next();
                    }
                   else if(_isRole==='user')
                   {
                       //
                   }
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
            { $match: { '_id': data } },
        ]);
        return getData
    },


}
module.exports = middlewarePermision
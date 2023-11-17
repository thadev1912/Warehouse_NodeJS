const { ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const middlewareAuth = {
    checkAuth: (req, res, next) => {        
        const token = req.headers.token;   
        if (token != null) {
            const AccessToken = token.split(" ")[1];
            jwt.verify(AccessToken, process.env.JWT_SECRET, async (err, user) => {
                if (user) {
                   getInfoUser = user;//thông tin user              
                 console.log('giá trị midleware0',getInfoUser);
                    next();
                }
                else {
                   return res.json({
                        status: 401,
                        messege: 'Please login acccount system.....',     
                    });
                   // return res.status(401).json("Please login acccount system.....");
                }
                if(err)
                {
                    return res.json({
                        status: 403,
                        messege: 'Token invalid or has been expried',     
                    });
                    //return res.status(403).json("Token invalid or has been expried");
                }
            });           
        }
        else {
            return res.json({
                status: 401,
                messege: 'Access denied, Please login acccount system.....',     
            });
            //res.status(401).json("Access denied, Please login acccount system.....");
        }
    },   
}
module.exports = middlewareAuth
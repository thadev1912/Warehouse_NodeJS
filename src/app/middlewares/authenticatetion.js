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
                   getInfoUser = user;             
                 //console.log('giá trị midleware0',getInfoUser);
                    next();
                }                
                if(err)
                {
                    return res.json({
                        status: 402,
                        message: 'Token invalid or has been expried',     
                    });                  
                }
            });           
        }
        else {
            return res.json({
                status: 401,
                message: 'Access denied, Please login to perform this action',     
            });           
        }
    },   
}
module.exports = middlewareAuth
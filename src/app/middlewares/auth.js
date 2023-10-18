const jwt = require("jsonwebtoken");
const middlewareAuthentication = {
    checkLogin: (req, res, next) => {
        // const token = req.headers.token; //dùng cho postman
        req.headers.token =req.cookies.jwt;
        const token=req.headers.token;
      // const token = req.cookies.jwt;        
        if (token != null) {
           
            console.log(token);    
           //const AccessToken=token.split(" ")[1];      
            const AccessToken = token;
            jwt.verify(AccessToken, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    res.status(403).json("Your token invalid");
                }
                if (user)
                {
                   
                     req.user = user;  // giá trị một token đã được mã hóa lại
                     next();
                                    }
                          })
        }
        else {
            res.status(401).json("Please login acccount system.....");
        }
    }
}
module.exports = middlewareAuthentication
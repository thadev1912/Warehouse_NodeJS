const jwt = require("jsonwebtoken");
const middlewareAuthentication = {
    checkLogin: (req, res, next) => {
        // const token = req.headers.token; //dùng cho postman
        req.headers.token =req.cookies.jwt;
        const token=req.headers.token;
      // const token = req.cookies.jwt;
        console.log('giá trị token nhận được là',token);
        if (token != null) {
           
            console.log(token);    
           //const AccessToken=token.split(" ")[1];      
            const AccessToken = token;
            jwt.verify(AccessToken, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    res.status(403).json("Token không hợp lệ");
                }
                if (user)
                {
                    console.log('request user',user);
                     req.user = user;  // giá trị một token đã được mã hóa lại
                     next();
                                    }
                          })
        }
        else {
            res.status(401).json("Bạn chưa có token! Vui lòng đăng nhập.....");
        }
    }
}
module.exports = middlewareAuthentication
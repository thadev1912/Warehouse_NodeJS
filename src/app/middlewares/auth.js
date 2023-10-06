const jwt = require("jsonwebtoken");
const middlewareAuthentication = {
    verifyToken: (req, res, next) => {
       // const token = req.headers.token; //cách lấy từ header
         const token = req.cookies.jwt;        
        if (token!=null) {
            console.log(token);
            //const AccessToken = token.split("")[1];
             const AccessToken = token;
            console.log('AccesToken sau khi cover được là',AccessToken);

            jwt.verify(AccessToken, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    res.status(403).json("Token không hợp lệ");
                }
                req.user = user;  // giá trị một token đã được mã hóa lại
                console.log('Server đã nhận được token có tên là', req.user);                
                next();
            })
        }
        else {
            res.status(401).json("Vui lòng đăng nhập")
        }
    }
}
module.exports = middlewareAuthentication
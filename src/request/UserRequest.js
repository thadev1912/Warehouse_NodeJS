//Region validate:
const joiBase = require('@hapi/joi')
const joiDate = require('@hapi/joi-date');
//const joi = joiBase.extend(joiDate);
const Joi = joiBase.extend(joiDate);
const passwordComplexity = require("joi-password-complexity");
const complexityOptions = {
    min: 10,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
};
const middlewareValidate = {
    checkValidate: (req, res, next) => {
        const checkUser = Joi.object({          
          
            username:Joi.string().required().messages({
                'string.empty': `Username không được bỏ trống`,
                'string.min': `Username ít nhất 6 ký tự`,
            }),
            fullname: Joi.string().min(8)
                .required().messages({
                    'string.empty': `Họ tên thông tin không được bỏ trống`,
                    'string.min': `Thông tin họ tên quá ngắn`,
                }),

            gender: Joi.string()
                .required().messages({
                    'string.empty': `Giới tính không được bỏ trống`,

                }),
            password: passwordComplexity(complexityOptions).messages({
                'passwordComplexity.tooShort': `Mật khẩu của bản quá ngắn`,
                'passwordComplexity.lowercase': `Mật khẩu phải có ít nhất một ký tự thường`,
                'passwordComplexity.uppercase': `Mật khẩu phải có ít nhất một ký tự viết hoa`,
                'passwordComplexity.numeric': `Mật khẩu phải chứa ít nhất một ký tự số`,
                'passwordComplexity.symbol': `Mật khẩu phải chứa ít nhất một ký tự đặc biệt`,
            }),           
            gender: Joi.boolean()
                .required().messages({
                    'boolean.base': `Giới tính phải là kiểu true/false`,

                }),
            birthday:Joi.string().allow(null).allow('').messages({
               
            }),       

            password: Joi.string()
                .required().messages({
                    'string.empty': `Password không được bỏ trống`,

                }),
            repeat_password: Joi.string().allow(null).allow('').messages({
                
            }),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','vn'] } }).required().messages({
                'string.empty': `Email không được bỏ trống`,
                'string.email': `Email chưa đúng định dạng`,
            }),        

            position_id: Joi.string().required().messages({
                'string.empty': `Mã Chức Vụ không được bỏ trống`,
            }),
            region_id: Joi.string().required().messages({
                'string.empty': `Mã Khu Vực không được bỏ trống`,
            }),
            department_id: Joi.string().required().messages({
                'string.empty': `Mã Phòng Ban không được bỏ trống`,
            }),
            avatar: Joi.string().allow(null).allow('').messages({
              //
            }),
            ArrRoleID: Joi.string().allow(null).allow('').messages({
                //
              }),
        });
        const { error } = checkUser.validate(req.body, { abortEarly: false });
        if (error) {
            res.json({
                status: 422,
                error: error,
            });
        }
        else {
            next();
        }
    }
}
module.exports = middlewareValidate
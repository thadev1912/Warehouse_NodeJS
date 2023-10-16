//Region validate:
const Joi = require("joi");
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
            user_code: Joi.string().required().messages({
                'string.empty': `Id User không được bỏ trống`,
            }),
            username: Joi.string().min(6).required().messages({
                'string.empty': `Username không được bỏ trống`,
                'string.min': `Username ít nhất 6 ký tự`,
            }),
            fullname: Joi.string().min(8)
                .required().messages({
                    'string.empty': `Họ tên thông tin không được bỏ trống`,
                    'string.min': `Thông tin họ tên quá ngắn`,
                }),

            sex: Joi.string()
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
            phone: Joi.number().integer().min(10 ** 9).max(10 ** 10 - 1).required().messages({
                'number.base': `Số điện thoại không được bỏ trống hoặc chưa đúng định dạng`,
                'number.min': `Số điện thoại chưa đủ ký tự số`,
                'number.max': `Số điện thoại vượt qua 12 ký tự`,
                'number.unsafe': `Số điện thoại vượt quá số ký tự an toàn`,
                'number.empty': `Số điện thoại không được bỏ trống`,
            }),
            sex: Joi.boolean()
                .required().messages({
                    'boolean.base': `Giới tính phải là kiểu true/false`,

                }),
            address: Joi.string()
                .required().
                messages({
                    'string.empty': `Địa chỉ không được bỏ trống`,
                }),

            password: Joi.string()
                .required().messages({
                    'string.empty': `Password không được bỏ trống`,

                }),
            repeat_password: Joi.string().valid(Joi.ref('password')).required().messages({
                'any.only': `Password chưa trùng khớp`,
            }),


            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
                'string.empty': `Email không được bỏ trống`,
                'string.email': `Email chưa đúng định dạng`,
            }),
            role_id: Joi.string().required().messages({
                'string.empty': `Mã Role không được bỏ trống`,
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
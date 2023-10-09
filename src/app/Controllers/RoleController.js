
const Role = require('../models/role');
const {checkRole}=require('../../request/RoleRequest')
//Lấy danh sách Role
let listRole = async (req, res) => {
    try {
        let getData = await Role.find({});
        if (getData) {
            res.json({
                status: 200,
                messege: 'Lấy dữ liệu thành công!!!',
                data: getData,
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}
//Thêm mới Role
let create = async (req, res) => {
    try {
        const result = await checkRole.validate(req.body);
        if (result.error) {
            res.json({
                status: 422,
                messege: result.error.message,

            });

        }
        else
       {
            const getRegion = new Role(req.body);
            let getData = await getRegion.save();
            if (getData) {
                res.json({
                    status: 200,
                    messege: 'Đã thêm mới dữ liệu!!!',
                    data: getData,
                });
            }
            else {
                throw new Error('Error connecting Database on Server');
            }
       }
       
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports =
{
    listRole: listRole,
    create:create,  
}
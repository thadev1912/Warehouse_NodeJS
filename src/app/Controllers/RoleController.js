
const Role = require('../models/role');
const {checkRole}=require('../../request/RoleRequest')
let listRole = async (req, res) => {
    try {
        let getData = await Role.find({});
        if (getData) {
            res.json({
                status: 200,
                messege: 'Get Data Completed!!',
                data: getData,
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }

}
let create = async (req, res) => {
    try {
        const result = await checkRole.validate(req.body);
        if (result.error) {
            res.json({
                status: 422,
                message: result.error.message,

            });
         console.log(result);
        }
        else
       {
            const getRegion = new Role(req.body);
            let getData = await getRegion.save();
            if (getData) {
                res.json({
                    status: 200,
                    messege: 'Add new role comleted!!!',
                    data: getData,
                });
            }
            else {
                return res.json({
                    status:500,
                    success: false,                
                    message: 'Error connecting Database on Server'
                });
            }
       }
       
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}

module.exports =
{
    listRole: listRole,
    create:create,  
}
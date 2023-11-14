const RolePermission = require('../models/role_permission');
const UserRole = require('../models/user_role');
let storePermisionsGroup = async (req, res) => {
    try {
       //console.log('Route Name:', req.route.path);
       getArray=req.body.getArray;
       getrole_permission_name=req.body.role_permission_name
       console.log(getArray);
       const encodedPaths = JSON.stringify(getArray);
       console.log(encodedPaths);
       _rolePermission=new RolePermission({          
        role_permission_name:getrole_permission_name,
        role_permission_group:encodedPaths
       });
     isComplete=  await _rolePermission.save();
     if(isComplete)
     {
        res.json('lưu giá trị thành công!!!');
     }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
let storeUserRole=async(req,res)=>
{
   getUserId=req.body.userId;
   getArrayRolesId=req.body.arrayRolesId;
   ischeckStatus=true;
   for (let i = 0; i < getArrayRolesId.length; i++)
   {
    getUserRole=new UserRole({
      user_id:getUserId,
      role_permission_id:getArrayRolesId[i],
    });
    isComplete=await getUserRole.save();
    ischeckStatus= isComplete?true:false;
  
   }
     if (ischeckStatus) {
      res.json({
          status: 200,
          message: 'Update Data Completed!!',          
      });
  } else {
      throw new Error('Error connecting Database on Server');
  }

}
module.exports = {
  storePermisionsGroup : storePermisionsGroup , 
  storeUserRole:storeUserRole,
}
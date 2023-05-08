const db = require('../../../models/index');
const jwt = require("jsonwebtoken");
// The secret should be an unguessable long string (you can use a password generator for this!)
const list_user = async (req, res) => {
   let data = await db.User.findOne({
      where:{username:'sieuga'},
      include: [{
         model: db.Role 
         
        },
        ],
       
       
   });

    let role_user=data.Roles;
    role_user.map((item,index)=>{
      console.log('User có những quyền:',item.role_name);

    })
   //console.log('Role user là',data.Roles);
   return res.json({
      data: data.Roles,
     
   })
}
const xulydangnhap = async (req, res) => {
   let user = await req.body.username;
   let pass = await req.body.password;
   
   let data = await db.User.findOne({
      where: {
         username: user, password: pass,
      },
      attributes: ['id','username','email','diachi','sdt'], 
   })
   if (data) {    
      let AccessToken= jwt.sign({ id:data.id,user:data.username}, 
         process.env.JWT_SECRET,
         {expiresIn:"2h"}  //thời gian token tồn tại
         );  //JWT_SECRET là bí mật
       //console.log('token nhân được là',AccessToken);  
      
      res.status(200).json({ data,AccessToken});
   }
   else {
      res.status(404).json("Lỗi kết nối");
   }

}
const xulydangxuat =async(req,res)=>{
   console.log('đã nhận được yêu cầu đăng xuất')
 await  res.status(200).json('Đăng xuất thành công');
}

module.exports = {
   xulydangnhap: xulydangnhap,
   xulydangxuat:xulydangxuat,
   list_user: list_user,
}
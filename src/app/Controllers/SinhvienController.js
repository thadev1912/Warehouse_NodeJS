const db = require('../../../models/index');
const Sequelize = require('sequelize');
var {validationResult} = require('express-validator'); 
let index = async (req, res) => {

  try {
    let sinhvien = await db.Sinhvien.findAll({
      include: [{
        model: db.Lophoc,      
        
       }]
    });
    console.table(sinhvien);
    res.render('sinhvien/sinhvien', { sinhvien });
  }
  catch (e) {
    console.log(e);
  }
}
let create = async (req, res) => {
  
  let ls_lop=await db.Lophoc.findAll();
  //console.log(ls_lop);
  return res.render('sinhvien/them_sinhvien',{ls_lop});
}
let search=async(req,res)=>{
  const Op = Sequelize.Op;
    let info=req.body.txt_timkiem;
  let sinhvien=  await db.Sinhvien.findAll({
      where:{
        ten_sv: {  [Op.like]: '%' + info + '%' },
      }
    });
    if(sinhvien)
    {
      res.render('sinhvien/sinhvien', { sinhvien });
    }
    //console.log(info);
}
let store = async (req, res) => {

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });     
      return;
    }
    let sinhvien = db.Sinhvien.create({
      ma_sv: req.body.txt_ma_sv,
      ten_sv: req.body.txt_ten_sv,
      ngaysinh_sv: req.body.txt_ngaysinh_sv,
      gioitinh_sv: req.body.txt_gioitinh_sv,
      diachi_sv: req.body.txt_diachi_sv,
      sdt_sv: req.body.txt_sdt_sv,
      ma_lop: req.body.txt_malop,
    });
    if (sinhvien) {
      console.log('Thêm Dữ Liệu Thành Công!!!');
      req.toastr.success('Successfully logged in.', "You're in!");
      return res.redirect('/sinhvien');
    }
    else {
      console.log('Lỗi Kết Nối!!!');
    }
  }
  catch (e) {
    console.log(e);
  }
};
let edit = async (req, res) => {
  //console.log(req.params.id);
  
  try {
    let ls_lop=await db.Lophoc.findAll();
    let id = req.params.id;
    let sinhvien = await db.Sinhvien.findOne({
      where: { id: id },
      raw: true,
    });
    if (sinhvien) {
      console.log('Lấy dữ liệu thành công!!!');
      console.log(sinhvien);
      return res.render('sinhvien/sua_sinhvien', { sinhvien,ls_lop });
    }
    else {
      console.log('Lỗi kết nối dữ liệu!!!');
    }
  }
  catch (e) {
    console.log(e);
  }

};
let update = async (req, res) => {
  //console.log(req.body.txt_id);
  let id = req.body.txt_id;
  try {
    // check id trong CSDL
    let exits_id = await db.Sinhvien.findOne({
      where: { id: id },
    })
    if (exits_id) {
      let sinhvien = await db.Sinhvien.update({
        ma_sv: req.body.txt_ma_sv,
        ten_sv: req.body.txt_ten_sv,
        ngaysinh_sv: req.body.txt_ngaysinh_sv,
        gioitinh_sv: req.body.txt_gioitinh_sv,
        diachi_sv: req.body.txt_diachi_sv,
        sdt_sv: req.body.txt_sdt_sv,
        ma_lop: req.body.txt_malop,
      },
        {
          where: { id: id },
        });

      if (sinhvien) {
        console.log('Cập nhật dữ liệu thành công!!');
        return res.redirect('/sinhvien');
      }
      else {
        console.log('Vui lòng kiểm tra kết nối!!');
      }
    }
    else {
      console.log('ID này không tồn tại trong hệ thống!!!');
    }
  }
  catch (e) {
    console.log(e);
  }
}
let destroy = async (req, res) => {
  let id = req.params.id;
  try {
    let sinhvien = await db.Sinhvien.destroy({
      where: { id: id },
      raw: true,
    });
    if (sinhvien) {
      req.toastr.success('Successfully logged in.', "You're in!");
      console.log('Xóa dữ liệu thành công!!!');
      res.redirect('/sinhvien');
    }
    else {
      console.log('Lỗi kết nối!!!');
    }
  }
  catch (e) {
    console.log(e);
  }
}
//Api
let get_api=async(req,res) => {
  try{
  let data =await db.Sinhvien.findAll();
  if(data)
  {
    console.log(data);
     res.json({
      data:data,
      status:200,
      messege:'Lấy dữ liệu thành công!!!'
     });
  }
  else
  {
    console.log(data);
     res.send({
      data:null,
      status:404,
      messege:'Không lấy được dữ liệu!!!'
     });
  }
  }
  catch(e)
  {
  console.log(e);
  }
}
let store_api = async(req,res) =>{
  console.log('đã kết nối lưu');
  console.log(req.body);
  let sinhvien = await db.Sinhvien.create({
    ma_sv:  req.body.ma_sv,
    ten_sv:  req.body.ten_sv,
    ngaysinh_sv:  req.body.ngaysinh_sv,
    gioitinh_sv:  req.body.gioitinh_sv,
    diachi_sv:  req.body.diachi_sv,
    sdt_sv:  req.body.sdt_sv,
    ma_lop:  req.body.ma_lop,
  }  
  ); 
  if(sinhvien)
  {
   
     res.json({   
      status:200,
      messege:'Thêm dữ liệu thành công!!!'
     });
  } 
}
let update_api =async(req,res) =>
{
  console.log('đã kết nối cập nhật');
   console.log(req.body);
   let id=req.body.id;
  let sinhvien = await db.Sinhvien.update({
    ma_sv:  req.body.ma_sv,
    ten_sv:  req.body.ten_sv,
    ngaysinh_sv:  req.body.ngaysinh_sv,
    gioitinh_sv:  req.body.gioitinh_sv,
    diachi_sv:  req.body.diachi_sv,
    sdt_sv:  req.body.sdt_sv,
    ma_lop:  req.body.ma_lop,
  },
  {
    where:{id:id}
  }
  ); 
  if(sinhvien)
  {
   
     res.json({   
      status:200,
      messege:'Cập nhật dữ liệu thành công!!!'
     });
  } 
}
let delete_api =async (req,res) =>{
  console.log('đã kết nối xóa');
  //console.log(req.body.id);
  let id=req.body.id;
  let sinhvien = await db.Sinhvien.destroy({
    where: { id: id },   
  });
  if(sinhvien)
  {
   
     res.json({   
      status:200,
      messege:'Xóa dữ liệu thành công!!!'
     });
  } 
}
module.exports =
{
  index: index,
  create: create,
  store: store,
  edit: edit,
  update: update,
  destroy: destroy,
  search: search,
  get_api:get_api,
  store_api:store_api,
  update_api:update_api,
  delete_api:delete_api,
};

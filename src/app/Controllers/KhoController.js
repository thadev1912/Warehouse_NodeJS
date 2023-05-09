const db = require('../../../models/index');
var {validationResult} = require('express-validator'); 
let index = async (req, res) => {
  try {
    let kho = await db.Kho.findAll();  
    if(kho) 
    {      
      res.status(200).json({
        success:true,
        data: kho,   
        messege: 'Lấy dữ liệu thành công!!!'
      }); 
      
      } 
      else
      {
        throw new Error('Error connecting Database on Server');
      }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({  success:false,error:err.message});
  }
 
    // console.log(kho);
     
   

}
let store = async (req, res) => {
  try
  {
    
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });     
      return;
    }
    let kho = await db.Kho.create({
      ma_kho: req.body.ma_kho,
      ten_kho: req.body.ten_kho,
      dia_chi: req.body.dia_chi,
      sdt: req.body.sdt,
      ghi_chu: req.body.ghi_chu,
    }
    );
    if (kho) {
  
      res.json({
        status: 200,
        messege: 'Thêm dữ liệu thành công!!!'
      });
    }
    else
      {
        throw new Error('Error connecting Database on Server');
      }
  }
  catch(err)
  {
    console.log(err);
    res.status(500).json({  success:false,error:err.message});
  }

 
}
module.exports =
{
  index: index,
  store: store,

};

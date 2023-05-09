const db = require('../../../models/index');
var { validationResult } = require('express-validator');
const Sequelize = require('sequelize')
let index = async (req, res) => {
  try {
    let kho = await db.Kho.findAll();
    if (kho) {
      res.status(200).json({
        success: true,
        data: kho,
        messege: 'Lấy dữ liệu thành công!!!'
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
let store = async (req, res) => {
  try {

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
    else {
      throw new Error('Error connecting Database on Server');
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
let edit = async (req, res) => {
  try {
    //let ls_lop=await db.Kho.findAll();
    let id = req.params.id;
    let kho = await db.Kho.findOne({
      where: { id: id },
      raw: true,
    });
    if (kho) {
      console.log('Lấy dữ liệu thành công!!!');
      console.log(kho);
      return res.status(200).json({
        success: true, data: kho,
      });
    }
    else {
      throw new Error('Id not exsits on Server');
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
let update = async (req, res) => {
  try {

    //console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    let id = req.params.id;
    console.log(id);
    exitsId = await db.Kho.findOne({
      where: { id: id },
    });
    if (exitsId) {
      let kho = await db.Kho.update({
        ma_kho: req.body.ma_kho,
        ten_kho: req.body.ten_kho,
        dia_chi: req.body.dia_chi,
        sdt: req.body.sdt,
        ghi_chu: req.body.ghi_chu,
      }, { where: { id: id } });
      if (kho) {
        res.json({
          status: 200,
          messege: 'Cập nhật dữ liệu thành công!!!'
        });
      }
      else { throw new Error('Error Connect Server'); }
    }
    else {
      throw new Error('Id not exsits on Server');
    }

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
let destroy = async (req, res) => {
  try {
    let id = req.params.id;
    exitsId = await db.Kho.findOne({
      where: { id: id },
    });
    if (exitsId) {
      let kho = await db.Kho.destroy({
        where: { id: id },
      });
      res.status(200).json({
        success: true, message: 'Delete Data Completed'
      });
    }

    else {
      throw new Error('Id not exsits on Server');
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
let search = async (req, res) => {
  try {
    let txtSearch = req.body.txt_search;
    console.log(txtSearch);
    const Op = Sequelize.Op;
    let searchKho = await db.Kho.findAll({
      where: {
        ten_kho: { [Op.like]: '%' + txtSearch + '%' },
      }
    });
    if (searchKho.length === 0) {
      res.status(404).json({ message: 'Không tìm thấy dữ liệu nào cả!!!' });
    }
    else {
      res.status(200).json({ success: true, data: searchKho, message: 'Search data comepleted' });
    }

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
module.exports =
{
  index: index,
  store: store,
  edit: edit,
  update: update,
  destroy: destroy,
  search: search,
};

const {check} = require('express-validator');
let validate_nhacungcap = () => {
    return [ 
      check('ma_nhacc', 'Mã nhà cung cấp không được để trống').not().isEmpty(),      
      check('ten_nhacc', 'Tên nhà cung cấp không được để trống').not().isEmpty(),     
      check('diachi_nhacc', 'Đơn vị tính không được để trống').not().isEmpty(),     
      
      
      
    ]; 
  }
  module.exports = {
    validate_nhacungcap:validate_nhacungcap,
};
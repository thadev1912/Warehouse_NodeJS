const {check} = require('express-validator');
let validate_kho = () => {
    return [ 
      check('ma_kho', 'Mã kho không được để trống').not().isEmpty(),      
      check('ten_kho', 'Tên kho không được để trống').not().isEmpty(),     
      check('dia_chi', 'Địa chỉ không được để trống').not().isEmpty(),     
      check('sdt', 'Số điện thoại không được để trống').not().isEmpty(),     
      check('ghi_chu', 'Ghi chú không được để trống').not().isEmpty(),     
      
    ]; 
  }
  module.exports = {
    validate_kho:validate_kho,
};
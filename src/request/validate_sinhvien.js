const {check} = require('express-validator');
let validate_sinhvien = () => {
    return [ 
      check('txt_ma_sv', 'Mã Sinh Viên không được để trống').not().isEmpty(),      
      check('txt_ten_sv', 'Tên Sinh viên không được để trống').not().isEmpty(),
      
    ]; 
  }
  module.exports = {
    validate_sinhvien:validate_sinhvien,
};
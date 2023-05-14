const {check} = require('express-validator');
let validate_vattu = () => {
    return [ 
      check('ma_vattu', 'Mã vật tư không được để trống').not().isEmpty(),      
      check('ten_vattu', 'Tên vật tư không được để trống').not().isEmpty(),     
      check('donvitinh', 'Đơn vị tính không được để trống').not().isEmpty(),     
      check('soluong', 'Số lượng không được để trống').not().isEmpty(),     
      
      
    ]; 
  }
  module.exports = {
    validate_vattu:validate_vattu,
};
const {check} = require('express-validator');
let validate_donvitinh = () => {
    return [ 
      check('donvitinh', 'Đơn vị tính không được để trống').not().isEmpty(),      
   
      
      
    ]; 
  }
  module.exports = {
    validate_donvitinh:validate_donvitinh,
};
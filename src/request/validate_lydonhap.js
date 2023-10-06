const {check} = require('express-validator');
let validate_lydonhap = () => {
    return [ 
      check('lydo', 'Lý do không được để trống').not().isEmpty(),      
     
      
      
    ]; 
  }
  module.exports = {
    validate_lydonhap:validate_lydonhap,
};
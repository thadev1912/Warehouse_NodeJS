const {check} = require('express-validator');
let validate_invoice_nhap = () => {
    return [ 
      check('invoice_number', 'Vui lòng nhập mã số phiếu nhập').not().isEmpty(),      
       
      
      
    ]; 
  }
  module.exports = {
    validate_invoice_nhap:validate_invoice_nhap,
};
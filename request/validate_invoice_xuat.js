const {check} = require('express-validator');
let validate_invoice_xuat = () => {
    return [ 
      check('invoice_number', 'Vui lòng nhập mã số phiếu xuất').not().isEmpty(),      
       
      
      
    ]; 
  }
  module.exports = {
    validate_invoice_xuat:validate_invoice_xuat,
};
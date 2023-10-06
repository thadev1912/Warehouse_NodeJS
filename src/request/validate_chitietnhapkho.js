const {check} = require('express-validator');
let validate_chitietnhapkho = () => {
    return [ 
      check('id_phieunhap', 'Mã phiếu nhập không được để trống').not().isEmpty(),  
      check('id_vattu', 'Mã id vật tư không được để trống').not().isEmpty(),          
      check('sl_vattu', 'Số lượng vật tư không được để trống').not().isEmpty(),   
      check('id_kho', 'Mã kho không được để trống').not().isEmpty(),      
      check('id_lydo', 'Mã lý do không được để trống').not().isEmpty(),    
     
         
      
      
      
    ]; 
  }
  module.exports = {
    validate_chitietnhapkho:validate_chitietnhapkho,
};
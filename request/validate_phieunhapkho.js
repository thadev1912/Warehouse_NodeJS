const {check} = require('express-validator');
let validate_phieunhapkho = () => {
    return [ 
      check('ma_phieu', 'Mã phiếu cung cấp không được để trống').not().isEmpty(),  
      check('id_nhanvien', 'Mã nhân viên cung cấp không được để trống').not().isEmpty(),          
      check('id_kho', 'Mã kho cung cấp không được để trống').not().isEmpty(),   
      check('id_nhacc', 'Mã nhà cung cấp không được để trống').not().isEmpty(),      
      check('id_lydo', 'Mã lý do không được để trống').not().isEmpty(),    
      check('ngaynhap', 'Ngày nhập không được để trống').not().isEmpty(),   
         
      
      
      
    ]; 
  }
  module.exports = {
    validate_phieunhapkho:validate_phieunhapkho,
};
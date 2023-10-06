const {check} = require('express-validator');
let validate_phieuxuatkho = () => {
    return [ 
      check('ma_phieu', 'Mã phiếu cung cấp không được để trống').not().isEmpty(),  
      check('id_thukho', 'Mã thủ kho cung cấp không được để trống').not().isEmpty(),          
      check('id_nhanvien', 'Mã nhân viên cung cấp không được để trống').not().isEmpty(),        
      check('id_lydo', 'Mã lý do không được để trống').not().isEmpty(),    
      check('ngayxuat', 'Ngày xuất không được để trống').not().isEmpty(),   
         
      
      
      
    ]; 
  }
  module.exports = {
    validate_phieuxuatkho:validate_phieuxuatkho,
};
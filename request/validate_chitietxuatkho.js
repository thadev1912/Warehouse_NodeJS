const {check} = require('express-validator');
let validate_chitietxuatkho = () => {
    return [ 
      check('id_phieuxuat', 'Mã phiếu xuất không được để trống').not().isEmpty(),  
      check('id_vattu', 'Mã id vật tư không được để trống').not().isEmpty(),          
      check('sl_vattu', 'Số lượng vật tư không được để trống').not().isEmpty(),       
         
      
      
      
    ]; 
  }
  module.exports = {
    validate_chitietxuatkho:validate_chitietxuatkho,
};
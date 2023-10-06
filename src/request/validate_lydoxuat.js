const {check} = require('express-validator');
let validate_lydoxuat = () => {
    return [ 
      check('lydo', 'Lý do không được để trống').not().isEmpty(),      
     
      
      
    ]; 
  }
  module.exports = {
    validate_lydoxuat:validate_lydoxuat,
};
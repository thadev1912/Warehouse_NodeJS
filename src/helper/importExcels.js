
var multer = require('multer');  
 
var storage = multer.diskStorage({  
    destination: function(req, file, cb) {       
          cb(null, './public/excels/');
       },
    filename:function(req,file,cb){  
       cb(null,file.filename + "-" +Date.now() + "-"+ file.originalname);      
    }  
});     
const upload = multer({
    storage: storage,
  
   });
  
  module.exports = upload
  
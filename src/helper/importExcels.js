
var multer = require('multer');  
 
var storage = multer.diskStorage({  
    destination: function(req, file, cb) {
        // cb(null, './uploads/');
          cb(null, './public/excels/');
       },
    filename:function(req,file,cb){  
       cb(null,file.filename + "-" +Date.now() + "-"+ file.originalname);  
     //cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }  
});     
const upload = multer({
    storage: storage, 
  
   });
  
  module.exports = upload
  
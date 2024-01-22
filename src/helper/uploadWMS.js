// uploadMiddleware.js

const multer = require('multer');
var excelToJson = require('convert-excel-to-json');
const uploadDir = './public/uploads/IMS';
const storage = multer.diskStorage({
  destination: function(req, file, cb) {   
     cb(null, './public/uploads/WMS');  },
  filename: function(req, file, cb) {
    // var currentDate = new Date().toISOString().split('T')[0];
    // var getFileName = currentDate + file.originalname;
    cb(null, file.originalname);   
  }
});
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'|| file.mimetype === 'image/webp'|| file.mimetype === 'image/jpg'){
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const uploadWMS = multer({
  storage: storage,  
  fileFilter: fileFilter
});
module.exports = uploadWMS

// uploadMiddleware.js

const multer = require('multer');
var excelToJson = require('convert-excel-to-json');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {   
     cb(null, './public/uploads/IMS');
  },
  filename: function(req, file, cb) {
    var currentDate = new Date().toISOString().split('T')[0];
    var getFileName = currentDate + file.originalname;
    cb(null, getFileName);
    //cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
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
const uploadIMS = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

module.exports = uploadIMS

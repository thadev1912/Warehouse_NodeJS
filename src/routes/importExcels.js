var express = require('express');
var router = express.Router();
const importexcel = require('../app/Controllers/ImportExcelController');
const upload=require('../helper/importExcels');
router.post('/importSutdent',upload.single('excel'),importexcel.importStudent);
module.exports = router;
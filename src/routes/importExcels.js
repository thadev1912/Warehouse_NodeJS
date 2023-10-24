var express = require('express');
var router = express.Router();
const importexcel = require('../app/Controllers/ImportExcels');
//const validate=require('../request/UserRequest');
const upload=require('../helper/upload');
router.get('/',importexcel.importExecl);

module.exports = router;
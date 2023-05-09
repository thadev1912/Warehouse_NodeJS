var express = require('express');
var router = express.Router();
const kho = require('../app/Controllers/KhoController');
const validate=require('../../request/validate_kho');
router.get('/',kho.index);
router.post('/store',validate.validate_kho(),kho.store);
module.exports = router;
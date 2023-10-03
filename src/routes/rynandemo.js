var express = require('express');
var router = express.Router();
const rynandemo = require('../app/Controllers/RynandemoController');
// const validate=require('../../request/validate_chitietnhapkho');
router.get('/',rynandemo.index);
router.get('/create',rynandemo.create);
module.exports = router;

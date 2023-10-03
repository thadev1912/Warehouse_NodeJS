var express = require('express');
var router = express.Router();
const region = require('../app/Controllers/RegionController');
// const validate=require('../../request/validate_chitietnhapkho');
router.get('/',region.index);
router.post('/create',region.create);
router.delete('/delete/:id',region.destroy);
module.exports = router;

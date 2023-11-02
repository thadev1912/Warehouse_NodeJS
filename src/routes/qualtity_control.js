var express = require('express');
var router = express.Router();
const qualitycontrol = require('../app/Controllers/QualityControlController');
router.get('/',qualitycontrol.index);
router.get('/detailProduct',qualitycontrol.detailProduct);
router.put('/checkProductQC/:id',qualitycontrol.checkProductQC);
router.get('/detailSemiProduct',qualitycontrol.detailSemiProduct);
router.put('/checkSemiProductQC/:id',qualitycontrol.checkSemiProductQC);
module.exports = router;
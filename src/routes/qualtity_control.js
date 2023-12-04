var express = require('express');
var router = express.Router();
const qualitycontrol = require('../app/Controllers/QualityControlController');
router.get('/listQualityControl',qualitycontrol.index);
router.get('/detailQualityControl/:id',qualitycontrol.detailQC);
router.put('/orderQualityControl',qualitycontrol.orderQC);
module.exports = router;

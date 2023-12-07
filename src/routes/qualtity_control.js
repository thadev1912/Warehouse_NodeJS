var express = require('express');
var router = express.Router();
const qualitycontrol = require('../app/Controllers/QualityControlController');
const Auth =require('../app/middlewares/authenticatetion');
const Permision =require('../app/middlewares/authorization');
router.get('/listQualityControl',Auth.checkAuth,Permision.checkPermision,qualitycontrol.index);
router.get('/detailQualityControl/:id',Auth.checkAuth,Permision.checkPermision,qualitycontrol.detailQC);
router.put('/orderQualityControl',Auth.checkAuth,Permision.checkPermision,qualitycontrol.orderQC);
module.exports = router;

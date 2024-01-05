var express = require('express');
var router = express.Router();
const region = require('../app/Controllers/RegionController');
const Auth =require('../app/middlewares/authenticatetion');
const Permision =require('../app/middlewares/authorization');
const validate=require('../request/RegionRequest');
router.get('/listRegion',Auth.checkAuth,Permision.checkPermision,region.index);
router.get('/listRegion1',Auth.checkAuth,region.index1);  //dự phòng phân trang
router.post('/storeRegion',Auth.checkAuth,Permision.checkPermision,validate.checkValidate,region.create);
router.get('/editRegion',Auth.checkAuth,Permision.checkPermision,region.edit);
router.put('/updateRegion/:id',Auth.checkAuth,Permision.checkPermision,validate.checkValidate,region.update);
router.delete('/deleteRegion',Auth.checkAuth,Permision.checkPermision,region.destroy);
module.exports = router;

var express = require('express');
var router = express.Router();
const upload=require('../../helper/uploadWMS');
const detail_manager_wms = require('../../app/Controllers/WMS/DetailManagerWMSController');
const Auth =require('../../app/middlewares/authenticatetion');
const Permision =require('../../app/middlewares/authorization');
const validate=require('../../request/WMS/DetailManagerWMSRequest');
router.get('/listDetailManagerWMS/:id',Auth.checkAuth,Permision.checkPermision,detail_manager_wms.index);
router.post('/storeDetailManagerWMS',Auth.checkAuth,Permision.checkPermision,upload.array('images'),detail_manager_wms.store);
router.put('/updateDetailManagerWMS/:id',Auth.checkAuth,Permision.checkPermision,upload.array('images'),detail_manager_wms.update);
router.get('/showSeriSimbyIdManagerWMS/:id',Auth.checkAuth,Permision.checkPermision,detail_manager_wms.showSeriSimbyId);
router.delete('/deleteDetailManagerWMS/:id',Auth.checkAuth,Permision.checkPermision,detail_manager_wms.destroy);
module.exports = router;
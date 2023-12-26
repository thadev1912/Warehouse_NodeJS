var express = require('express');
var router = express.Router();
const detail_manager_ims = require('../../app/Controllers/IMS/DetailManagerIMSController');
const upload=require('../../helper/uploadIMS');
const validate=require('../../request/IMS/DetailManagerIMSRequest');
const Auth =require('../../app/middlewares/authenticatetion');
const Permision =require('../../app/middlewares/authorization');
router.get('/listDetailManagerIMS/:id',Auth.checkAuth,Permision.checkPermision,detail_manager_ims.index);
router.get('/listDetailManagerIMS1/:id',Auth.checkAuth,detail_manager_ims.index1);
router.post('/storeDetailManagerIMS',Auth.checkAuth,Permision.checkPermision,upload.array('images'),detail_manager_ims.store);
router.put('/updateDetailManagerIMS/:id',Auth.checkAuth,Permision.checkPermision,upload.array('images'),detail_manager_ims.update);
router.delete('/deleteDetailManagerIMS/:id',Auth.checkAuth,Permision.checkPermision,detail_manager_ims.destroy);
module.exports = router;

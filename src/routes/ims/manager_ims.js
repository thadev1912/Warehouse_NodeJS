var express = require('express');
var router = express.Router();
const manager_ims = require('../../app/Controllers/IMS/ManagerIMSController');
const validate=require('../../request/IMS/ManagerIMSRequest');
const Auth =require('../../app/middlewares/authenticatetion');
const Permision =require('../../app/middlewares/authorization');
router.get('/listManagerIMS',Auth.checkAuth,Permision.checkPermision,manager_ims.index);
router.get('/testlistManagerIMS',Auth.checkAuth,manager_ims.testlist);
router.get('/testlist1ManagerIMS',Auth.checkAuth,manager_ims.testlist1);
router.post('/storeManagerIMS',Auth.checkAuth,Permision.checkPermision,validate.checkValidate,manager_ims.store);
router.put('/updateManagerIMS/:id',Auth.checkAuth,Permision.checkPermision,validate.checkValidate,manager_ims.update);
router.delete('/deleteManagerIMS/:id',Auth.checkAuth,Permision.checkPermision,manager_ims.destroy);
//router.get('/testPaginate',manager_ims.testPaginate);
router.get('/testPaginatewithFind',Auth.checkAuth,manager_ims.testPaginatewithFind);
router.get('/testPaginatewithAggragate',Auth.checkAuth,Permision.checkPermision,manager_ims.testPaginatewithAggragate);

module.exports = router;

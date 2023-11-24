var express = require('express');
var router = express.Router();
const manager_ims = require('../../app/Controllers/IMS/ManagerIMSController');
//const validate=require('../request/PostionRequest');
router.get('/listManagerIMS',manager_ims.index);
router.post('/storeManagerIMS',manager_ims.store);
router.put('/updateManagerIMS/:id',manager_ims.update);
router.delete('/deleteManagerIMS/:id',manager_ims.destroy);
//router.get('/testPaginate',manager_ims.testPaginate);
router.get('/testPaginatewithAggragate',manager_ims.testPaginatewithAggragate);
router.get('/testPaginatewithFind',manager_ims.testPaginatewithFind);
module.exports = router;

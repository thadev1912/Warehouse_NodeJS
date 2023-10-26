var express = require('express');
var router = express.Router();
const productorder = require('../app/Controllers/ProductOrderController');
const Permision =require('../app/middlewares/permission')
const validate=require('../request/ProductOrderRequest');
router.get('/',productorder.index);
router.post('/create',productorder.store);
router.get('/info',productorder.infotoCreate);
router.get('/edit/:id',productorder.edit);
router.put('/update/:id',productorder.update);
router.get('/showdetail/:id',productorder.showdetail);
router.put('/approve/:id',Permision.checkPermision,productorder.approve);
router.put('/reapprove/:id',Permision.checkPermision,productorder.reapprove);
router.put('/cancel/:id',Permision.checkPermision,productorder.cancel);
router.delete('/delete',productorder.destroy);
module.exports = router;

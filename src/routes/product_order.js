var express = require('express');
var router = express.Router();
const productorder = require('../app/Controllers/ProductOrderController');
const Permision =require('../app/middlewares/permission')
//const validate=require('../request/DepartmentRequest');
router.get('/',productorder.index);
router.post('/create',productorder.store);
router.get('/info',productorder.infotoCreate);
router.put('/update/:id',productorder.update);
router.put('/approve/:id',Permision.checkPermision,productorder.approve);
router.delete('/delete',productorder.destroy);
module.exports = router;

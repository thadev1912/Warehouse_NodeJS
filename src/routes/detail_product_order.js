var express = require('express');
var router = express.Router();
const detailproductorder = require('../app/Controllers/DetailProductOrderController');
const validate=require('../request/DepartmentRequest');
router.get('/DetailProductOrder',detailproductorder.index);
router.post('/storeDetailProductOrder',detailproductorder.store);
router.put('/updateDetailProductOrder/:id',detailproductorder.update);
 router.delete('/deleteDetailProductOrder',detailproductorder.destroy);
module.exports = router;

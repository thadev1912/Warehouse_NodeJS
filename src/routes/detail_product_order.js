var express = require('express');
var router = express.Router();
const detailproductorder = require('../app/Controllers/DetailProductOrderController');
//const validate=require('../request/DepartmentRequest');
router.get('/',detailproductorder.index);
router.post('/store',detailproductorder.store);
router.put('/update/:id',detailproductorder.update);
 router.delete('/delete',detailproductorder.destroy);
module.exports = router;

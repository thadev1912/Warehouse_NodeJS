var express = require('express');
var router = express.Router();
const productType = require('../app/Controllers/ProductTypeController');
const validate=require('../request/ProductTypeRequest');
router.get('/',productType.index);
router.post('/create',validate.checkValidate,productType.create);
router.get('/edit',productType.edit);
router.put('/update/:id',validate.checkValidate,productType.update);
router.delete('/delete',productType.destroy);
module.exports = router;

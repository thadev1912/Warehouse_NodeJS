var express = require('express');
var router = express.Router();
const kho = require('../app/Controllers/KhoController');
const validate=require('../../request/validate_kho');
router.get('/',kho.index);
router.post('/store',validate.validate_kho(),kho.store);
router.get('/edit/:id',kho.edit);
router.put('/update/:id',validate.validate_kho(),kho.update);
router.delete('/delete/:id',kho.destroy);
router.post('/search',kho.search);
module.exports = router;
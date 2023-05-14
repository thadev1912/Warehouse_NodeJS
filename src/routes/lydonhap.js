var express = require('express');
var router = express.Router();
const lydonhap = require('../app/Controllers/LydoNhapController');
const validate=require('../../request/validate_lydonhap');
router.get('/',lydonhap.index);
router.post('/store',validate.validate_lydonhap(),lydonhap.store);
router.get('/edit/:id',lydonhap.edit);
router.put('/update/:id',validate.validate_lydonhap(),lydonhap.update);
router.delete('/delete/:id',lydonhap.destroy);
router.post('/search',lydonhap.search);
module.exports = router;
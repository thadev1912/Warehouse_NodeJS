var express = require('express');
var router = express.Router();
const sinhvien = require('../app/Controllers/SinhvienController'); 
const validate=require('../../request/validate_sinhvien');

/* GET users listing. */
router.get('/', sinhvien.index);
router.get('/them', sinhvien.create);
router.post('/luu',validate.validate_sinhvien(), sinhvien.store);
router.get('/sua/:id', sinhvien.edit);
router.post('/capnhat', sinhvien.update);
router.get('/xoa/:id', sinhvien.destroy);
router.post('/timkiem', sinhvien.search);
router.get('/get_api',sinhvien.get_api);
router.post('/store_api',sinhvien.store_api);
router.put('/update_api',sinhvien.update_api);
router.delete('/delete_api',sinhvien.delete_api);
module.exports = router;

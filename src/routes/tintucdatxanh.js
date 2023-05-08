var express = require('express');
var router = express.Router();
const tintucdatxanh = require('../app/Controllers/TintucdatxanhController');
/* GET users listing. */
router.get('/', tintucdatxanh.tintucdatxanh);
router.get('/themtintucdatxanh', tintucdatxanh.them_tintucdatxanh);
router.post('/luutintucdatxanh', tintucdatxanh.luu_tintucdatxanh);
router.get('/suatintucdatxanh/:id', tintucdatxanh.sua_tintucdatxanh);
router.post('/capnhattintucdatxanh', tintucdatxanh.capnhat_tintucdatxanh);
router.get('/xoatintucdatxanh/:id', tintucdatxanh.xoa_tintucdatxanh);
module.exports = router;

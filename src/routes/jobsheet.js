var express = require('express');
var router = express.Router();
const jobsheet = require('../app/Controllers/JobsheetController');
const validate=require('../request/PostionRequest');
router.get('/',jobsheet.index);
router.get('/create',jobsheet.infotoCreate);
router.post('/store',jobsheet.store);
router.get('/edit/:id',jobsheet.edit);
router.put('/update/:id',jobsheet.update);
router.put('/cancel/:id',jobsheet.cancel);
router.put('/OrderExportMaterials/:id',jobsheet.OrderExportMaterials);
router.put('/ExportMaterials/:id',jobsheet.ExportMaterials);
router.put('/OrderWedling/:id',jobsheet.OrderWedling);
router.put('/OrderAssemble/:id',jobsheet.OrderAssemble);
router.put('/OrderProductQC',jobsheet.OrderProductQC);
router.put('/OrderSemiProductQC',jobsheet.OrderSemiProductQC);
module.exports = router;

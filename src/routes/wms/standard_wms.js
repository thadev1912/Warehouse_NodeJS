var express = require('express');
var router = express.Router();
const standard = require('../../app/Controllers/WMS/StandardController');
router.get('/listStandard',standard.index);
router.post('/storeStandard',standard.create);
router.get('/editStandard',standard.edit);
router.put('/updateStandard/:id',standard.update);
router.delete('/deleteStandard/:id',standard.destroy);
module.exports = router;

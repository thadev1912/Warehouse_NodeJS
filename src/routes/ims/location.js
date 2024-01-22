var express = require('express');
var router = express.Router();
const location = require('../../app/Controllers/IMS/LocationController');
router.get('/listLocation',location.index);
router.post('/storeLocation',location.create);
router.get('/editLocation',location.edit);
router.put('/updateLocation/:id',location.update);
router.delete('/deleteLocation',location.destroy);
module.exports = router;

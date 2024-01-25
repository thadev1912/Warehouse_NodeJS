var express = require('express');
var router = express.Router();
const notification = require('../app/Controllers/NotificationController');
router.get('/listNotification',notification.index);
router.post('/storeNotification',notification.create);
router.get('/getType',notification.getType);
module.exports = router;



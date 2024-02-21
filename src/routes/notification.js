var express = require('express');
var router = express.Router();
const notification = require('../app/Controllers/NotificationController');
const Auth =require('../app/middlewares/authenticatetion');
const Permision =require('../app/middlewares/authorization');
router.get('/showByIdNotification/:id',Auth.checkAuth,notification.showNotification);  //hiện thị thông báo 
router.put('/updateByIdNotification/:id',Auth.checkAuth,notification.updateNotification); //cập nhật trạng đã xem
router.get('/getType',notification.getType); //cập nhật trạng đã xem
module.exports = router;



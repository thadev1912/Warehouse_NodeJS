var express = require('express');
var router = express.Router();
const user = require('../app/Controllers/UserController');
router.get('/list_user', user.list_user);
router.post('/xulydangnhap', user.xulydangnhap);
router.get('/xulydangxuat', user.xulydangxuat);
module.exports = router;
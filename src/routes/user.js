var express = require('express');
var router = express.Router();
const user = require('../app/Controllers/UserController');
router.get('/listUser',user.listUser);
router.post('/register',user.register);
router.get('/login',user.checkLogin);
router.get('/logout',user.checkLogout);
module.exports = router;
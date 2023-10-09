var express = require('express');
var router = express.Router();
const role = require('../app/Controllers/RoleController');
router.get('/listRole',role.listRole);
router.post('/create',role.create);
;
module.exports = router;
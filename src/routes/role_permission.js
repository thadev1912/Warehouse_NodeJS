var express = require('express');
var router = express.Router();
const Permission = require('../app/Controllers/RolePermissionController');
router.post('/storePermisionsGroup',Permission.storePermisionsGroup );
router.post('/storeUserRole',Permission.storeUserRole );
module.exports = router;

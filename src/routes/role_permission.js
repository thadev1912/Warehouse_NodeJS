var express = require('express');
var router = express.Router();
const Auth =require('../app/middlewares/authenticatetion');
const Authorization =require('../app/middlewares/authorization');
const Permission = require('../app/Controllers/RolePermissionController');
router.get('/listPermissionGroup/:id',Permission.listPermissionGroup);
router.get('/InfotoStore',Permission.InfotoStore );
router.post('/storePermisionsGroup',Permission.storePermisionsGroup );
router.get('/InfotoUpdatePermisionsGroup/:id',Permission.InfotoUpdatePermisionsGroup);
router.put('/updatePermisionsGroup/:id',Permission.updatePermisionsGroup);
router.get('/listUserRole',Permission.listUserRole);
router.post('/storeUserRole',Permission.storeUserRole);
router.get('/ShowDetailRoleByUser/:id',Permission.ShowDetailRoleByUser);
router.get('/infotoUpdateUserRole/:id',Permission.infotoUpdateUserRole);
module.exports = router;


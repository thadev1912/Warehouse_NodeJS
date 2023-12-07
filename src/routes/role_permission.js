var express = require('express');
var router = express.Router();
const Auth =require('../app/middlewares/authenticatetion');
const Permision =require('../app/middlewares/authorization');
const Permission = require('../app/Controllers/RolePermissionController');
router.get('/listPermissionGroup/:id',Auth.checkAuth,Permision.checkPermision,Permission.listPermissionGroup);
router.get('/InfotoStore',Permission.InfotoStore );
router.post('/storePermisionsGroup',Auth.checkAuth,Permision.checkPermision,Permission.storePermisionsGroup );
router.get('/InfotoUpdatePermisionsGroup/:id',Auth.checkAuth,Permision.checkPermision,Permission.InfotoUpdatePermisionsGroup);
router.put('/updatePermisionsGroup/:id',Auth.checkAuth,Permision.checkPermision,Permission.updatePermisionsGroup);
router.delete('/DeletePermissionGroup/:id',Auth.checkAuth,Permision.checkPermision,Permission.DeletePermissionGroup);
router.get('/listUserRole',Auth.checkAuth,Permision.checkPermision,Permission.listUserRole);
router.post('/storeUserRole',Auth.checkAuth,Permision.checkPermision,Permission.storeUserRole);
router.get('/ShowDetailRoleByUser/:id',Auth.checkAuth,Permision.checkPermision,Permission.ShowDetailRoleByUser);
router.get('/infotoUpdateUserRole/:id',Auth.checkAuth,Permision.checkPermision,Permission.infotoUpdateUserRole);
router.post('/UpdateUserRole/:id',Auth.checkAuth,Permision.checkPermision,Permission.UpdateUserRole);
router.delete('/DeleteUserRole/:id',Auth.checkAuth,Permision.checkPermision,Permission.DeleteUserRole);
module.exports = router;



var express = require('express');
var router = express.Router();
const router_name = require('../app/Controllers/AllRouteNameController');
const validate=require('../request/PostionRequest');
const Auth =require('../app/middlewares/authenticatetion');
const Permision =require('../app/middlewares/authorization')
router.get('/listAllRouterName',Auth.checkAuth,Permision.checkPermision,router_name.index);
router.post('/storeAllRouterName',Auth.checkAuth,Permision.checkPermision,router_name.create);
router.get('/editAllRouterName/:id',Auth.checkAuth,Permision.checkPermision,router_name.edit);
router.put('/updateAllRouterName/:id',Auth.checkAuth,Permision.checkPermision,router_name.update);
router.delete('/deleteAllRouterName/:id',Auth.checkAuth,Permision.checkPermision,router_name.destroy);
module.exports = router;
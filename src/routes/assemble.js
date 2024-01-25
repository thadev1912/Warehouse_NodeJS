var express = require('express');
var router = express.Router();
const Assemble = require('../app/Controllers/AssembleController');
const validate=require('../request/AssembleRequest');
const Auth =require('../app/middlewares/authenticatetion');
const Permision =require('../app/middlewares/authorization');
router.get('/listAssemble/:id',Auth.checkAuth,Permision.checkPermision,Assemble.AssembleList);
router.get('/listByIdAssemble/:id',Auth.checkAuth,Permision.checkPermision,Assemble.AssembleListById);
router.get('/showDetailAssemble/:id',Auth.checkAuth,Permision.checkPermision,Assemble.showDetailAssemble);
router.put('/approveOrderAssemble/:id',Auth.checkAuth,Permision.checkPermision,Assemble.approveAssembleOrder);
router.get('/infotoUpdateAssemble/:id',Auth.checkAuth,Permision.checkPermision,Assemble.infotoUpdate);
router.put('/updateOrderAssemble/:id',Auth.checkAuth,Permision.checkPermision,Assemble.updateAssembleOrder);
// router.put('/checkWelding/:id',Welding.checkWelding);
module.exports = router;

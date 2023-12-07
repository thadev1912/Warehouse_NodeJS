var express = require('express');
var router = express.Router();
const Welding = require('../app/Controllers/WeldingController');
//const validate=require('../request/CategoriesSimRequest');
const Auth =require('../app/middlewares/authenticatetion');
const Permision =require('../app/middlewares/authorization');
router.get('/listWelding',Auth.checkAuth,Permision.checkPermision,Welding.WeldingList);
router.get('/showDetailWelding/:id',Auth.checkAuth,Permision.checkPermision,Welding.showDetailWelding);
router.put('/approveOrderWelding/:id',Auth.checkAuth,Permision.checkPermision,Welding.approveWeldingOrder);
//router.get('/infotoUpdate/:id',Welding.infotoUpdate);
router.put('/updateOrderWelding/:id',Auth.checkAuth,Permision.checkPermision,Welding.updateWeldingOrder);
router.put('/checkWelding/:id',Auth.checkAuth,Permision.checkPermision,Welding.checkWelding);  //no use
module.exports = router;

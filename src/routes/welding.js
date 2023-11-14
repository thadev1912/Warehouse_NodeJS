var express = require('express');
var router = express.Router();
const Welding = require('../app/Controllers/WeldingController');
//const validate=require('../request/CategoriesSimRequest');
router.get('/listWelding',Welding.WeldingList);
router.get('/showDetailWelding/:id',Welding.showDetailWelding);
router.put('/approveOrderWelding/:id',Welding.approveWeldingOrder);
//router.get('/infotoUpdate/:id',Welding.infotoUpdate);
router.put('/updateOrderWelding/:id',Welding.updateWeldingOrder);
router.put('/checkWelding/:id',Welding.checkWelding);  //no use
module.exports = router;

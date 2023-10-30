var express = require('express');
var router = express.Router();
const Assemble = require('../app/Controllers/AssembleController');
//const validate=require('../request/CategoriesSimRequest');
router.get('/AssembleList',Assemble.AssembleList);
router.get('/showDetailAssemble/:id',Assemble.showDetailAssemble);
router.put('/approveAssembleOrder/:id',Assemble.approveAssembleOrder);
// router.get('/infotoUpdate/:id',Welding.infotoUpdate);
// router.put('/updateWeldingOrder/:id',Welding.updateWeldingOrder);
// router.put('/checkWelding/:id',Welding.checkWelding);
module.exports = router;

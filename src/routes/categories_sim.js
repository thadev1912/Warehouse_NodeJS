var express = require('express');
var router = express.Router();
const CategoriesSim = require('../app/Controllers/CategoriesSimController');
const validate=require('../request/CategoriesSimRequest');
router.get('/listCategoriesSim',CategoriesSim.index);
router.post('/storeCategoriesSim',validate.checkValidate,CategoriesSim.create);
router.get('/editCategoriesSim',CategoriesSim.edit);
router.put('/updateCategoriesSim/:id',validate.checkValidate,CategoriesSim.update);
router.delete('/deleteCategoriesSim',CategoriesSim.destroy);
router.get('/updateStatusSim',CategoriesSim.updateStatusSim);
module.exports = router;

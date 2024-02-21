var express = require('express');
var router = express.Router();
const CategoriesSim = require('../app/Controllers/CategoriesSimController');
const validate=require('../request/CategoriesSimRequest');
const Auth =require('../app/middlewares/authenticatetion');
const Permision =require('../app/middlewares/authorization')
router.get('/listCategoriesSim',Auth.checkAuth,Permision.checkPermision,CategoriesSim.index);
router.get('/listEsimCategoriesSim',Auth.checkAuth,CategoriesSim.indexEsim);
router.get('/listSimCategoriesSim',Auth.checkAuth,CategoriesSim.indexSim);
router.post('/storeCategoriesSim',Auth.checkAuth,Permision.checkPermision,validate.checkValidate,CategoriesSim.create);
router.get('/editCategoriesSim',Auth.checkAuth,Permision.checkPermision,CategoriesSim.edit);
router.put('/updateCategoriesSim/:id',Auth.checkAuth,Permision.checkPermision,validate.checkValidate,CategoriesSim.update);
router.delete('/deleteCategoriesSim',Auth.checkAuth,Permision.checkPermision,CategoriesSim.destroy);
//router.get('/updateStatusSim',Auth.checkAuth,Permision.checkPermision,CategoriesSim.updateStatusSim);
module.exports = router;

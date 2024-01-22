var express = require('express');
var router = express.Router();
const user = require('../app/Controllers/UserController');
const validate=require('../request/UserRequest');
const upload=require('../helper/upload');
const Auth =require('../app/middlewares/authenticatetion');
const Permision =require('../app/middlewares/authorization');
router.get('/listUser',Auth.checkAuth,Permision.checkPermision,user.listUser);
router.get('/listRoleUser',Auth.checkAuth,Permision.checkPermision,user.listRoleUser);
router.post('/registerUser',upload.single('avatar'),validate.checkValidate,user.register);
router.post('/loginUser',user.checkLogin);
router.get('/logoutUser',Auth.checkAuth,Permision.checkPermision,user.checkLogout);
router.get('/infomationUser',Auth.checkAuth,Permision.checkPermision,user.Infomation);
router.put('/updateUser',Auth.checkAuth,Permision.checkPermision,upload.single('avatar'),user.updateUser);
router.delete('/deleteUser',Auth.checkAuth,Permision.checkPermision,user.destroyUser);
router.put('/changePasswordUser/:id',Auth.checkAuth,Permision.checkPermision,user.changePassword);
router.put('/changeAvatar/:id',Auth.checkAuth,upload.single('avatar'),user.changeAvatar);
router.get('/changeLanguage',user.changeLanguage);
router.post('/sendMailUser',user.sendMail); //no permission
router.post('/resetPasswordUser/:id',user.resetPassword); //no permission
router.get('/setConfigCryptJson',user.setConfigCryptJson); 
module.exports = router;
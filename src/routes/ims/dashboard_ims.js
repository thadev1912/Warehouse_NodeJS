var express = require('express');
var router = express.Router();
const dashboard_ims = require('../../app/Controllers/IMS/DashboardIMSController');
const Auth =require('../../app/middlewares/authenticatetion');
const Permision =require('../../app/middlewares/authorization');
//const validate=require('../request/PostionRequest');
router.get('/LocationReportIMS',Auth.checkAuth,Permision.checkPermision,dashboard_ims.LocationReportIMS);
router.get('/YearReportIMS',Auth.checkAuth,Permision.checkPermision,dashboard_ims.YearReportIMS);
module.exports = router;

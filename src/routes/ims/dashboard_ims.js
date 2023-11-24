var express = require('express');
var router = express.Router();
const dashboard_ims = require('../../app/Controllers/IMS/DashboardIMSController');
//const validate=require('../request/PostionRequest');
router.get('/LocationReportIMS',dashboard_ims.LocationReportIMS);
router.get('/YearReportIMS',dashboard_ims.YearReportIMS);
module.exports = router;

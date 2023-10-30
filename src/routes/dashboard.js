var express = require('express');
var router = express.Router();
const Dashboard = require('../app/Controllers/DashboardController');
//const validate=require('../request/DepartmentRequest');
router.get('/header-report',Dashboard.HeaderReport);
module.exports = router;

var express = require('express');
var router = express.Router();
const Dashboard = require('../app/Controllers/DashboardController');
//const validate=require('../request/DepartmentRequest');
router.get('/header-report',Dashboard.HeaderReport);
router.get('/bar-chart-report',Dashboard.BarChartReport);
router.get('/pie-chart-report',Dashboard.PieChartReport);
router.get('/performance-report',Dashboard.PerformanceReport);
module.exports = router;

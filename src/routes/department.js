var express = require('express');
var router = express.Router();
const department = require('../app/Controllers/DeparmentController');
router.get('/',department.index);
router.post('/create',department.create);
router.get('/edit',department.edit);
router.put('/update/:id',department.update);
router.delete('/delete',department.destroy);
module.exports = router;

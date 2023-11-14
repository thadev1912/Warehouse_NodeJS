var express = require('express');
var router = express.Router();
const position = require('../app/Controllers/PositionController');
const validate=require('../request/PostionRequest');
router.get('/listPosition',position.index);
router.post('/storePosition',validate.checkValidate,position.create);
router.get('/editPosition',position.edit);
router.put('/updatePosition/:id',position.update);
router.delete('/deletePosition',position.destroy);
module.exports = router;

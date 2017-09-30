var express = require('express');
var router = express.Router();
var storageController = require('../controllers/storagecontroller.js');

router.post('/downloads/:roomid/:username', storageController.download);

module.exports = router;

const express = require('express');
const router = express.Router();
const API = require('../controllers/FRCMatchGambling');

router.get('/status', API.status);
router.get('/getBalance', API.getBalance);
router.get('/setuptemplate', API.setuptemplate);

module.exports = router;
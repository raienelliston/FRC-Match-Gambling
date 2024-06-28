const express = require('express');
const router = express.Router();
const API = require('../controllers/FRCMatchGambling');

router.get('/frcMatchGambling', API.getFrcMatchGambling);

module.exports = router;
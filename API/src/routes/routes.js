const express = require('express');
const router = express.Router();
const API = require('../controllers/FRCMatchGambling');

router.get('/status', API.status);

module.exports = router;
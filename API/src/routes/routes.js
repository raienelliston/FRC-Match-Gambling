const express = require('express');
const router = express.Router();
const API = require('../controllers/FRCMatchGambling');

router.get('/status', API.status);
router.get('/balance', API.getBalance);
router.get('/bet', API.placeBet);
router.get('/matches', API.getEventMatches);
router.get('/matchdata', API.getMatchData);
router.get('/teamdata', API.getTeamData);
// router.get('/setuptemplate', API.setuptemplate);

module.exports = router;
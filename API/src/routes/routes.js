const express = require('express');
const router = express.Router();
const API = require('../controllers/FRCMatchGambling');

router.get('/status', API.status);
router.post('/bet', API.placeBet);
router.get('/matches', API.getEventMatches);
router.get('/matchdata', API.getMatchData);
router.post('/matchbetinfo', API.getMatchBetInfo);
router.post('/betresult', API.getBetResult);
router.get('/teamdata', API.getTeamData);
router.get('/leaderboard', API.getLeaderboard);
router.post('/accounts/create', API.createAccount);
router.post('/accounts/login', API.login);
router.post('/accounts/balance', API.getBalance);
router.post('/accounts/bethistory', API.getBetHistory);
// router.get('/setuptemplate', API.setuptemplate);

module.exports = router;
const  express = require('express');
const app = express();
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

auth = process.env.TBA_AUTH_KEY;

async function status() {
    const response = await axios.get('https://www.thebluealliance.com/api/v3/status', {
        headers: {
        'X-TBA-Auth-Key': auth
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error;
    });
    return response;
}

async function getEventData({eventKey}) {
    console.log(auth);
    const response = await axios.get(`https://www.thebluealliance.com/api/v3/event/${eventKey}/simple`, {
        headers: {
        'X-TBA-Auth-Key': auth
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error;
    });
    return response;
}

async function getEventMatches({eventKey}) {
    const response = await axios.get(`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`, {
        headers: {
        'X-TBA-Auth-Key': auth
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error;
    });
    return response;
}

async function getMatchData({matchKey}) {
    const response = await axios.get(`https://www.thebluealliance.com/api/v3/match/${matchKey}/simple`, {
        headers: {
        'X-TBA-Auth-Key': auth
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error;
    });
    return response;
}

async function getEventTeams({eventKey}) {
    const response = await axios.get(`https://www.thebluealliance.com/api/v3/event/${eventKey}/teams/simple`, {
        headers: {
        'X-TBA-Auth-Key': auth
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error;
    });
    return response;
}

module.exports = {
    status,
    getEventData,
    getEventMatches,
    getMatchData,
    getEventTeams
}
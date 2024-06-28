const  express = require('express');
const app = express();
const router = express.Router();
const axios = require('axios');


async function getEventData(auth, {eventKey}) {
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

module.exports = {
    getEventData
}
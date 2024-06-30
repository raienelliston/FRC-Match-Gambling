const axios = require('axios');

async function getMatchData({matchKey}) {
    const response = await axios.get(`https://api.statbotics.io/v3/match/${matchKey}`, {
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error;
    });
    return response;
}

module.exports = {
    getMatchData
}
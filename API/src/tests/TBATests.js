//  node ./src/tests/TBATests
const TBA = require('../APIs/TBAApi');
require('dotenv').config();

async function main() {
    const eventKey = '2020ilch';
    const eventData = await TBA.getEventData({eventKey});
    console.log(eventData);
    const eventMatches = await TBA.getEventMatches({eventKey});
    console.log(eventMatches);
    const eventTeams = await TBA.getEventTeams({eventKey});
    console.log(eventTeams);
    const status = await TBA.status();
    console.log(status);
}

main();
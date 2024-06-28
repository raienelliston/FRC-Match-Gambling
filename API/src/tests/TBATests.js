const TBA = require('../APIs/TBAApi');
require('dotenv').config();

const auth = process.env.TBA_AUTH_KEY;

async function main() {
    const eventKey = '2020ilch';
    const eventData = await TBA.getEventData(auth, {eventKey});
    console.log(eventData);
}

main();
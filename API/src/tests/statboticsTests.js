const statbotics = require('../APIs/statboticsAPI');

async function main() {
    const matchKey = '2024wabon_qm1';
    const matchData = await statbotics.getMatchData({matchKey});
    console.log(matchData);
}

main();
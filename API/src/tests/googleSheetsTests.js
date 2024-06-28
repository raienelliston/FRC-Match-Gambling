const googleSheets = require('../APIs/googleSheetsAPI');
require('dotenv').config();

const spreadsheetId = '1aWICfWZeuWS2pt_rL0ghrLDN75VqYjqK91IGZ4L9raY'
const sheetName = 'Sheet1'
const auth = googleSheets.getAuthToken();
function main() {
    googleSheets.appendSpreadSheetValues({
        spreadsheetId, 
        sheetName, 
        values: [['test', 'test', 'test']]
    }).then((res) => {
        console.log(res);
    });

    googleSheets.updateSpreadSheetValues({
        spreadsheetId,
        sheetName,
        values: [['test', 'test', 'test']],
        cell: 'A7'
    }).then((res) => {
        console.log(res);
    });
}

main();
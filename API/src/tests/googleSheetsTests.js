const googleSheets = require('../APIs/googleSheetsAPI');
require('dotenv').config();

const spreadsheetId = '1aWICfWZeuWS2pt_rL0ghrLDN75VqYjqK91IGZ4L9raY'
const sheetName = 'Sheet2'
const auth = googleSheets.getAuthToken();

const template = [
    {
        sheetName: 'Sheet1',
        values: [
            ['test', 'test', 'test'],
            ['test', 'test', 'test'],
            ['test', 'test', 'test']
        ]
    },
    {
        sheetName: 'Sheet2',
        values: [
            ['test', 'test', 'test'],
            ['test', 'test', 'test'],
            ['test', 'test', 'test']
        ]
    }, 
    {
        sheetName: 'Sheet3',
        values: [
            ['test', 'test', 'test'],
            ['test', 'test', 'test'],
            ['test', 'test', 'test']
        ]
    }
]

function main() {
    googleSheets.createSpreadSheetTemplate({
        spreadsheetId: spreadsheetId,
        values: template
    }).then((res) => {
        console.log(res);
    });
    // googleSheets.getSpreadSheet({
    //     spreadsheetId: spreadsheetId
    // }).then((res) => {
    //     console.log(res.data.sheets);
    // })
}

function createTemplate() {
    googleSheets.createSpreadSheetTemplate({
        sheetName: sheetName,
        values: [['test', 'test', 'test']]
    }).then((res) => {
        console.log(res);
    });
}

main();
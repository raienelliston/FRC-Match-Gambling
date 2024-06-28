const { google } = require('googleapis');
const { get } = require('../routes/routes');
const { GoogleAuth } = google.auth;
const sheets = google.sheets('v4');

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

async function getAuthToken() {
  const auth = new GoogleAuth({
    scopes: SCOPES
  });
  return auth;
}

async function getAuthToken() {
  const auth = new GoogleAuth({
    scopes: SCOPES
  });
  return auth
}

async function getSpreadSheet({ spreadsheetId }) {
  const auth = await getAuthToken();
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
    key: 'AIzaSyBSK1wy2XRqyaGlKk_KTsWpKWahH0xLYdw'
  });
  return res;
}

async function createSheet({ spreadsheetId, title }) {
  const auth = await getAuthToken();
  const res = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    auth,
    resource: {
      requests: [
        {
          addSheet: {
            properties: {
              title
            }
          }
        }
      ]
    }
  });
  return res;
}


async function getSpreadSheet({ spreadsheetId }) {
  const auth = await getAuthToken();
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
    key: 'AIzaSyBSK1wy2XRqyaGlKk_KTsWpKWahH0xLYdw'
  });
  return res;
}

async function getSpreadSheetValues({ spreadsheetId, sheetName }) {
  const auth = await getAuthToken();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName,
    key: 'AIzaSyBSK1wy2XRqyaGlKk_KTsWpKWahH0xLYdw'
  });
  return res;
}

async function appendSpreadSheetValues({ spreadsheetId, sheetName, values }) {
  const auth = await getAuthToken();
  const service = google.sheets({ version: 'v4', auth });

  const res = await service.spreadsheets.values.append({
    spreadsheetId,
    range: sheetName,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values
    }
  }).then ((response) => {
    console.log(response);
  }).catch((err) => {
    console.log(err);
  });
  return res;
}

async function updateSpreadSheetValues({ spreadsheetId, sheetName, values, cell='A1' }) {
  const auth = await getAuthToken();
  const service = google.sheets({ version: 'v4', auth });

  const res = await service.spreadsheets.values.update({
    spreadsheetId,
    range: sheetName + '!' + cell,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values
    }
  }).then ((response) => {
    console.log(response);
  }).catch((err) => {
    console.log(err);
  });
  return res;
}

async function createSpreadSheetTemplate( {spreadsheetId=null, sheetName, values} ) {
  if (spreadsheetId == null) {
    const auth = await getAuthToken();
    const service = google.sheets({ version: 'v4', auth });
    const res = await service.spreadsheets.create({
      resource: {
        properties: {
          title: sheetName
        },
        sheets: [
          {
            properties: {
              title: sheetName,
              gridProperties: {
                rowCount: 100,
                columnCount: 26
              }
            }
          }
        ]
      }
    }).then((response) => {
      console.log(response);
      spreadsheetId = response.data.spreadsheetId;
    }).catch((err) => {
      console.log(err);
    });
  }
  console.log(values);
  
  data = await getSpreadSheet({ spreadsheetId })
  // const sheetNames = await getSpreadSheet({ spreadsheetId }).data.sheets
  console.log(data.data.sheets);
  // const sheetNames = await getSpreadSheet({ spreadsheetId }).data.sheets.map(sheet => sheet.properties.title);

  values.forEach(element => {
    if (data.data.sheets.find((sheet) => sheet.properties.title == element.sheetName) == undefined) {
      createSheet({
        spreadsheetId: spreadsheetId,
        title: element.sheetName
      });
    }
    appendSpreadSheetValues({
      spreadsheetId: spreadsheetId,
      sheetName: element.sheetName,
      values: element.values
    });
  });
}

module.exports = {
  getAuthToken,
  createSheet,
  getSpreadSheet,
  getSpreadSheetValues,
  appendSpreadSheetValues,
  updateSpreadSheetValues,
  createSpreadSheetTemplate
}
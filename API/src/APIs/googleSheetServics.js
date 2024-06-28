const { google } = require('googleapis');
const { GoogleAuth } = google.auth;
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuthToken() {
  const auth = new GoogleAuth({
    scopes: SCOPES
  });
  const authToken = await auth.getClient();
  return authToken;
}

async function getSpreadSheet({spreadsheetId, auth}) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
    key: 'AIzaSyBSK1wy2XRqyaGlKk_KTsWpKWahH0xLYdw'
  });
  return res;
}

async function getSpreadSheetValues({spreadsheetId, auth, sheetName}) {

  console.log(sheetName)

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName,
    key: 'AIzaSyBSK1wy2XRqyaGlKk_KTsWpKWahH0xLYdw'
  });
  return res;
}

async function appendSpreadSheetValues({spreadsheetId, auth, sheetName, values}) {
  
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    auth,
    range: sheetName,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values
    }
  }).then((response) => {  }).catch((err) => { return(err); });

  // console.log(res);
  return res;
}


module.exports = {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues,
  appendSpreadSheetValues
}
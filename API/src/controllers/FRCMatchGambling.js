const express = require('express');
const app = express();
const googleSheetAPI = require('../APIs/googleSheetsAPI');
require('dotenv').config();

template = [
    {
        sheetName: 'UserData',
        values: [
            ['Username', 'Balance']
        ]
    },
    {
        sheetName: 'EventList',
        values: [
            ['EventName', 'EventID']
        ]
    },
    {
        sheetName: 'EventMatches',
        values: [
            ['EventID', 'MatchID']
        ]
    },
    {
        sheetName: 'MatchData',
        values: [
            ['MatchID', 'Expected Date', 'Expected Time', 'Winner']
        ]
    },
    {
        sheetName: 'Action History',
        values: [
            []
        ]
    }
]

const getUserData = new Promise((resolve, reject) => {
    googleSheetAPI.getSpreadSheetValues({
        spreadsheetId: process.env.SPREADSHEET_ID,
        sheetName: 'UserData'
    }).then(data => {
        resolve(data);
    });
});

//DEV ONLY, REMOVE IN PRODUCTION
exports.setupTemplate = async (req, res) => {
    googleSheetAPI.createSpreadSheetTemplate( {
        spreadsheetId: spreadsheetId,
        values: template
    })
}

exports.status = (req, res) => {
    res.status(200).send('API is working');
}

exports.getBalance = async (req, res) => {
    getUserData().then(data => {
        console.log(data);
        data.forEach(row => {
            if (row[0] == req.body.username) {
                res.status(200).send(row[1]);
            }
        });
        res.status(404).send('User not found')
    })  
}

exports.placeBet = async (req, res) => {
    res.status(200).send('API is working');
}

exports.updateBalance = async (req, res) => {
    res.status(200).send('API is working');
}

exports.getEventList = async (req, res) => {
    res.status(200).send('API is working');
}

exports.getEventMatches = async (req, res) => {
    res.status(200).send('API is working');
}

exports.getMatchData = async (req, res) => {
    res.status(200).send('API is working');
}

exports.getTeamData = async (req, res) => {
    res.status(200).send('API is working');
}


const express = require('express');
const app = express();
const googleSheetAPI = require('../APIs/googleSheetsAPI');
const TBA = require('../APIs/TBAApi');
const { google } = require('googleapis');
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
        sheetName: 'Bet History',
        values: [
            ['Username', 'MatchID', 'Bet Amount', 'Bet Team', 'Bet Status']
        ]
    }
]

const spreadsheetId = '1aWICfWZeuWS2pt_rL0ghrLDN75VqYjqK91IGZ4L9raY';
const eventKey = process.env.EVENT_KEY;

const getUserData = async () => {
    const data = await googleSheetAPI.getSpreadSheetValues({
        spreadsheetId: spreadsheetId,
        sheetName: 'UserData'
    });
    return data.data.values;
}

//DEV ONLY, REMOVE IN PRODUCTION
exports.setuptemplate = async (req, res) => {
    googleSheetAPI.createSpreadSheetTemplate( {
        spreadsheetId: spreadsheetId,
        values: template
    })
}

exports.status = (req, res) => {
    res.status(200).send('API is working');
}

exports.getBalance = async (req, res) => {
    let found = false;
    getUserData().then(data => {
        console.log(data);
        data.forEach(row => {
            console.log(row);
            if (row[0] == req.body.username) {
                res.status(200).send(row[1]);
                found = true;
            }
        });
        if (!found) {
            res.status(404).send('User not found');
        }
    })  
}

exports.placeBet = async (req, res) => {
    googleSheetAPI.appendSpreadSheetValues({
        spreadsheetId: spreadsheetId,
        sheetName: 'Bet History',
        values: [
            [req.body.username, req.body.matchID, req.body.betAmount, req.body.betTeam, 'Pending']
        ]
    }).then((response) => {
        res.status(200).send('Bet placed');
    }).catch((err) => {
        res.status(400).send('Error placing bet');
    });
}

exports.updateBalance = async (req, res) => {
    res.status(200).send('API is working');
}

exports.getEventMatches = async (req, res) => {
    console.log(eventKey)
    TBA.getEventMatches( {
        eventKey: eventKey
    }).then((response) => {
        const matchData = []
        for (const match of response) {
            matchData.push([match.key, match.predicted_time, match.actual_time, match.winning_alliance, match.alliances.red.team_keys, match.alliances.blue.team_keys]);
        }
        console.log(matchData);
        res.status(200).send(matchData);
    }).catch((err) => {
        res.status(400).send('Error getting event matches');
    })
}

exports.getMatchData = async (req, res) => {
    res.status(200).send('API is working');
}

exports.getTeamData = async (req, res) => {
    res.status(200).send('API is working');
}


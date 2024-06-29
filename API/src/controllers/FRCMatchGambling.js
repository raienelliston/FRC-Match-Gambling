const express = require('express');
const app = express();
const googleSheetAPI = require('../APIs/googleSheetsAPI');
require('dotenv').config();

exports.status = (req, res) => {
    res.status(200).send('API is working');
}

exports.getBalance = async (req, res) => {
    res.status(200).send('API is working');
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


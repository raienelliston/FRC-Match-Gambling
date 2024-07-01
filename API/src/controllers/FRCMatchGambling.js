const express = require('express');
const app = express();
const googleSheetAPI = require('../APIs/googleSheetsAPI');
const statbotics = require('../APIs/statboticsAPI');
const TBA = require('../APIs/TBAApi');
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const { stat } = require('fs');
require('dotenv').config();

template = [
    {
        sheetName: 'UserData',
        values: [
            ['UserID', 'Username', 'Password', 'Balance']
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

exports.updateBets = () => {
    console.log('Updating bets')

    const newBets = [];

    const userData = googleSheetAPI.getSpreadSheetValues({
        spreadsheetId: spreadsheetId,
        sheetName: 'UserData'
    }).then((response) => {
        const users = response.data.values;
        return users;
    });

    googleSheetAPI.getSpreadSheetValues({
        spreadsheetId: spreadsheetId,
        sheetName: 'Bet History'
    }).then((response) => {
        const bets = response.data.values;
        bets.forEach(bet => {
            if (bet[4] == 'Pending') {
                console.log("bet: " + bet[1])
                statbotics.getMatchData( {
                    matchKey: bet[1]
                }).then((response) => {
                    if (response.result.winner !== "blue" && response.result.winner !== "red") {
                        newBets.push(bet);
                    } else {
                        if (response.result.winner == bet[3]) {
                            userData.then((users) => {
                                users.forEach(user => {
                                    if (user[0] == bet[0]) {
                                        const newBalance = parseInt(user[3]) + parseInt(bet[2] * (1 / (bet[3] == "red" ? response.pred.red_win_prob : (1 - response.pred.red_win_prob))));
                                    }
                                });
                            });
                        }
                        newBets.push([bet[0], bet[1], bet[2], bet[3], 'Complete']);
                        console.log(newBets)
                    }
                })
            }
    });
    console.log(newBets)
    googleSheetAPI.updateSpreadSheetValues({
        spreadsheetId: spreadsheetId,
        sheetName: 'Bet History',
        range: 'A2:E',
        values: newBets
    }).then((response) => {
        console.log(response);
    })
});
                
                            

    // googleSheetAPI.getSpreadSheetValues({
    //     spreadsheetId: spreadsheetId,
    //     sheetName: 'Bet History'
    // }).then((response) => {
    //     const bets = response.data.values;
    //     console.log("Bets" + bets)
    //     bets.forEach(bet => {
    //         if (bet[4] == 'Pending') {
    //             TBA.getMatchData( {
    //                 matchKey: bet[1]
    //             }).then((response) => {
    //                 if (response.winning_alliance != null) {
    //                     if (response.winning_alliance == bet[3]) {
    //                         googleSheetAPI.getSpreadSheetValues({
    //                             spreadsheetId: spreadsheetId,
    //                             sheetName: 'UserData'
    //                         }).then((response) => {
    //                             const users = response.data.values;
    //                             users.forEach(user => {
    //                                 if (user[0] == bet[0]) {
    //                                     googleSheetAPI.updateSpreadSheetValues({
    //                                         spreadsheetId: spreadsheetId,
    //                                         sheetName: 'UserData',
    //                                         range: `B${users.indexOf(user) + 2}`,
    //                                         values: [[parseInt(user[1]) + parseInt(bet[2])]]
    //                                     });
    //                                 }
    //                             });
    //                         });
    //                     }
    //                     googleSheetAPI.updateSpreadSheetValues({
    //                         spreadsheetId: spreadsheetId,
    //                         sheetName: 'Bet History',
    //                         range: `E${bets.indexOf(bet) + 2}`,
    //                         values: [['Complete']]
    //                     });
    //                 }
    //             });
    //         }
    //     });
    // });
}

const getUserData = async () => {
    const data = await googleSheetAPI.getSpreadSheetValues({
        spreadsheetId: spreadsheetId,
        sheetName: 'UserData'
    });
    return data.data.values;
}

//DEV ONLY, REMOVE IN PRODUCTION
exports.checkSheet = async () => {
    if (await googleSheetAPI.getSpreadSheetValues({spreadsheetId: spreadsheetId, sheetName: 'UserData'})) {
        return;
    }
    googleSheetAPI.createSpreadSheetTemplate( {
        spreadsheetId: spreadsheetId,
        values: template
    })
}

exports.status = (req, res) => {
    res.status(200).send('API is working');
}

exports.getBalance = (req, res) => {
    updateBets();
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

exports.createAccount = async (req, res) => {
    const id = await uuidv4();

    googleSheetAPI.appendSpreadSheetValues({
        spreadsheetId: spreadsheetId,
        sheetName: 'UserData',
        values: [
            [id, req.body.username, req.body.password]
        ]
    }).then((response) => {
        console.log(response);
        console.log(id)
        res.status(200).send(JSON.stringify(id));
    }).catch((err) => {
        res.status(400).send('Error creating account');
    });
}

exports.login = async (req, res) => {
    let found = false;
    console.log(req.body)
    googleSheetAPI.getSpreadSheetValues({
        spreadsheetId: spreadsheetId,
        sheetName: 'UserData'
    }).then((response) => {
        const users = response.data.values;
        users.forEach(user => {
            if (user[1] == req.body.username && user[2] == req.body.password) {
                res.status(200).send(user[0]);
                found = true;
            }
        });
    }).catch((err) => {
        res.status(400).send('Error logging in');
    });
    if (!found) {
        res.status(404).send('User not found');
    }
}

exports.giveBalance = async (req, res) => {
    googleSheetAPI.getSpreadSheetValues({
        spreadsheetId: spreadsheetId,
        sheetName: 'UserData'
    }).then((response) => {
        const users = response.data.values;
        users.forEach(user => {
            if (user[0] == req.body.username) {
                googleSheetAPI.updateSpreadSheetValues({
                    spreadsheetId: spreadsheetId,
                    sheetName: 'UserData',
                    range: `B${users.indexOf(user) + 2}`,
                    values: [[parseInt(user[1]) + parseInt(req.body.amount)]]
                });
                res.status(200).send('Balance updated');
            }
        });
    }).catch((err) => {
        res.status(400).send('Error updating balance');
    });
}

exports.placeBet = async (req, res) => {
    try {
        const response = await googleSheetAPI.getSpreadSheetValues({
            spreadsheetId: spreadsheetId,
            sheetName: 'UserData'
        });

        const users = response.data.values;
        let userName = null;

        users.forEach(user => {
            if (user[0] == req.body.userId) {
                userName = user[1];
            }
        });

        if (!userName) {
            return res.status(400).send('User not found');
        }

        await googleSheetAPI.appendSpreadSheetValues({
            spreadsheetId: spreadsheetId,
            sheetName: 'Bet History',
            values: [
                [userName, req.body.matchID, req.body.betAmount, req.body.betTeam, 'Pending']
            ]
        });

        res.status(200).send('Bet placed');
    } catch (err) {
        console.error('Error placing bet:', err);
        res.status(400).send('Error placing bet');
    }
}

exports.getEventMatches = async (req, res) => {
    console.log(eventKey)
    TBA.getEventMatches( {
        eventKey: eventKey
    }).then((response) => {
        const matchData = []
        for (const match of response) {
            matchData.push({
                key: match.key, 
                predicted_time: match.predicted_time, 
                actual_time: match.actual_time, 
                winning_alliance: match.winning_alliance
        });
        }
        console.log(matchData);
        res.status(200).send(matchData);
    }).catch((err) => {
        res.status(400).send('Error getting event matches');
    })
}

exports.getMatchData = async (req, res) => {
    TBA.getMatchData( {
        matchKey: req.body.matchKey
    }).then((response) => {
        console.log(response)
        res.status(200).send(response);
    }).catch((err) => {
        res.status(400).send('Error getting match data');
    })
}

exports.getTeamData = async (req, res) => {
    TBA.getEventTeams( {
        eventKey: eventKey
    }).then((response) => {
        response.forEach(team => {
            if (team.key == req.body.teamKey) {
                res.status(200).send(team);
            }
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).send('Error getting team data');
    })
}

exports.getMatchBetInfo = async (req, res) => {
    console.log(req.body.matchKey)
    const matchData = await statbotics.getMatchData( {
        matchKey: req.body.matchKey
    }).then((response) => {
        console.log(response);
        res.status(200).send(response);
    }).catch((err) => {
        res.status(400).send('Error getting match data');
    });
}

exports.getBetResult = async (req, res) => {
    googleSheetAPI.getSpreadSheetValues({
        spreadsheetId: spreadsheetId,
        sheetName: 'Bet History'
    }).then((response) => {
        response.data.values.forEach(bet => {
            if (bet[1] == req.body.matchID) {
                res.status(200).send(bet[4]);
            }
        });
    }).catch((err) => {
        res.status(400).send('Error getting bet results');
    });
}

exports.getBetHistory = async (req, res) => {
    const response = await googleSheetAPI.getSpreadSheetValues({
        spreadsheetId: spreadsheetId,
        sheetName: 'UserData'
    });

    const users = response.data.values;
    let userName = null;

    users.forEach(user => {
        if (user[0] == req.body.userId) {
            userName = user[1];
        }
    });

    if (!userName) {
        return res.status(400).send('User not found');
    }

    googleSheetAPI.getSpreadSheetValues({
        spreadsheetId: spreadsheetId,
        sheetName: 'Bet History'
    }).then((response) => {
        const bets = response.data.values;
        let userBets = [];
        bets.forEach(bet => {
            if (bet[0] == user) {
                userBets.push(bet);
            }
        });
        res.status(200).send(userBets);
    }).catch((err) => {
        res.status(400).send('Error getting bet history');
    });
}

exports.getLeaderboard = async (req, res) => {
    googleSheetAPI.getSpreadSheetValues({
        spreadsheetId: spreadsheetId,
        sheetName: 'UserData'
    }).then((response) => {
        const users = response.data.values;
        let leaderboard = [];
        users.forEach(user => {
            leaderboard.push([user[1], user[3]]);
        });
        leaderboard.sort((a, b) => b[1] - a[1]);
        res.status(200).send(leaderboard);
    }).catch((err) => {
        res.status(400).send('Error getting leaderboard');
    });
}
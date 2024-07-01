import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';
import "./FRCMatchGambling.css";

const api = 'http://localhost:5000/api';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100$;
    width: 100%;
    background-color: #282c34;
`;

const HeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 10vh;
    width: 100%;
    background-color: #282c34;
    color: white;
`;

const TitleWrapper = styled.div`
    font-size: 2em;
`;

const AccountInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const BodyWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    padding: 10px;
    height: 90vh;
    width: 100%;
    overflow-y: scroll;
    box-sizing: border-box;
`;

const BodySplitWrapper = styled.div`
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 10px;
`;

const LoginWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #282c34;
    color: white;
`;

const TileWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #394a59;
    height: auto;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px;
    border-radius: 8px;
    color: white;
    box-sizing: border-box;
`;

const MatchScrollWrapper = styled.div`
    background-color: #394a59;
    border-radius: 8px;
    padding: 10px;
    overflow-y: auto;
    height: calc(100% - 40px);
    width: 100%;
    box-sizing: border-box;
`;

const MatchScrollItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
    margin: 5px;
    background-color: #282c34;
    border-radius: 8px;
    color: white;
`;

export function FRCMatchGambling() {
    const [balance, setBalance] = useState(0);
    const [matchList, setMatchList] = useState([]);
    const [bet, setBet] = useState({Amount: 1});
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [betData, setBetData] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [betHistory, setBetHistory] = useState([]);
    const betAmountInputRef = useRef(null);
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        if (matchList.length === 0) {
            update();
        }
    }, []);

    const Capitalize = (str) => {
        if (typeof str !== 'string') return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const updateMatchInfo = (key) => {
        const matchInfo = fetch(api + '/matchbetinfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matchKey: key })
        }).then(response => response.json()
        ).then(data => {
            if (data !== betData) {
                setBetData(data)
            }
        }).catch(err => console.error('Failed to fetch match:', err))
        return matchInfo;
    }

    const update = () => {
        fetch(api + '/matches', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json' 
            }
        }).then(response => response.json()
        ).then(data => {
            if (data !== matchList) {
                setMatchList(data)
            }
    }).catch(err => 
            console.error('Failed to fetch matches:', err)
        );

        fetch(api + '/accounts/balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json()
        ).then(data => {
            console.log(data)
            if (data !== balance) {
                setBalance(data)
            }
        }).catch(err =>
            console.error('Failed to fetch balance:', err)
        );

        fetch(api + '/leaderboard', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json' 
            }
        }).then(response => response.json()
        ).then(data => {
            console.log(data)
            if (data !== leaderboard) {
                setLeaderboard(data)
            }
        }).catch(err => 
            console.error('Failed to fetch leaderboard:', err)
        );

        fetch(api + '/accounts/bethistory', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ userId: userId })
        }).then(response => response.json()
        ).then(data => {
            console.log(data)
            if (data !== betHistory) {
                setBetHistory(data)
            }
        }).catch(err => 
            console.error('Failed to fetch bet history:', err)
        );
    };

    const Header = () => (
        <HeaderWrapper>
            <TitleWrapper>FRC Match Gambling</TitleWrapper>
            <AccountInfoWrapper>
                <div>User: {username}</div>
                <div>Balance: ${balance}</div>
            </AccountInfoWrapper>
        </HeaderWrapper>
    );

    const Matches = () => {
        const [ignoreFinished, setIgnoreFinished] = useState(false);
        const matchTable = matchList.map(match => {
            const key = match.key.slice(match.key.indexOf("_") + 1, match.key.length)
            const finished = match.actual_time ? true : false;
            console.log(match.actual_time);
            const time = finished ? new Date(match.actual_time * 1000).toLocaleString() : new Date(match.predicted_time * 1000).toLocaleString();
            
            if (ignoreFinished && finished) return null;

            function onClick(key) {
                updateMatchInfo(key);
            }
            
            return (
                <MatchScrollItem key={key} onClick={() => onClick(match.key)}>
                    <input type="checkbox" checked={finished} readOnly />
                    {key + " - "}
                    {time.slice(0, time.length - 6) + " " + time.slice(time.length - 2, time.length)}
                </MatchScrollItem>
            )
        })

        return (
            <TileWrapper>
                <h1>Matches</h1>
                <div>Ignore Finished Matches</div>
                <Switch onChange={() => setIgnoreFinished(!ignoreFinished)} checked={ignoreFinished} />
                <MatchScrollWrapper>
                    {matchTable}
                </MatchScrollWrapper>
            </TileWrapper>
        )
    }

    const BetPlacer = () => {

        useEffect(() => {
            if (bet.amount !== '' && betAmountInputRef.current !== null) {
                betAmountInputRef.current.focus(); // Focus back on input after bet amount changes
            }
        }, [bet.amount]);

        if (betData === false) {
            return (
                <TileWrapper>
                    <div>Click on a match on the left to place a bet on it and open match info</div>
                </TileWrapper>
            );
        }
        if (betData === false) {
            betData = updateMatchInfo();
        }

        if (betData.actual_time !== null) {
        // if (false) {

            const BetResult = () => {
                const [betresult, setBetResult] = useState(null);
                fetch(api + '/betresult', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ matchID: betData.key })
                    }).then(response => response.json()
                    ).then(data => {
                        setBetResult(data);
                    }).catch(err => console.error('Failed to get bet result:', err));
            }

            return (
                <TileWrapper>
                    <h1>Match has already happened</h1>
                    <div>Match: {betData.key.slice(betData.key.indexOf("_") + 1, betData.key.length)}</div>
                    <div>Red Alliance: {betData.alliances.red.team_keys[0] + ", " + betData.alliances.red.team_keys[1] + ", " + betData.alliances.red.team_keys[2]}</div>
                    <div>Blue Alliance: {betData.alliances.blue.team_keys[0] + ", " + betData.alliances.blue.team_keys[1] + ", " + betData.alliances.blue.team_keys[2]}</div>
                    <div>Winner: {Capitalize(betData.result.winner === "tie" ? betData.result.winner : betData.result.winner) + " Alliance"}</div>
                </TileWrapper>
            );
        }
        
        function placeBet() {
            console.log(bet.amount, bet.team, betData.key)
            fetch(api + '/bet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    matchID: betData.key,
                    betAmount: bet.amount,
                    betTeam: bet.team
                })
            }).then(response => response.json()
            ).then(data => {
                console.log(data);
                betData = false;
            }).catch(err => console.error('Failed to place bet:', err));
        }

        const AllianceSwitch = () => {
            if (bet.team === undefined) setBet({ ...bet, team: 'red' });
            console.log(bet.team);
            return (
                <div style={ {margin: "5px"} }>
                    Alliance Red
                    <Switch onChange={() => setBet({ ...bet, team: bet.team === 'red' ? 'blue' : 'red' })} 
                        checked={bet.team === 'blue'}
                        checkedIcon={false}
                        uncheckedIcon={false}
                        offColor="#ff0000"
                        onColor="#0000ff"
                    />
                    Alliance Blue
                </div>
            );
        }

        return (
            <TileWrapper>
                <h1>Match Bets</h1>
                <div>Match: {betData.key.slice(betData.key.indexOf("_") + 1, betData.key.length)}</div>
                <div>Red Alliance: {betData.alliances.red.team_keys[0] + ", " + betData.alliances.red.team_keys[1] + ", " + betData.alliances.red.team_keys[2]}</div>
                <div>Blue Alliance: {betData.alliances.blue.team_keys[0] + ", " + betData.alliances.blue.team_keys[1] + ", " + betData.alliances.blue.team_keys[2]}</div>
                <input ref={betAmountInputRef} type="number" placeholder="Bet Amount" value={bet.amount} onChange={e => setBet({ ...bet, amount: e.target.value })} />
                <AllianceSwitch />
                <div>Red Alliance Odds: {Number((betData.pred.red_win_prob).toFixed(2))}</div>
                <div>Blue Alliance Odds: {Number((1 - (betData.pred.red_win_prob)).toFixed(2))}</div>
                <div>Red Alliance Estimated Payout: {Number(bet.amount * (1 / betData.pred.red_win_prob).toFixed(2))}</div>
                <div>Blue Alliance Estimated Payout: {Number(bet.amount * (1 / (1 - (betData.pred.red_win_prob))).toFixed(2))}</div>
                <button onClick={placeBet}>
                    Place Bet for {bet.amount} on {Capitalize(bet.team)} Alliance
                </button>
            </TileWrapper>
        );
    };

    const MatchBets = () => {

        if (betData === false) {

            const BetHistory = () => {
                const betHistoryTable = betHistory.map(bet => {
                    return (
                        <MatchScrollItem key={bet[0]}>
                            <div>{bet[0]}</div>
                            <div>${bet[1]}</div>
                            <div>{Capitalize(bet[3]) + " Alliance"}</div>
                            <div>{bet[4]}</div>
                        </MatchScrollItem>
                    );
                });
            }

            return (
                <TileWrapper>
                    <div>Bet History</div>
                    <MatchScrollWrapper>
                        <BetHistory />
                    </MatchScrollWrapper>
                </TileWrapper>
            );
        }

        console.log(betData)

        if (betData.actual_time !== null) {
            return (
                <TileWrapper>
                    <h1>Match {betData.key.slice(betData.key.indexOf("_") + 1, betData.key.length)}</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <div style={ {color: "red"} }>Red Alliance</div>
                        <div style={ {color: "blue"} }>Blue Alliance</div>
                    </div>
                    <div>{betData.alliances.red.team_keys[0] + ", " + betData.alliances.red.team_keys[1] + ", " + betData.alliances.red.team_keys[2] + " | " + betData.alliances.blue.team_keys[0] + ", " + betData.alliances.blue.team_keys[1] + ", " + betData.alliances.blue.team_keys[2]}</div>
                    <div>{betData.pred.red_score + " Pred Scores " + betData.pred.blue_score}</div>
                    <div>{betData.result.red_score + " Actual Scores " + betData.result.blue_score}</div>
                    <div>{(betData.result.red_score - betData.result.red_no_foul) + " Fouls " + (betData.result.blue_score - betData.result.blue_no_foul)}</div>
                    <div>Winner: {Capitalize(betData.result.winner === "tie" ? betData.result.winner : betData.result.winner) + " Alliance"}</div>
                </TileWrapper>
            );
        }

        return (
            <TileWrapper>
                <h1>Match Info</h1>
                <div>Match: {betData.key.slice(betData.key.indexOf("_") + 1, betData.key.length)}</div>
                <div></div>
            </TileWrapper>
        );
    };

    const Leaderboard = () => {

        const leaderboardTable = leaderboard.map(user => {
            return (
                <MatchScrollItem key={user[0]}>
                    <div>{user[0]}</div>
                    <div>${user[1]}</div>
                </MatchScrollItem>
            );
        });

        return (
            <TileWrapper>
                <h1>Leaderboard</h1>
                <MatchScrollWrapper>
                    {leaderboardTable}
                </MatchScrollWrapper>
            </TileWrapper>
        );
    };

    const Login = () => {
        const [password, setPassword] = useState("");
        const [username, setUsername] = useState("");


        const handleCreateAccount = () => {
            fetch(api + '/accounts/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('user', data.id);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('balance', data.balance);
                    setUserId(data.id);
                    setUsername(data.username);
                    setBalance(data.balance);
                })
                .catch(err => console.error('Failed to create account:', err));
        };

        const handleLogin = () => {
            fetch(api + '/accounts/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('userId', JSON.stringify(data));
                    localStorage.setItem('username', JSON.stringify(data.username));
                    localStorage.setItem('balance', JSON.stringify(data.balance));
                    setUserId(data.id);
                    setUsername(data.username);
                    setBalance(data.balance);

                })
                .catch(err => console.error('Failed to log in:', err));
        };

        return (
            <LoginWrapper>
                <h1>Login</h1>
                <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleCreateAccount}>Create Account</button>
            </LoginWrapper>
        );
    };

    if (userId === "" && localStorage.getItem('userId')) {
        setUserId(localStorage.getItem('userId'));
        setUsername(localStorage.getItem('username'));
        setBalance(localStorage.getItem('balance'));
    }

    if (!userId) {
        return (
            <Wrapper>
                <Login />
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <Header />
            <BodyWrapper>
                <Matches />
                <BodySplitWrapper>
                    <BetPlacer />
                    <MatchBets />
                </BodySplitWrapper>
                <Leaderboard />
            </BodyWrapper>
        </Wrapper>
    );
}
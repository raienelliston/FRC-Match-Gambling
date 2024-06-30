import { useState, useEffect } from 'react';
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
    const [matchData, setMatchData] = useState({});
    const [bet, setBet] = useState({});
    const [user, setUser] = useState("");
    const [placingBet, setPlacingBet] = useState(false);

    useEffect(() => {
        if (matchList.length === 0) {
            update();
        }
    }, []);

    const updateMatchInfo = () => {
        const matchInfo = fetch(api + '/matchbetinfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matchKey: placingBet })
        }).then(response => response.json()
        ).then(data => setMatchData(data)
        ).catch(err => console.error('Failed to fetch match:', err))
        return matchInfo;
    }

    const update = () => {
        fetch(api + '/matches', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json' 
            }
        }).then(response => response.json()
        ).then(data => 
            setMatchList(data)
        ).catch(err => 
            console.error('Failed to fetch matches:', err)
        );

        fetch(api + '/updatebets', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json()
        ).then(data =>
            console.log(data)
        ).catch(err =>
            console.error('Failed to update bets:', err)
        );

        fetch(api + '/balance', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json' 
            }
        }).then(response => response.json()
        ).then(data => 
            setBalance(data)
        ).catch(err => 
            console.error('Failed to fetch balance:', err)
        );
    };

    const Header = () => (
        <HeaderWrapper>
            <TitleWrapper>FRC Match Gambling</TitleWrapper>
            <AccountInfoWrapper>
                <div>User: {user}</div>
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
                setPlacingBet(key);
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

        if (placingBet === false) {
            return (
                <TileWrapper>
                    <div>Click on a match on the left to place a bet on it and open match info</div>
                </TileWrapper>
            );
        }
        console.log(matchData)

        return (
            <TileWrapper>
                <h1>Match Bets</h1>
                <div>Match: {placingBet.slice(placingBet.indexOf("_") + 1, placingBet.length)}</div>
                <div>Alliance Red: {matchData.alliances.red.team_keys[0] + ", " + matchData.alliances.red.team_keys[1] + ", " + matchData.alliances.red.team_keys[2]}</div>
                <div>Alliance Blue: {matchData.alliances.blue.team_keys[0] + ", " + matchData.alliances.blue.team_keys[1] + ", " + matchData.alliances.blue.team_keys[2]}</div>
                <input type="number" placeholder="Bet Amount" onChange={e => setBet({ ...bet, amount: e.target.value })} />
                <div>Alliance Red Odds: {matchData.pred.red_win_prob}</div>
                <div>Alliance Blue Odds: {1 / parseFloat(matchData.pred.red_win_prob)}</div>
                <div>Alliance Estimated Payout: {}</div>
                <div>Alliance Estimated Payout: {}</div>
                <button onClick={() => setPlacingBet(false)}>Place Bet</button>
            </TileWrapper>
        );
    };

    const MatchBets = () => {

        if (placingBet === false) {
            return (
                <TileWrapper>
                    <div>Bet History</div>
                </TileWrapper>
            );
        }
        console.log(placingBet)

        return (
            <TileWrapper>
                <h1>Match Info</h1>
                <div>Match: {placingBet.slice(placingBet.indexOf("_") + 1, placingBet.length)}</div>
            </TileWrapper>
        );
    };

    const Leaderboard = () => {
        return (
            <TileWrapper>
                <h1>Leaderboard</h1>
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
                    setUser(data);
                    localStorage.setItem('user', data);
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
                    setUser(data);
                    localStorage.setItem('user', data);
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

    // if (!user) {
    //     return (
    //         <Wrapper>
    //             <Login />
    //         </Wrapper>
    //     );
    // }

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

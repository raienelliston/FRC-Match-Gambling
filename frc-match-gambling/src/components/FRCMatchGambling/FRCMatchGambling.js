import { useState, useEffect } from 'react';
import styled from 'styled-components';
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

export function FRCMatchGambling() {
    const [balance, setBalance] = useState(0);
    const [matchList, setMatchList] = useState([]);
    const [match, setMatch] = useState({});
    const [bet, setBet] = useState({});
    const [user, setUser] = useState("");
    const [placingBet, setPlacingBet] = useState(false);

    useEffect(() => {
        if (matchList.length === 0) {
            update();
        }
    }, []);

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

    const updateMatch = (match) => {
        fetch(api + '/matches/' + match, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
            .then(response => response.json())
            .then(data => setMatch(data))
            .catch(err => console.error('Failed to fetch match:', err));
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
        
        const matchTable = matchList.map(match => {
            return (
                <TileWrapper onClick={() => updateMatch(match)}>
                    <h1>{match}</h1>
                </TileWrapper>
            )
        })

        return (
            <TileWrapper>
                <h1>Matches</h1>
                <MatchScrollWrapper>
                    {matchTable}
                </MatchScrollWrapper>
            </TileWrapper>
        )
    }

    const MatchBets = () => (
        <TileWrapper>
            <h1>Match Bets</h1>
        </TileWrapper>
    );

    const MatchInfo = () => (
        <TileWrapper>
            <h1>Match Info</h1>
        </TileWrapper>
    );

    const Leaderboard = () => (
        <TileWrapper>
            <h1>Leaderboard</h1>
        </TileWrapper>
    );

    const BetPlacer = () => (
        <TileWrapper>
            <h1>Place Your Bet</h1>
        </TileWrapper>
    );

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

    if (placingBet) {
        return (
            <Wrapper>
                <Header />
                <BodyWrapper>
                    <MatchInfo />
                    <BetPlacer />
                </BodyWrapper>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <Header />
            <BodyWrapper>
                <Matches />
                <MatchBets />
                <Leaderboard />
            </BodyWrapper>
        </Wrapper>
    );
}

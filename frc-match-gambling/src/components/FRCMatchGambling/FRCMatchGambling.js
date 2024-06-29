import { useState } from 'react';
import styled from 'styled-components';
import "./FRCMatchGambling.css";

const api = 'http://localhost:5000/api';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #282c34;
`;

const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 10vh;
    width: 100vw;
    background-color: #282c34;
`;

const BodyWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 90vh;
    width: 100vw;
    background-color: #282c34;
`;

const LoginWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #282c34;
    z-index: 1;
`;

export function FRCMatchGambling() {
    const [balance, setBalance] = useState(0);
    const [matchList, setMatchList] = useState([]);
    const [match, setMatch] = useState({});
    const [bet, setBet] = useState({});
    const [user, setUser] = ("");

    const update = () => {
        const matchListUpdate = fetch(api + '/matches'
        ).then(data => {
            if (data.status !== 200) {
                throw new Error('Failed to fetch data');
            } else {
                setMatchList(data);
            }
        })
        const betUpdate = fetch(api + '/bets'
        ).then(data => {
            if (data.status !== 200) {
                throw new Error('Failed to fetch data');
            } else {
                setBet(data);
            }
        })
        const balanceUpdate = fetch(api + '/balance'
        ).then(data => {
            if (data.status !== 200) {
                throw new Error('Failed to fetch data');
            } else {
                setBalance(data);
            }
        })
    }

    const updateMatch = (match) => {
        const matchUpdate = fetch(api + '/matches/' + match
        ).then(data => {
            if (data.status !== 200) {
                throw new Error('Failed to fetch data');
            } else {
                setMatch(data);
            }
        })
    }

    const Header = () => {
        console.log(balance)
        return (
            <div>
                <h1>FRC Match Gambling</h1>
                
            </div>
        )
    }

    const Matches = () => {
        
        return (
            <div>
                Matches
            </div>
        )
    }

    const MatchBets = () => {
        return (
            <div>
                Match Bets
            </div>
        )
    }

    const Leaderboard = () => {
        return (
            <div>
                Leaderboard
            </div>
        )
    }

    const BetPlacer = () => {
        return (
            <div>
                Bet Placer
            </div>
        )
    }
    const Login = () => {
        const [ password, setPassword ] = useState("");
        const [ username, setUsername ] = useState("");
        const handleCreateAccount = () => {
            fetch(api + '/create', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({username: username, password: password}),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:5000/api'
                }
            }).then(data => {
                if (data.status !== 200) {
                    throw new Error('Failed to fetch data');
                } else {
                    setUser(data);
                    localStorage.setItem('user', data)
                }
            })
        }

        const handleLogin = () => {
            fetch(api + '/login', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({username: username, password: password}),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:5000/api'
                }
            }).then(data => {
                if (data.status !== 200) {
                    throw new Error('Failed to fetch data');
                } else {
                    setUser(data);
                    localStorage.setItem('user', data);
                }
            })
        }
        return (
            <LoginWrapper>
                <h1>Login</h1>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleCreateAccount}>Create Account</button>
            </LoginWrapper>
        )
    }
    console.log(user)
    
    if (user === undefined || user === "" || user === null) {
        return (
            <Wrapper>
                <Login />
            </Wrapper>
        )
    }

    if (matchList.length === 0) {
        update();
    }

    return (
    <Wrapper>
        <HeaderWrapper>
            <Header />
        </HeaderWrapper>
        <BodyWrapper >
            <Matches />
            <MatchBets />
            <Leaderboard />
            <BetPlacer />
        </BodyWrapper >
    </Wrapper>
    )
}
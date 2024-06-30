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
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 10vh;
    width: 100vw;
    background-color: #282c34;
`;

const TitleWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    font-size: 2em;
`;

const AccountInfoWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-right: 10px;
`;

const BodyWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-template-rows: auto;
    gap: 10px;
    padding: 10px;
    height: 90vh;
    width: 100vw;
    background-color: #282c34;
    overflow-y: auto;
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

const TileWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 20vh;
    width: 20vw;
    background-color: #282c34;
    margin: 10px;
    border: 1px solid white;
`;

export function FRCMatchGambling() {
    const [balance, setBalance] = useState(0);
    const [matchList, setMatchList] = useState([]);
    const [match, setMatch] = useState({});
    const [bet, setBet] = useState({});
    const [user, setUser] = useState("");

    const update = () => {
        const matchListUpdate = fetch(api + '/matches', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:5000'
        }
        }).then(data => {
            if (data.status !== 200) {
                throw new Error('Failed to fetch data');
            } else {
                setMatchList(data);
            }
        })
        const betUpdate = fetch(api + '/updatebets', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:5000'
        }
        }).then(data => {
            if (data.status !== 200) {
                throw new Error('Failed to fetch data');
            } else {
                setBet(data);
            }
        })
        const balanceUpdate = fetch(api + '/accounts/balance', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:5000'
        }
        }).then(data => {
            if (data.status !== 200) {
                throw new Error('Failed to fetch data');
            } else {
                setBalance(data);
            }
        })
    }

    const updateMatch = (match) => {
        const matchUpdate = fetch(api + '/matches/' + match, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:5000'
        }
        }).then(data => {
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
            <HeaderWrapper>
                <TitleWrapper>
                    FRC Match Gambling
                </TitleWrapper>
                <AccountInfoWrapper>
                    <div>
                        User: {user}
                    </div>
                    <div>
                        Balance: {balance}
                    </div>
                </AccountInfoWrapper>
            </HeaderWrapper>
        )
    }

    const Matches = () => {
        
        return (
            <TileWrapper>
                Matches
            </TileWrapper>
        )
    }

    const MatchBets = () => {
        return (
            <TileWrapper>
                Match Bets
            </TileWrapper>
        )
    }

    const Leaderboard = () => {
        return (
            <TileWrapper>
                Leaderboard
            </TileWrapper>
        )
    }

    const BetPlacer = () => {
        return (
            <TileWrapper>
                Bet Placer
            </TileWrapper>
        )
    }
    const Login = () => {
        const [ password, setPassword ] = useState("");
        const [ username, setUsername ] = useState("");
        const handleCreateAccount = () => {
            fetch(api + '/accounts/create', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "http://localhost:5000"
                },
                body: JSON.stringify({username: username, password: password}),
                credentials: 'same-origin'
            }).then(data => {
                console.log(data)
                if (data.status !== 200) {
                    throw new Error('Failed to fetch ');
                } else {
                    setUser(data);
                    localStorage.setItem('user', data)
                }
            })
        }

        const handleLogin = () => {
            fetch(api + '/accounts/login', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({username: username, password: password}),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:5000'
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
    
    // if (user === undefined || user === "" || user === null) {
    //     return (
    //         <Wrapper>
    //             <Login />
    //         </Wrapper>
    //     )
    // }

    if (matchList.length === 0) {
        update();
    }

    return (
    <Wrapper>
        <Header />
        <BodyWrapper >
            <Matches />
            <MatchBets />
            <Leaderboard />
            <BetPlacer />
        </BodyWrapper >
    </Wrapper>
    )
}
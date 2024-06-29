import { useState } from 'react';
import styled from 'styled-components';
import "./FRCMatchGambling.css";

const api = process.env.FRC_MATCH_GAMBLING_API;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export function FRCMatchGambling() {
    const [balance, setBalance] = useState(0);
    const [matchList, setMatchList] = useState([]);
    const [match, setMatch] = useState({});
    const [bet, setBet] = useState({});

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

    if (matchList.length === 0) {
        update();
    }

    const Header = () => {
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

    return (
        <Wrapper >
            <Header />
            <Matches />
            <MatchBets />
            <Leaderboard />
            <BetPlacer />
        </Wrapper >
    )
}
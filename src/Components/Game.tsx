import React, { useEffect } from 'react';
import Timeout = NodeJS.Timeout;

type GameProps = {
    cheatModeEnabled: boolean;
    gameOver: false | 'victory' | 'defeat';
    handleCheatModeChange: () => void;
    handleUndo: () => void;
    timerStarted: boolean;
    score: {count: number}
};

export const Game: React.FunctionComponent<GameProps> = props => {

    const [countDownValue, updateCountDown] = React.useState(0);
    let timer: Timeout;
    let finalScore = (props.score.count - countDownValue).toFixed(1);

    useEffect(() => {
        if (props.timerStarted) {
            timer = setTimeout(() => {
                updateCountDown(() => countDownValue + 0.2);
            }, 1000);
            if (parseInt(finalScore) <= 0 || props.gameOver) {
                clearTimeout(timer);
            }
            return () => clearTimeout(timer);
        }
    });

    if (parseInt(finalScore) <= 0) {
        finalScore = '0';
    }

    return <div className='game-commands'>
        <div className={props.gameOver ? props.gameOver : ''}>
            Score: {finalScore}
        </div>
        <span className={props.gameOver ? props.gameOver : ''}>
            {!props.gameOver || (props.gameOver as string).toUpperCase()}
        </span>
        <button
            onClick={props.handleUndo}
            disabled={props.gameOver === 'victory'}
            className='undo-button'
        >
            Undo
        </button>
        <label className='cheat-input'>
            <input
                style={{display: 'none'}}
                type='checkbox'
                checked={props.cheatModeEnabled}
                onChange={props.handleCheatModeChange}
            />
            Cheat mode: {props.cheatModeEnabled ? 'on' : 'off'}
        </label>
    </div>;
};

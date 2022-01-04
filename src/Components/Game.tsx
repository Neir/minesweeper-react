import React from 'react';

type GameProps = {
    cheatModeEnabled: boolean;
    gameOver: false | 'victory' | 'defeat';
    handleCheatModeChange: () => void;
    handleUndo: () => void;
    score: {score: number}
};

export const Game: React.FunctionComponent<GameProps> = props => {

    return <div className='game-commands'>
        <div className={props.gameOver as string}>
            Score: {props.score.score}
            <span className='game-result'>
                &nbsp;
                {!props.gameOver || (props.gameOver as string).toUpperCase()}
            </span>
        </div>
        <button onClick={props.handleUndo}
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

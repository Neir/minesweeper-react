import React from 'react';
import { GameContext } from '../GameContext';
import { Cell } from './Cell';
import { Game } from './Game';

export const Grid: React.FunctionComponent = () => {
    const { grid, updateGridCellStatus, score } = React.useContext(GameContext);
    const [cheatModeEnabled, enableCheatMode] = React.useState(false);
    const [timerStarted, setTimerStarted] = React.useState(false);

    const gameOver =
        (grid.isDefeated() && 'defeat') ||
        (grid.isVictorious() && 'victory') ||
        false;

    const handleCellClick = (index: number, button: number) => {
        if (!gameOver) {
            updateGridCellStatus(index, button === 0 ? 'dig' : 'flag');
        }
        if (!timerStarted) {
            setTimerStarted(true);
        }
    };

    const handleCheatModeChange = () => {
        enableCheatMode(!cheatModeEnabled);
    };

    const handleUndoClick = () => {
        updateGridCellStatus(0, 'undo');
    };

    return (
        <React.Fragment>
            <div className='game-container'>
                <div
                    style={{
                        width: `calc(48px * ${grid.column})`,
                    }}
                    className='board-grid'
                >
                    {grid.map((cell, index) => (
                        <Cell
                            key={index}
                            status={
                                cheatModeEnabled && cell.containsBomb && !cell.detonated
                                    ? 'warning'
                                    : cell.status
                            }
                            hint={cell.hint}
                            onclick={(ev: MouseEvent) =>
                                handleCellClick(index, ev.button)
                            }
                        />
                    ))}
                </div>
                <Game gameOver={gameOver}
                      cheatModeEnabled={cheatModeEnabled}
                      handleCheatModeChange={handleCheatModeChange}
                      handleUndo={handleUndoClick}
                      timerStarted={timerStarted}
                      score={score}
                />
            </div>
        </React.Fragment>
    );
};

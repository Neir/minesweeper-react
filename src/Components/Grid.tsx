import React from 'react';
import { GameContext } from '../GameContext';
import { Cell } from './Cell';
import { Game } from './Game';

export const Grid: React.FunctionComponent = () => {
    const { grid, updateGridCellStatus, score } = React.useContext(GameContext);

    const handleCellClick = (index: number, button: number) => {
        updateGridCellStatus(index, button === 0 ? 'dig' : 'flag');
    };

    const [cheatModeEnabled, enableCheatMode] = React.useState(false);

    const handleUndoClick = () => {
        updateGridCellStatus(0, 'undo');
    };

    const handleCheatModeChange = () => {
        enableCheatMode(!cheatModeEnabled);
    };

    const gameOver =
        (grid.isDefeated() && 'defeat') ||
        (grid.isVictorious() && 'victory') ||
        false;

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
                      score={score}
                />
            </div>
        </React.Fragment>
    );
};

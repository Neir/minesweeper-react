import React from 'react';
import { GameContext } from '../GameContext';
import { Cell } from './Cell';
import { Game } from './Game';

export const Grid: React.FunctionComponent = () => {
    const { grid, updateGridCellStatus } = React.useContext(GameContext);

    const handleClick = (index: number, button: number) => {
        updateGridCellStatus(index, button === 0 ? 'dig' : 'flag');
    };

    const gameOver =
        (grid.isDefeated() && 'defeat') ||
        (grid.isVictorious() && 'victory') ||
        false;

    const [cheatModeEnabled, enableCheatMode] = React.useState(false);
    const handleCheatModeChange = () => {
        enableCheatMode(!cheatModeEnabled);
    };

    return (
        <React.Fragment>
            <Game gameOver={gameOver} />
            <div
                style={{
                    width: `calc(48px * ${grid.column})`,
                }}
                className="board-grid"
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
                            handleClick(index, ev.button)
                        }
                    />
                ))}
            </div>
            <label className="cheat-input">
                <input
                    style={{display: "none"}}
                    type="checkbox"
                    checked={cheatModeEnabled}
                    onChange={handleCheatModeChange}
                />
                Cheat mode: {cheatModeEnabled ? "on" : "off"}
            </label>
        </React.Fragment>
    );
};

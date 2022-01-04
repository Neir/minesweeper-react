import React from 'react';
import { CellAction } from './Domain/Cell';
import { Grid } from './Domain/Grid';

type GameContextProps = {
    grid: Grid;
    updateGridCellStatus: (index: number, status: CellAction) => void;
    score: { score: number };
};

type GridCustomHook = [Grid, (index: number, action: CellAction) => void];

const ROW = 10;
const COLUMN = 15;
const MINE_COUNT = 15;
const initialGrid = Grid.generate(ROW, COLUMN, MINE_COUNT);

const _score = { score: ROW * COLUMN };
const initialContext: GameContextProps = {
    grid: initialGrid,
    updateGridCellStatus: () => {},
    score: _score
};

const gridsHistory: Grid[] = [initialGrid];


const useStateGridCells = (initialValue: Grid): GridCustomHook => {
    const [grid, setGrid] = React.useState(initialValue);

    return [
        grid,
        (index: number, action: CellAction) => {
            const newGrid = grid.sendActionToCell(index, action, gridsHistory, _score);
            setGrid(newGrid);
        }
    ];
};

export const GameContext = React.createContext<GameContextProps>(
    initialContext
);

export const GameContextProvider: React.FunctionComponent<
    React.ReactNode
> = props => {
    const [grid, updateGridCellStatus] = useStateGridCells(initialContext.grid);

    return (
        <GameContext.Provider value={{ grid, updateGridCellStatus, score: _score }}>
            {props.children}
        </GameContext.Provider>
    );
};

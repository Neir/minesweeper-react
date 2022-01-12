import { Cell } from '../src/Domain/Cell';
import { Grid } from '../src/Domain/Grid';

describe('Rules', () => {
    const cellWithBomb = Cell.withBomb();
    const cellWithoutBomb = Cell.withoutBomb();
    const score = {count: 0};

    test('a new game is neither lost or won', () => {
        const grid = Grid.generate(1, 1, 0);
        expect(grid.isDefeated()).toBe(false);
        expect(grid.isVictorious()).toBe(false);
    });

    test('a game is lost if a cell with a bomb has been dug', () => {
        const grid = new Grid(2, [
            cellWithoutBomb,
            cellWithoutBomb,
            cellWithBomb,
            cellWithoutBomb,
        ]);
        expect(grid.isDefeated()).toBe(false);
        expect(grid.isVictorious()).toBe(false);

        let gridDug = grid.sendActionToCell(0, 'dig', [], score);

        expect(grid.isDefeated()).toBe(false);
        expect(grid.isVictorious()).toBe(false);

        gridDug = gridDug.sendActionToCell(2, 'dig', [], score);

        expect(gridDug.isDefeated()).toBe(true);
        expect(gridDug.isVictorious()).toBe(false);
    });

    test('a game is won if every cell without bomb has been dug', () => {
        const grid = new Grid(2, [
            cellWithoutBomb,
            cellWithoutBomb,
            cellWithBomb,
            cellWithoutBomb,
        ]);
        expect(grid.isDefeated()).toBe(false);
        expect(grid.isVictorious()).toBe(false);

        let gridDug = grid.sendActionToCell(0, 'dig', [], score);
        gridDug = gridDug.sendActionToCell(1, 'dig', [], score);
        gridDug = gridDug.sendActionToCell(3, 'dig', [], score);

        expect(gridDug.isDefeated()).toBe(false);
        expect(gridDug.isVictorious()).toBe(true);
    });

    test('Undo click reset the grid to the previous state', () => {
        let grid = new Grid(2, [cellWithoutBomb, cellWithoutBomb, cellWithoutBomb, cellWithBomb]);
        const initialGrid = grid;
        const gridHistory = [grid];

        const gridDugOnce = grid.sendActionToCell(0, 'dig', gridHistory, score);
        expect(gridDugOnce).not.toEqual(initialGrid);

        const gridDugTwice = gridDugOnce.sendActionToCell(1, 'dig', gridHistory, score);
        expect(gridDugTwice).not.toEqual(gridDugOnce);
        expect(gridDugTwice).not.toEqual(initialGrid);

        const gridRevertedOnce = gridDugTwice.sendActionToCell(-1, 'undo', gridHistory, score);
        expect(gridRevertedOnce).toEqual(gridDugOnce);

        const gridRevertedTwice = gridRevertedOnce.sendActionToCell(-1, 'undo', gridHistory, score);
        expect(gridRevertedTwice).toEqual(initialGrid);
    });

    test('Use a flag reduce the score by 1 point', () => {
        let grid = new Grid(2, [cellWithoutBomb, cellWithoutBomb, cellWithoutBomb, cellWithBomb]);
        const gridHistory = [grid];
        const score = {count: 20};

        grid.sendActionToCell(0, 'flag', gridHistory, score);

        expect(score.count).toEqual(19);
    });

    test('Undo click reduce the score by 5 points', () => {
        let grid = new Grid(2, [cellWithoutBomb, cellWithoutBomb, cellWithoutBomb, cellWithBomb]);
        const gridHistory = [grid];
        const score = {count: 20};

        grid.sendActionToCell(0, 'dig', gridHistory, score);

        grid.sendActionToCell(-1, 'undo', gridHistory, score);

        expect(score.count).toEqual(15);
    });
});

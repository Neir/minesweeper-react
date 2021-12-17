import { Cell } from '../src/Domain/Cell';
import { Grid } from '../src/Domain/Grid';

describe('Rules', () => {
    const cellWithBomb = Cell.withBomb();
    const cellWithoutBomb = Cell.withoutBomb();

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

        let gridDug = grid.sendActionToCell(0, 'dig');

        expect(grid.isDefeated()).toBe(false);
        expect(grid.isVictorious()).toBe(false);

        gridDug = gridDug.sendActionToCell(2, 'dig');

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

        let gridDug = grid.sendActionToCell(0, 'dig');
        gridDug = gridDug.sendActionToCell(1, 'dig');
        gridDug = gridDug.sendActionToCell(3, 'dig');

        expect(gridDug.isDefeated()).toBe(false);
        expect(gridDug.isVictorious()).toBe(true);
    });
});

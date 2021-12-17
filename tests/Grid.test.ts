import { Grid } from '../src/Domain/Grid';
import { Cell } from '../src/Domain/Cell';

describe(Grid, () => {
    const expected = Cell.withBomb();
    const unexpected = Cell.withoutBomb();

    test('it needs to be filled', () => {
        expect(() => new Grid(2, [])).toThrowError(RangeError);
    });

    describe('getByCoordinate', () => {
        test('it get the first cell in grid when asking for x:0 y:0', () => {
            const grid = new Grid(5, [
                expected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
            ]);

            expect(grid.cellByCoordinates(0, 0)).toBe(expected);
        });

        test('it get the last cell in grid when asking for x:3 y:1', () => {
            const grid = new Grid(4, [
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                expected,
            ]);

            const cell = grid.cellByCoordinates(3, 1);
            expect(cell).toBe(expected);
        });

        test('it return undefined when the coordinates are out of the grid', () => {
            const grid = new Grid(1, [
                unexpected,
                unexpected,
                unexpected,
            ]);

            expect(grid.cellByCoordinates(1, 1)).toBe(undefined);
        });

        test('it return undefined when a coordinate is negative', () => {
            const grid = new Grid(1, [
                unexpected,
                unexpected,
                unexpected,
            ]);

            expect(grid.cellByCoordinates(- 1, 1)).toBe(undefined);
        });
    });

    describe('coordinatesByCellIndex', () => {
        test('it return x:0 y:0 when asking for the index 0', () => {
            const grid = new Grid(1, [
                expected,
            ]);

            expect(grid.coordinatesByCellIndex(0)).toEqual([0, 0]);
        });

        test('it return x:1 y:2 when asking for the index 7 in a 3x3 grid', () => {
            const grid = new Grid(3, [
                unexpected, unexpected, unexpected,
                unexpected, unexpected, unexpected,
                unexpected,  expected,  unexpected,
            ]);

            expect(grid.coordinatesByCellIndex(7)).toEqual([1, 2]);
        });

        test('it return x:0 y:1 when asking for the index 3 in a 3x2 grid', () => {
            const grid = new Grid(3, [
                unexpected, unexpected, unexpected,
                 expected,  unexpected, unexpected,
            ]);

            expect(grid.coordinatesByCellIndex(3)).toEqual([0, 1]);
        });

        test('it return x:0 y:1 when asking for the index 3 in a 2x3 grid', () => {
            const grid = new Grid(2, [
                unexpected, unexpected,
                unexpected, unexpected,
                unexpected,  expected,
            ]);

            expect(grid.coordinatesByCellIndex(5)).toEqual([1, 2]);
        });
    });

    describe('getNeighbors', () => {
        const selected = Cell.withoutBomb();
        test('it return 8 neighbors when the cell is not on a border', () => {
            const grid = new Grid(3, [
                expected, expected, expected,
                expected, selected, expected,
                expected, expected, expected,
            ]);

            expect(grid.getNeighborCells(4)).toEqual([
                expected,
                expected,
                expected,
                expected,
                expected,
                expected,
                expected,
                expected,
            ]);
        });
        test('it return 5 neighbors when 3 are out of grid', () => {
            const grid = new Grid(3, [
                unexpected, unexpected, unexpected,
                 expected,   expected,   expected,
                 expected,   selected,   expected,
            ]);

            expect(grid.getNeighborCells(7)).toEqual([
                expected,
                expected,
                expected,
                expected,
                expected,
            ]);
        });

        test('it return 3 neighbors when 5 are out of grid (top left corner)', () => {
            const grid = new Grid(3, [
                 selected,   expected,  unexpected,
                 expected,   expected,  unexpected,
                unexpected, unexpected, unexpected,
            ]);

            expect(grid.getNeighborCells(0)).toEqual([
                expected,
                expected,
                expected,
            ]);
        });

        test('it return 3 neighbors when 5 are out of grid (bottom right corner)', () => {
            const grid = new Grid(3, [
                unexpected, unexpected, unexpected,
                unexpected,  expected,   expected,
                unexpected,  expected,   selected,
            ]);

            expect(grid.getNeighborCells(8)).toEqual([
                expected,
                expected,
                expected,
            ]);
        });
    });

    describe('countNeighborBombs', () => {
        const CL = Cell.withoutBomb();
        const __ = Cell.withoutBomb();
        const $$ = Cell.withBomb();

        test('it get none bombs when the cell is away from bombs', () => {
            const grid = new Grid(3, [
                CL, __, $$,
                __, __, $$,
                $$, $$, $$,
            ]);

            expect(grid.countNeighborBombs(0)).toBe(0);
        });

        test('it get 2 bombs when the cell has 2 neighbors containing bomb', () => {
            const grid = new Grid(3, [
                __, CL, $$,
                __, __, $$,
                $$, $$, $$,
            ]);

            expect(grid.countNeighborBombs(1)).toBe(2);
        });

        test('it get 8 bombs when all the neighbors contains bomb', () => {
            const grid = new Grid(3, [
                $$, $$, $$,
                $$, CL, $$,
                $$, $$, $$,
            ]);


            expect(grid.countNeighborBombs(4)).toBe(8);
        });
    });

    describe('generator', () => {
        const row = 10;
        const column = row;
        const iterator = Array.from(Array(row * column));

        test('it create a grid with cells', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                expect(grid.cellByIndex(index)).toBeDefined();
            });
        });

        test('it create a grid without any mines', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const dugCell = cell.dig();
                    expect(dugCell.detonated).toBe(false);
                }
            });
        });

        test('it create a grid full of mines', () => {
            const grid = Grid.generate(row, column, row * column);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const trappedDugCell = cell.dig();
                    expect(trappedDugCell.detonated).toBe(true);
                }
            });
        });

        test('it create a grid with 10 mines out of 100 cells', () => {
            const grid = Grid.generate(row, column, 10);
            const mineCount = iterator.reduce((count, _, index) => {
                const cell = grid.cellByIndex(index);
                if (cell === undefined) return count;

                const dugCell = cell.dig();
                return dugCell.detonated === true ? count + 1 : count;
            }, 0);

            expect(mineCount).toBe(10);
        });
    });
});

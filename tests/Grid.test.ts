import { Grid } from '../src/Domain/Grid';
import { Cell } from '../src/Domain/Cell';
import 'jest-extended';

describe(Grid, () => {
    const expected = Cell.withBomb();
    const unexpected = Cell.withoutBomb();

    test('it needs to be filled', () => {
        expect(() => new Grid(2, [])).toThrowError(RangeError);
    });

    describe('cellIndexByCoordinates', () => {
        test('it get the first cell in grid when asking for x:0 y:0', () => {
            const cells = [
                expected, unexpected, unexpected, unexpected, unexpected,
            ];
            const grid = new Grid(5, cells);

            expect(cells[grid.cellIndexByCoordinates(0, 0)]).toBe(expected);
        });

        test('it get the last cell in grid when asking for x:3 y:1', () => {
            const cells = [
                unexpected, unexpected, unexpected, unexpected,
                unexpected, unexpected, unexpected, expected,
            ];
            const grid = new Grid(4, cells);

            expect(cells[grid.cellIndexByCoordinates(3, 1)]).toBe(expected);
        });

        test('it return -1 when x coordinate is out of the grid', () => {
            const grid = new Grid(1, [
                unexpected,
                unexpected,
                unexpected,
            ]);

            expect(grid.cellIndexByCoordinates(1, 1)).toBe(-1);
        });

        test('it return -1 when y coordinate is out of the grid', () => {
            const grid = new Grid(3, [
                unexpected, unexpected, unexpected,
            ]);

            expect(grid.cellIndexByCoordinates(1, 1)).toBe(-1);
        });

        test('it return -1 when a coordinate is negative', () => {
            const grid = new Grid(1, [
                unexpected,
                unexpected,
                unexpected,
            ]);

            expect(grid.cellIndexByCoordinates(- 1, 1)).toBe(-1);
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

    describe('getNeighborCellIndexes', () => {
        const selected = Cell.withoutBomb();
        test('it return 8 neighbors when the cell is not on a border', () => {
            const cells = [
                expected, expected, expected,
                expected, selected, expected,
                expected, expected, expected,
            ];
            const grid = new Grid(3, cells);

            const cellIndexes = grid.getNeighborCellIndexes(4)

            expect(cellIndexes).toIncludeSameMembers([0, 1, 2, 3, 5, 6, 7, 8]);
            cellIndexes.forEach((cellIndex: number) =>
                expect(cells[cellIndex]).toBe(expected)
            );
        });
        test('it return 5 neighbors when 3 are out of grid', () => {
            const cells = [
                unexpected, unexpected, unexpected,
                 expected,   expected,   expected,
                 expected,   selected,   expected,
            ];
            const grid = new Grid(3, cells);

            const cellIndexes = grid.getNeighborCellIndexes(7)

            expect(cellIndexes).toIncludeSameMembers([3, 4, 5, 6, 8]);
            cellIndexes.forEach((cellIndex: number) =>
                expect(cells[cellIndex]).toBe(expected)
            );
        });

        test('it return 3 neighbors when 5 are out of grid (top left corner)', () => {
            const cells = [
                 selected,   expected,  unexpected,
                 expected,   expected,  unexpected,
                unexpected, unexpected, unexpected,
            ];
            const grid = new Grid(3, cells);

            const cellIndexes = grid.getNeighborCellIndexes(0);
            expect(cellIndexes).toIncludeSameMembers([1, 3, 4]);
            cellIndexes.forEach((cellIndex: number) =>
                expect(cells[cellIndex]).toBe(expected)
            );
        });

        test('it return 3 neighbors when 5 are out of grid (bottom right corner)', () => {
            const cells = [
                unexpected, unexpected, unexpected,
                unexpected,  expected,   expected,
                unexpected,  expected,   selected,
            ];
            const grid = new Grid(3, cells);

            const cellIndexes = grid.getNeighborCellIndexes(8);

            expect(cellIndexes).toIncludeSameMembers([4, 5, 7]);
            cellIndexes.forEach((cellIndex: number) =>
                expect(cells[cellIndex]).toBe(expected)
            );
        });
    });

    describe('countNeighborBombs', () => {
        const SC = Cell.withoutBomb();  // Selected Cell
        const __ = Cell.withoutBomb();
        const $$ = Cell.withBomb();

        test('it get none bombs when the cell is away from bombs', () => {
            const cells = [
                SC, __, $$,
                __, __, $$,
                $$, $$, $$,
            ];
            const grid = new Grid(3, cells);

            expect(grid.countNeighborBombs(0, cells)).toBe(0);
        });

        test('it get 2 bombs when the cell has 2 neighbors containing bomb', () => {
            const cells = [
                __, SC, $$,
                __, __, $$,
                $$, $$, $$,
            ];
            const grid = new Grid(3, cells);

            expect(grid.countNeighborBombs(1, cells)).toBe(2);
        });

        test('it get 8 bombs when all the neighbors contains bomb', () => {
            const cells = [
                $$, $$, $$,
                $$, SC, $$,
                $$, $$, $$,
            ];
            const grid = new Grid(3, cells);


            expect(grid.countNeighborBombs(4, cells)).toBe(8);
        });
    });

    describe('digInCascadeWithHint', () => {
        const SC = Cell.withoutBomb(); // Selected Cell
        const __ = Cell.withoutBomb();
        const $$ = Cell.withBomb();

        test('it dig only the selected cell when the cell is close to bomb', () => {
            const cells = [
                SC, $$, $$,
                $$, $$, $$,
                $$, $$, $$,
            ];

            const grid = new Grid(3, cells);

            grid.digInCascadeWithHint(0, cells);

            expect(cells.map(cell => cell.status)).toIncludeSameMembers([
                   'dug',    'untouched', 'untouched',
                'untouched', 'untouched', 'untouched',
                'untouched', 'untouched', 'untouched'
            ]);
            expect(cells.map(cell => cell.hint)).toIncludeSameMembers([
                3, -1, -1,
                -1, -1, -1,
                -1, -1, -1
            ]);
        });

        test('it dig all the cells when the grid contains no bomb', () => {
            const cells = [
                SC, __, __,
                __, __, __,
                __, __, __,
            ];

            const grid = new Grid(3, cells);

            grid.digInCascadeWithHint(0, cells);

            expect(cells.map(cell => cell.status)).toIncludeSameMembers([
                'dug', 'dug', 'dug',
                'dug', 'dug', 'dug',
                'dug', 'dug', 'dug'
            ]);
            expect(cells.map(cell => cell.hint)).toIncludeSameMembers([
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            ]);
        });

        test('it dig the neighboring cells without bomb and mark hint on cells close to bomb', () => {
            const cells = [
                SC, __, $$,
                __, __, $$,
                $$, $$, $$,
            ];

            const grid = new Grid(3, cells);

            grid.digInCascadeWithHint(0, cells);

            expect(cells.map(cell => cell.status)).toIncludeSameMembers([
                   'dug',       'dug',    'untouched',
                   'dug',       'dug',    'untouched',
                'untouched', 'untouched', 'untouched'
            ]);
            expect(cells.map(cell => cell.hint)).toIncludeSameMembers([
               0, 2, -1,
               2, 5, -1,
               -1, -1, -1
            ]);
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

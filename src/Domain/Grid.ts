import { Cell, CellAction } from './Cell';

export type Cells = Array<Cell>;

export class Grid {
    [key: number]: number;
    private _column: number;
    private _cells: Cells;

    static generate(row: number, column: number, minesCount: number): Grid {
        const length = row * column;
        let cells: Cells = [];
        for (let i = 0; i < length; i++) {
            const cell = minesCount > i ? Cell.withBomb() : Cell.withoutBomb();
            cells.push(cell);
        }

        let index = -1;
        while (++index < length) {
            const rand = index + Math.floor(Math.random() * (length - index));
            const cell = cells[rand];

            cells[rand] = cells[index];
            cells[index] = cell;
        }

        return new Grid(column, cells);
    }

    constructor(column: number, cells: Cells) {
        if (!Number.isInteger(column)) {
            throw new TypeError('column count must be an integer');
        }

        if (cells.length % column !== 0 || cells.length === 0) {
            throw new RangeError(
                'cell count must be dividable by column count'
            );
        }

        this._column = column;
        this._cells = cells;
    }

    [Symbol.iterator]() {
        return this._cells[Symbol.iterator]();
    }

    map(
        callbackfn: (value: Cell, index: number, array: Cell[]) => {},
        thisArg?: any
    ) {
        return this._cells.map(callbackfn);
    }

    cellByIndex(index: number): Cell | undefined {
        return this._cells[index];
    }

    cellByCoordinates(x: number, y: number): Cell | undefined {
        if (x < 0 || x >= this.column || y < 0 || y >= this.column) {
            return undefined;
        }
        return this._cells[this.column * y + x];
    }

    coordinatesByCellIndex(index: number): [number, number] {
        return [
            index % this.column,
            Math.floor(index / this.column),
        ];
    }

    getNeighborCells(cellIndex: number): Cell[] {
        const [cellX, cellY] = this.coordinatesByCellIndex(cellIndex);

        const neighborCells = [
            this.cellByCoordinates(cellX - 1, cellY - 1),
            this.cellByCoordinates(cellX - 1, cellY),
            this.cellByCoordinates(cellX - 1, cellY + 1),
            this.cellByCoordinates(cellX, cellY - 1),
            this.cellByCoordinates(cellX, cellY + 1),
            this.cellByCoordinates(cellX + 1, cellY - 1),
            this.cellByCoordinates(cellX + 1, cellY),
            this.cellByCoordinates(cellX + 1, cellY + 1),
        ];

        return neighborCells.filter(cell => !!cell) as Cell[];
    }

    countNeighborBombs(cellIndex: number) {
        return this.getNeighborCells(cellIndex)
            .filter(cell => cell.containsBomb).length;
    }

    sendActionToCell(cellIndex: number, action: CellAction): Grid {
        const cells = [...this._cells];
        const cell = cells[cellIndex];

        cells[cellIndex] = cell[action]();

        if (action === 'dig') {
            cells[cellIndex].hint = this.countNeighborBombs(cellIndex);
        }
        return new Grid(this._column, cells);
    }

    isDefeated = () => {
        for (let cell of this) {
            if (cell.detonated === true) return true;
        }
        return false;
    };

    isVictorious = () => {
        for (let cell of this) {
            if (
                (cell.dug === false && cell.containsBomb === false) ||
                cell.detonated === true
            ) {
                return false;
            }
        }
        return true;
    };

    get column() {
        return this._column;
    }
}

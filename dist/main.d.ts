import { Cell, CellConstructorProps, Position } from "./modules/cell";
import { Config, ViewProperties } from "./modules/config";
import { RangeSelectionType, Selection } from "./modules/selection";
import { Styles } from "./modules/styles";
import { Viewport } from "./modules/viewport";
import './scss/main.scss';
import { Cache } from "./modules/cache";
interface SpreadsheetConstructorProperties {
    config?: Omit<Config, 'view'>;
    view?: ViewProperties;
}
export declare class Spreadsheet {
    private table;
    private scroller;
    private toolbar;
    private header;
    private sheet;
    private editor;
    styles: Styles;
    config: Config;
    data: Cell[][];
    viewport: Viewport;
    selection: Selection;
    cache: Cache;
    constructor(target: string | HTMLElement, props?: SpreadsheetConstructorProperties);
    private getInitialCache;
    private buildComponent;
    private appendTableToTarget;
    get ctx(): CanvasRenderingContext2D;
    get viewProps(): ViewProperties;
    focusTable(): void;
    getCellByCoords(x: number, y: number): Position;
    getCell(position: Position): Cell;
    changeCellValues(position: Position, values: Partial<Omit<CellConstructorProps, 'position'>>): void;
    applyActionToRange(range: RangeSelectionType, callback: (cell: Cell) => any): void;
    deleteSelectedCellsValues(): void;
    showEditor(position: Position): void;
    renderSheet(): void;
    renderCell(row: number, col: number): void;
    loadData(data: Cell[][]): void;
    private makeConfigFromData;
}
export {};

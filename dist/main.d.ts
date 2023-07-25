import { Cell, CellConstructorProps, Position, SerializableCell } from "./modules/cell";
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
export default class Spreadsheet {
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
    /**Destroy spreadsheet DOM element.
     *
     * May be usefull when need to rerender component.
     */
    destroy(): void;
    private appendTableToTarget;
    /** Canvas rendering context 2D.
     *
     * Abble to draw on canvas with default CanvasAPI methods
     */
    get ctx(): CanvasRenderingContext2D;
    get viewProps(): ViewProperties;
    /** Focusing on interactive part of spreadsheet */
    focusTable(): void;
    getCellByCoords(x: number, y: number): Position;
    getCell(position: Position): Cell;
    changeCellValues(position: Position, values: Partial<Omit<CellConstructorProps, 'position'>>): void;
    applyActionToRange(range: RangeSelectionType, callback: (cell: Cell) => any): void;
    deleteSelectedCellsValues(): void;
    showEditor(position: Position): void;
    renderSheet(): void;
    renderCell(row: number, col: number): void;
    loadData(data: Cell[][] | SerializableCell[][]): Spreadsheet;
    private makeConfigFromData;
    serializeData(): SerializableCell[][];
}
export * from './modules/cache';
export * from './modules/cell';
export * from './modules/column';
export * from './modules/config';
export * from './modules/renderBox';
export * from './modules/row';
export * from './modules/selection';
export * from './modules/styles';
export * from './modules/viewport';
export * from './utils/createData';

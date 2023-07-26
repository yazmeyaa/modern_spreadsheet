import { Cell, CellConstructorProps, CellStyles, Position, SerializableCell } from "./modules/cell";
import { CellChangeEvent, CellClickEvent, Config, CopyEvent, SelectionChangeEvent, ViewProperties } from "./modules/config";
import { RangeSelectionType, Selection } from "./modules/selection";
import { Styles } from "./modules/styles";
import { Viewport } from "./modules/viewport";
import "./scss/main.scss";
import { Cache } from "./modules/cache";
import { Events } from "./modules/events";
import { Clipboard } from "./modules/clipboard";
export interface SpreadsheetConstructorProperties {
    view?: ViewProperties;
    onCellClick?: CellClickEvent | null;
    onSelectionChange?: SelectionChangeEvent | null;
    onCellChange?: CellChangeEvent | null;
    onCopy?: CopyEvent | null;
}
export declare const CSS_PREFIX = "modern_sc_";
export default class Spreadsheet {
    private table;
    private scroller;
    private toolbar;
    private rowsBar;
    private columnsBar;
    private sheet;
    private editor;
    styles: Styles;
    config: Config;
    data: Cell[][];
    viewport: Viewport;
    selection: Selection;
    cache: Cache;
    events: Events;
    clipboard: Clipboard;
    constructor(target: string | HTMLElement, props?: SpreadsheetConstructorProperties);
    private setRowsBarPosition;
    private setColumnsBarPosition;
    private setElementsPositions;
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
    get columnsBarHeight(): number;
    get rowsBarWidth(): number;
    get toolbarHeight(): number;
    /** Focusing on interactive part of spreadsheet */
    focusTable(): void;
    getCellByCoords(x: number, y: number): Position;
    getCell(position: Position): Cell;
    changeCellValues(position: Position, values: Partial<Omit<CellConstructorProps, "position">>, enableCallback?: boolean): void;
    changeCellStyles(position: Position, styles: CellStyles): void;
    applyActionToRange(range: RangeSelectionType, callback: (cell: Cell) => void): void;
    deleteSelectedCellsValues(): void;
    showEditor(position: Position, initialString?: string): void;
    renderSheet(): void;
    renderColumnsBar(): void;
    renderRowsBar(): void;
    renderCell(row: number, col: number): void;
    loadData(data: Cell[][] | SerializableCell[][]): Spreadsheet;
    private makeConfigFromData;
    serializeData(): SerializableCell[][];
}
export * from "./modules/cache";
export * from "./modules/cell";
export * from "./modules/column";
export * from "./modules/config";
export * from "./modules/renderBox";
export * from "./modules/row";
export * from "./modules/selection";
export * from "./modules/styles";
export * from "./modules/viewport";
export * from "./utils/createData";

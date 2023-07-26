import { Cell } from "./cell";
import { Column } from "./column";
import { Row } from "./row";
import { Selection } from "./selection";
export interface ViewProperties {
    width: number;
    height: number;
}
export type CellClickEvent = (event: MouseEvent, cell: Cell) => void;
export type SelectionChangeEvent = (selection: Selection) => void;
export type CellChangeEvent = (cell: Cell) => void;
export type ConfigProperties = {
    /** Please, end it with '_' symbol.
     *
     * *Example:*
     *
     *      'test_'
     *      'google_' */
    rows: Row[];
    columns: Column[];
    view: ViewProperties;
    onCellClick?: CellClickEvent | null;
    onSelectionChange?: SelectionChangeEvent | null;
    onCellChange?: CellChangeEvent | null;
};
export type SheetConfigConstructorProps = {
    rows: Row[];
    columns: Column[];
};
export declare class Config {
    rows: Row[];
    columns: Column[];
    view: ViewProperties;
    onCellClick: ((event: MouseEvent, cell: Cell) => void) | null;
    onSelectonChange: SelectionChangeEvent | null;
    onCellChange: CellChangeEvent | null;
    constructor(props: ConfigProperties);
}

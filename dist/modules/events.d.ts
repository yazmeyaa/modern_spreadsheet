import { Scroller } from "../components/scroller";
import Spreadsheet, { Cell, CellConstructorProps, Selection } from "../main";
export declare enum EventTypes {
    CELL_CLICK = "CELL_CLICK",
    SELECTION_CHANGE = "CHANGE_SELECTION",
    CELL_CHANGE = "CELL_CHANGE"
}
export type CellClickEvent = {
    type: EventTypes.CELL_CLICK;
    event: MouseEvent;
    scroller: Scroller;
};
export type ChangeSelectionEvent = {
    type: EventTypes.SELECTION_CHANGE;
    selection: Selection;
    enableCallback?: boolean;
};
export type ChangeCellEvent = {
    type: EventTypes.CELL_CHANGE;
    cell: Cell;
    values: Partial<Omit<CellConstructorProps, "position">>;
};
export type ActionTypes = CellClickEvent | ChangeSelectionEvent | ChangeCellEvent;
export declare class Events {
    root: Spreadsheet;
    constructor(root: Spreadsheet);
    dispatch(action: ActionTypes): void;
    private cellClick;
    private changeSelection;
    private changeCellValues;
}

import { Scroller } from "../components/scroller";
import Spreadsheet, { Cell, CellConstructorProps, Selection } from "../main";

export enum EventTypes {
    CELL_CLICK = "CELL_CLICK",
    SELECTION_CHANGE = "CHANGE_SELECTION",
    CELL_CHANGE = "CELL_CHANGE"
}

export type CellClickEvent = {
    type: EventTypes.CELL_CLICK
    event: MouseEvent
    scroller: Scroller
}

export type ChangeSelectionEvent = {
    type: EventTypes.SELECTION_CHANGE,
    selection: Selection
    enableCallback?: boolean
}

export type ChangeCellEvent = {
    type: EventTypes.CELL_CHANGE,
    cell: Cell,
    values: Partial<Omit<CellConstructorProps, "position">>
}

export type ActionTypes = CellClickEvent | ChangeSelectionEvent | ChangeCellEvent

export class Events {

    root: Spreadsheet

    constructor(root: Spreadsheet) {
        this.root = root
    }

    dispatch(action: ActionTypes) {
        switch (action.type) {
            case EventTypes.CELL_CLICK: {
                const { event, scroller } = action
                //
                //* Here may be side effects
                //
                this.cellClick(event, scroller)
                break;
            }

            case EventTypes.SELECTION_CHANGE: {
                const { selection, enableCallback } = action
                //
                //* Here may be side effects
                //
                this.changeSelection(selection, enableCallback)
                break;
            }

            case EventTypes.CELL_CHANGE: {
                const { cell, values } = action
                //
                //* Here may be side effects
                //
                this.changeCellValues(cell, values)
                break;
            }

            default: {
                break;
            }
        }
    }

    private cellClick = (event: MouseEvent, scroller: Scroller) => {
        if (event.button !== 0) return; // Left mouse button
        const { offsetX, offsetY } = event;
        const clickedCell = this.root.getCellByCoords(offsetX, offsetY);
        const cell = this.root.getCell(clickedCell)

        const selection = new Selection()
        selection.selectedCell = clickedCell
        selection.selectedRange = {
            from: clickedCell,
            to: clickedCell,
        };

        scroller.setSelectingMode(true);

        this.changeSelection(selection, true)

        this.root.config.onCellClick?.(event, cell)
    }

    private changeSelection = (selection: Selection, enableCallback = false) => {
        this.root.selection = selection

        if (enableCallback) this.root.config.onSelectonChange?.(selection)
        this.root.renderSheet();
        this.root.renderColumnsBar();
        this.root.renderRowsBar();
    }

    private changeCellValues(cell: Cell, values: Partial<Omit<CellConstructorProps, "position">>) {
        this.root.changeCellValues(cell.position, values)

        this.root.config.onCellChange?.(cell)
    }
}
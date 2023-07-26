import { Scroller } from "../components/scroller";
import Spreadsheet, { Selection } from "../main";

export enum EventTypes {
    CELL_CLICK = "CELL_CLICK",
    CHANGE_SELECTION = "CHANGE_SELECTION"
}

export type CellClickEvent = {
    type: EventTypes.CELL_CLICK
    event: MouseEvent
    scroller: Scroller
}

export type ChangeSelectionEvent = {
    type: EventTypes.CHANGE_SELECTION,
    selection: Selection
    enableCallback?: boolean
}

export type ActionTypes = CellClickEvent | ChangeSelectionEvent

export class Events {

    root: Spreadsheet

    constructor(root: Spreadsheet) {
        this.root = root
    }

    dispatch(action: ActionTypes) {
        switch (action.type) {
            case EventTypes.CELL_CLICK: {
                const { event, scroller } = action
                this.cellClick(event, scroller)
                break;
            }

            case EventTypes.CHANGE_SELECTION: {
                const { selection, enableCallback } = action
                this.changeSelection(selection, enableCallback)
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

}
import { Scroller } from "../components/scroller";
import Spreadsheet, { Cell, RangeSelectionType, Selection } from "../main";

export enum EventTypes {
  CELL_CLICK = "CELL_CLICK",
  SELECTION_CHANGE = "CHANGE_SELECTION",
  CELL_CHANGE = "CELL_CHANGE",
  COPY_CELLS = "COPY_CELLS",
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
  enableCallback?: boolean;
};

export type CopyAction = {
  type: EventTypes.COPY_CELLS;
  range: RangeSelectionType;
  data: Cell[][];
  dataAsString: string;
};

export type ActionTypes =
  | CellClickEvent
  | ChangeSelectionEvent
  | ChangeCellEvent
  | CopyAction;


export class Events {
  root: Spreadsheet;

  constructor(root: Spreadsheet) {
    this.root = root;
  }

  async dispatch(action: ActionTypes) {
    switch (action.type) {
      case EventTypes.CELL_CLICK: {
        const { event, scroller } = action;
        //
        //* Here may be side effects
        //
        this.cellClick(event, scroller);
        break;
      }

      case EventTypes.SELECTION_CHANGE: {
        const { selection, enableCallback } = action;
        //
        //* Here may be side effects
        //
        this.changeSelection(selection, enableCallback);
        break;
      }

      case EventTypes.CELL_CHANGE: {
        const { cell, enableCallback } = action;
        if (cell.value.substring(0, 1).startsWith('=')) {
          try {
            await cell.evalFormula(this.root.formulaParser)
            cell.displayValue = cell.resultValue
            this.root.renderCell(cell.position.row, cell.position.column)
            this.changeCellValues(cell, enableCallback);
            return;
          }
          catch (err) {
            console.error(err)
          }
        }

        this.root.renderCell(cell.position.row, cell.position.column)
        this.changeCellValues(cell, enableCallback);
        break;
      }

      case EventTypes.COPY_CELLS: {
        const { data, dataAsString, range } = action;
        this.copy(range, data, dataAsString);
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
    const cell = this.root.getCell(clickedCell);

    const selection = new Selection();
    selection.selectedCell = clickedCell;
    selection.selectedRange = {
      from: clickedCell,
      to: clickedCell,
    };

    scroller.setSelectingMode(true);

    this.changeSelection(selection, true);

    this.root.config.onCellClick?.(event, cell);
  };

  private changeSelection = (selection: Selection, enableCallback = false) => {
    this.root.selection = selection;

    if (enableCallback) this.root.config.onSelectonChange?.(selection);
    this.root.renderSheet();
    this.root.renderColumnsBar();
    this.root.renderRowsBar();
  };

  private changeCellValues(cell: Cell, enableCallback: boolean = true) {
    if (enableCallback) this.root.config.onCellChange?.(cell);
  }

  private copy = (
    range: RangeSelectionType,
    data: Cell[][],
    dataAsString: string,
  ) => {
    this.root.config.onCopy?.(range, data, dataAsString);
  };
}

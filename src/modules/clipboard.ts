import Spreadsheet, { RangeSelectionType } from "../main";
import { Cell, CellConstructorProps, CellStyles, Position } from "./cell";
import { EventTypes } from "./events";

export class Clipboard {
  saved: Cell[][] | null = null;
  root: Spreadsheet;
  constructor(root: Spreadsheet) {
    this.root = root;
  }

  copy(data: Cell[][], range: RangeSelectionType) {
    const mapedData = data
      .map((row) => {
        return row
          .map((item) => {
            return item.displayValue;
          })
          .join("\t");
      })
      .join("\n");

    this.saved = data;
    navigator.clipboard.writeText(mapedData);

    this.root.events.dispatch({
      type: EventTypes.COPY_CELLS,
      data,
      dataAsString: mapedData,
      range,
    });
  }

  paste(root: Spreadsheet, { column, row }: Position, event: ClipboardEvent) {
    if (!this.saved) {
      if (!event.clipboardData) return;
      const data = event.clipboardData.getData("text");
      try {
        const arr = data.split("\n").map((item) => item.split("\t"));
        const arrayOfCells = arr.map((innerRow) => {
          return innerRow.map((item) => {
            const cellProps: CellConstructorProps = {
              displayValue: item,
              position: {
                column,
                row,
              },
              resultValue: item,
              style: new CellStyles(),
              value: item,
            };
            return new Cell(cellProps);
          });
        });

        const rowsLength = arrayOfCells.length;
        const colsLength = arrayOfCells[0] ? arrayOfCells[0].length : 0;

        for (let i = 0; i < rowsLength; i++) {
          for (let j = 0; j < colsLength; j++) {
            const savedCell = arrayOfCells[i][j];

            const position = {
              column: column + j,
              row: row + i,
            };

            const values = {
              displayValue: savedCell.displayValue,
              value: savedCell.value,
              style: savedCell.style,
            };

            root.changeCellValues(position, values, false);
          }
        }
      } catch (err) {
        console.error("Cannot read clipboard. ", err);
      }

      return;
    }

    const rowsLength = this.saved.length;
    const colsLength = this.saved[0] ? this.saved[0].length : 0;

    for (let i = 0; i < rowsLength; i++) {
      for (let j = 0; j < colsLength; j++) {
        const savedCell = this.saved[i][j];

        const position = {
          column: column + j,
          row: row + i,
        };

        const values = {
          displayValue: savedCell.displayValue,
          value: savedCell.value,
          style: savedCell.style,
        };

        root.changeCellValues(position, values, false);
      }
    }
  }
}

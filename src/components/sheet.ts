import Spreadsheet, { CSS_PREFIX, RenderBox } from "../main";
import { Position } from "../modules/cell";

/**
 * Display (CANVAS) element where cells render
 */
export class Sheet {
  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  root: Spreadsheet;
  constructor(root: Spreadsheet) {
    this.root = root;
    const canvas = document.createElement("canvas");
    canvas.classList.add(CSS_PREFIX + "sheet");

    //* Set up canvas sizes based on provided root config
    canvas.height = this.root.config.view.height;
    canvas.width = this.root.config.view.width;
    canvas.style.width = this.root.config.view.width + "px";
    canvas.style.height = this.root.config.view.height + "px";
    canvas.style.left = "0px";

    this.element = canvas;

    const ctx = this.element.getContext("2d");
    if (!ctx) throw new Error("Enable hardware acceleration");
    this.ctx = ctx;
  }

  getCellByCoords(x: number, y: number): Position {
    let row = 0;
    let height = 0;
    while (height <= y) {
      height += this.root.config.rows[row].height;
      if (height >= y) break;
      row++;
    }

    let col = 0;
    let width = 0;
    while (width <= x) {
      width += this.root.config.columns[col].width;
      if (width >= x) break;
      col++;
    }

    return new Position(row, col);
  }

  renderCell(position: Position) {
    const { column, row } = position;
    this.root.data[row][column].render(this.root);
  }

  private getSelectionRange() {
    const { selectedCell, selectedRange } = this.root.selection

    if (!selectedCell && !selectedRange) return;
    if (selectedRange) {

      const startRow = Math.min(selectedRange.from.row, selectedRange.to.row)
      const startCol = Math.min(selectedRange.from.column, selectedRange.to.column)
      const lastRow = Math.max(selectedRange.from.row, selectedRange.to.row)
      const lastCol = Math.max(selectedRange.from.column, selectedRange.to.column)

      const startCellBox = new RenderBox(this.root.config, {row: startRow, column: startCol})

      let width = 0
      for (let col = startCol; col <= lastCol; col++) {
        width += this.root.config.columns[col].width
      }

      let height = 0
      for (let row = startRow; row <= lastRow; row++) {
        height += this.root.config.rows[row].height
      }

      const x = startCellBox.x - this.root.viewport.left
      const y = startCellBox.y - this.root.viewport.top

      return { x, y, height, width }
    }
    if (!selectedRange && selectedCell) {
      const box = new RenderBox(this.root.config, selectedCell)
      box.x -= this.root.viewport.left
      box.y -= this.root.viewport.top
      return box
    }
  }

  private renderSelectionRange(x: number, y: number, width: number, height: number) {

    this.ctx.save()
    this.ctx.strokeStyle = '#47d1ff'
    this.ctx.lineWidth = 3
    this.ctx.strokeRect(x, y, width, height)
    this.ctx.fillStyle = '#7da8ff50'
    this.ctx.fillRect(x, y, width, height)
    this.ctx.restore()

  }

  renderSelection() {
    const box = this.getSelectionRange()
    if (!box) return;
    const {height, width, x, y} = box
    this.renderSelectionRange(x, y, width, height)
  }

  renderSheet() {
    const firstRowIdx = this.root.viewport.firstRow;
    const lastColIdx = this.root.viewport.lastCol + 3;
    const lastRowIdx = this.root.viewport.lastRow + 3;
    const firstColIdx = this.root.viewport.firstCol;


    for (let row = firstRowIdx; row <= lastRowIdx; row++) {
      for (let col = firstColIdx; col <= lastColIdx; col++) {
        if (!this.root.config.columns[col] || !this.root.config.rows[row])
          break; //* Prevent read undefined

        this.renderCell({ column: col, row });
      }
    }
    this.renderSelection()

  }
}

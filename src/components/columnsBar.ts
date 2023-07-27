import Spreadsheet, { RenderBox } from "../main";

export class ColumnsBar {
  public element: HTMLCanvasElement;
  private root: Spreadsheet;
  public height: number = 35;
  public width: number;
  // private resizerWidth = 1;
  ctx: CanvasRenderingContext2D;

  constructor(root: Spreadsheet) {
    this.root = root;
    this.element = this.createElement();
    const ctx = this.element.getContext("2d");
    if (!ctx) throw new Error("Enable hardware acceleration");
    this.ctx = ctx;

    this.width = this.root.viewProps.width;
  }

  private createElement(): HTMLCanvasElement {
    const element = document.createElement("canvas");
    element.style.position = "absolute";
    element.style.height = this.height + "px";
    element.style.width = this.root.viewProps.width + "px";
    element.style.display = "block";
    element.style.borderLeft = "1px solid black";
    // element.style.boxSizing = 'border-box'

    element.width = this.root.viewProps.width;
    element.height = this.height;
    return element;
  }

  public setElementPosition(top: number, left: number) {
    this.element.style.top = top + "px";
    this.element.style.left = left + "px";
  }

  private isColumnSelected(column: number): boolean {
    const { selectedCell, selectedRange } = this.root.selection;
    if (selectedCell && selectedCell.column === column) return true;
    if (selectedRange) {
      const inRange =
        column >=
          Math.min(selectedRange.from.column, selectedRange.to.column) &&
        column <= Math.max(selectedRange.from.column, selectedRange.to.column);

      return inRange;
    }
    return false;
  }

  // private getYCoordWithOffset(renderBox: RenderBox): number {
  //     const {y} = renderBox

  //     return y + this.root.toolbarHeight
  // }

  // private getXCoordWithOffset(renderBox: RenderBox): number {
  //     const {x} = renderBox

  //     return x
  // }

  private renderText(column: number, renderBox: RenderBox) {
    const { width, x } = renderBox;

    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "12px Arial";
    this.ctx.fillText(
      this.root.config.columns[column].title,
      x + width / 2 - this.root.viewport.left,
      0 + this.height / 2,
    );
  }

  private renderRect(column: number, renderBox: RenderBox) {
    const { width, x } = renderBox;

    const isColSelected = this.isColumnSelected(column);

    this.ctx.fillStyle = isColSelected ? "#c7ebff" : "white";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;

    const specialX = x - this.root.viewport.left;

    this.ctx.fillRect(specialX - 1, 0, width, this.height);
    this.ctx.strokeRect(specialX - 1, 0, width, this.height);
  }

  private renderSingleColumn(column: number) {
    const renderBox = new RenderBox(this.root.config, {
      row: 0,
      column: column,
    });

    this.renderRect(column, renderBox);
    this.renderText(column, renderBox);
  }

  public renderBar() {
    const lastColIdx = this.root.viewport.lastCol + 3;
    const firstColIdx = this.root.viewport.firstCol;

    this.ctx.beginPath();
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, this.height);
    this.ctx.closePath();
    this.ctx.stroke();

    for (let col = firstColIdx; col <= lastColIdx; col++) {
      if (!this.root.config.columns[col]) break;
      this.renderSingleColumn(col);
    }
  }
}

import Spreadsheet from "../main";
import { RenderBox } from "./renderBox";

export type CellConstructorProps = {
  value: string;
  displayValue: string;
  resultValue: string;
  position: Position;
  style: CellStyles | null;
};

interface CellStylesConstructorProps {
  fontSize: number;
  fontColor: string;
  background: string;
  borderColor: string;

  selectedBackground: string;
  selectedFontColor: string;
}

export class CellStyles {
  fontSize: number = 16;
  fontColor: string = "black";
  background: string = "white";
  borderColor: string = "black";

  selectedBackground = "#4287f5";
  selectedFontColor = "#ffffff";

  constructor(props?: CellStylesConstructorProps) {
    if (props) {
      Object.assign(this, props); // Override default styles
    }
  }
}

export class Position {
  row: number;
  column: number;
  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }
}

export class SerializableCell {
  value: string;
  displayValue: string;
  resultValue: string;
  position: Position;
  style: CellStyles | null;
  constructor(props: SerializableCell | SerializableCell) {
    this.value = props.value;
    this.displayValue = props.displayValue;
    this.resultValue = props.resultValue;
    this.position = props.position;
    this.style = props.style;
  }
}

export class Cell {
  /** True value (data) */
  value: string;
  /** Value to render */
  displayValue: string;
  /** This refers to the values that were obtained by calculations, for example, after calculating the formula  */
  resultValue: string;
  position: Position;
  style: CellStyles | null = null;

  constructor(props: CellConstructorProps) {
    this.value = props.value;
    this.displayValue = props.displayValue;
    this.resultValue = props.resultValue;
    this.position = props.position;
    this.style = props.style;
  }

  public getSerializableCell(): SerializableCell {
    const cell: SerializableCell = new SerializableCell({
      displayValue: this.displayValue,
      position: this.position,
      resultValue: this.resultValue,
      style: this.style,
      value: this.value,
    });
    return cell;
  }

  changeStyles(styles: CellStyles) {
    this.style = styles;
  }

  changeValues(values: Partial<Omit<CellConstructorProps, "position">>) {
    Object.assign(this, values);
  }

  private isCellInRange(root: Spreadsheet): boolean {
    const { column, row } = this.position;
    const { selectedRange } = root.selection;

    if (!selectedRange) return false;

    const isCellInRow =
      row >= Math.min(selectedRange.from.row, selectedRange.to.row) &&
      row <= Math.max(selectedRange.to.row, selectedRange.from.row);
    const isCellInCol =
      column >= Math.min(selectedRange.from.column, selectedRange.to.column) &&
      column <= Math.max(selectedRange.to.column, selectedRange.from.column);

    return isCellInCol && isCellInRow;
  }

  render(root: Spreadsheet) {
    const renderBox = new RenderBox(root.config, this.position);
    let {x, y} = renderBox
    const {height, width} = renderBox
    const { ctx } = root;

    const isCellSelected =
      root.selection.selectedCell?.row === this.position.row &&
      root.selection.selectedCell.column === this.position.column;
    const isCellInRange = this.isCellInRange(root);
    y -= root.viewport.top;
    x -= root.viewport.left;

    const styles = this.style ?? root.styles.cells;

    ctx.clearRect(x, y, width, height);
    ctx.fillStyle =
      isCellSelected || isCellInRange
        ? styles.selectedBackground
        : styles.background;
    ctx.strokeStyle = "black";
    ctx.fillRect(x, y, width - 1, height - 1);
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle =
      isCellSelected || isCellInRange
        ? styles.selectedFontColor
        : styles.fontColor;
    ctx.textAlign = "left";
    ctx.font = `${styles.fontSize}px Arial`;
    ctx.textBaseline = "middle";
    ctx.fillText(this.displayValue, x + 2, y + height / 2);
  }
}

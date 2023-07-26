import { Cell } from "./cell";
import { Column } from "./column";
import { Row } from "./row";
import { RangeSelectionType, Selection } from "./selection";

export interface ViewProperties {
  width: number;
  height: number;
}
export type CellClickEvent = (event: MouseEvent, cell: Cell) => void;
export type SelectionChangeEvent = (selection: Selection) => void;
export type CellChangeEvent = (cell: Cell) => void;
export type CopyEvent = (range: RangeSelectionType, data: Cell[][], dataAsString: string) => void

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
  onCopy?: CopyEvent | null
};

export type SheetConfigConstructorProps = {
  rows: Row[];
  columns: Column[];
};

export class Config {
  rows: Row[];
  columns: Column[];
  view: ViewProperties = {
    width: 800,
    height: 600,
  };

  onCellClick: CellClickEvent | null = null;
  onSelectonChange: SelectionChangeEvent | null = null;
  onCellChange: CellChangeEvent | null = null;
  onCopy: CopyEvent | null

  constructor(props: ConfigProperties) {
    this.columns = props.columns;
    this.rows = props.rows;
    this.view = props.view;

    this.onCellClick = props.onCellClick ?? null;
    this.onSelectonChange = props.onSelectionChange ?? null;
    this.onCellChange = props.onCellChange ?? null;
    this.onCopy = props.onCopy ?? null
  }
}

import { Cell } from "./cell";
import { Column } from "./column";
import { Row } from "./row";
import { Selection } from "./selection";

export interface ViewProperties {
  width: number;
  height: number;
}

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
  onCellClick?: ((event: MouseEvent, cell: Cell) => void) | null
  onSelectionChange?: ((selection: Selection) => void) | null
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

  onCellClick: ( (event: MouseEvent, cell: Cell) => void ) | null = null
  onSelectonChange: ((selection: Selection) => void) | null = null

  constructor(props: ConfigProperties) {
    this.columns = props.columns;
    this.rows = props.rows;
    this.view = props.view;

    this.onCellClick = props.onCellClick ?? null
    this.onSelectonChange = props.onSelectionChange ?? null
  }
}

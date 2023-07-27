export interface CachedColumnProperties {
  xPos: number;
  colIdx: number;
}

export class CachedColumn {
  xPos: number;
  colIdx: number;

  constructor(props: CachedColumnProperties) {
    this.xPos = props.xPos;
    this.colIdx = props.colIdx;
  }
}

export interface CachedRowProperties {
  yPos: number;
  rowIdx: number;
}

export class CachedRow {
  yPos: number;
  rowIdx: number;

  constructor(props: CachedRowProperties) {
    this.yPos = props.yPos;
    this.rowIdx = props.rowIdx;
  }
}

export interface CacheConstructorProps {
  columns: CachedColumn[];
  rows: CachedRow[];
}

export class Cache {
  public columns: CachedColumn[];
  public rows: CachedRow[];
  constructor(initial: CacheConstructorProps) {
    this.columns = initial.columns;
    this.rows = initial.rows;
  }

  public getRowByYCoord(y: number): number {
    let rowIdx = 0;
    for (let i = 0; i < this.rows.length; i++) {
      rowIdx = i
      if (y <= this.rows[i].yPos) {        //* Intersection detect
        break;
      }

    }

    return rowIdx;
  }

  public getColumnByXCoord(x: number): number {
    let colIdx = 0;
    for (let i = 0; i < this.columns.length; i++) {
      colIdx = i
      if (x <= this.columns[i].xPos) {        //* Intersection detect
        break;
      }
    }
    return colIdx;
  }
}

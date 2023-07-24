import { Cell } from "../modules/cell";
import { Config } from "../modules/config";
export declare function createSampleData(rows: number, columns: number, fillCellsByCoords?: boolean): Cell[][];
export declare function createSampleConfig(rows: number, columns: number): Config;
type SpreadsheetConfigAndDataReturnType = {
    config: Config;
    data: Cell[][];
};
export declare function makeSpreadsheetConfigAndData(rows: number, columns: number): SpreadsheetConfigAndDataReturnType;
export {};

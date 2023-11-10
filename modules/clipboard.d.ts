import Spreadsheet, { RangeSelectionType } from "../main";
import { Cell, Position } from "./cell";
export declare class Clipboard {
    saved: Cell[][] | null;
    root: Spreadsheet;
    constructor(root: Spreadsheet);
    copy(data: Cell[][], range: RangeSelectionType): void;
    paste(root: Spreadsheet, { column, row }: Position, event: ClipboardEvent): void;
}

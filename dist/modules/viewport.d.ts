import { Spreadsheet } from "../main";
export type ViewportConstructorProps = {
    top: number;
    left: number;
    right: number;
    bottom: number;
};
export declare class Viewport {
    root: Spreadsheet;
    top: number;
    left: number;
    right: number;
    bottom: number;
    firstRow: number;
    lastRow: number;
    firstCol: number;
    lastCol: number;
    constructor(root: Spreadsheet, props: ViewportConstructorProps);
    updateValues(props: ViewportConstructorProps): void;
    /** Get index of first row in viewport */
    private getFirstRow;
    private getLastRow;
    private getFirstCol;
    private getLastCol;
}

import Spreadsheet from "../main";
export declare class RowsBar {
    element: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    root: Spreadsheet;
    width: number;
    height: number;
    resizerHeight: number;
    constructor(root: Spreadsheet);
    private createElement;
    setElementPosition(top: number, left: number): void;
    private isRowSelected;
    private renderText;
    private renderRect;
    private renderSingleRow;
    renderBar(): void;
}

import Spreadsheet from "../main";
export declare class ColumnsBar {
    element: HTMLCanvasElement;
    private root;
    height: number;
    width: number;
    ctx: CanvasRenderingContext2D;
    constructor(root: Spreadsheet);
    private createElement;
    setElementPosition(top: number, left: number): void;
    private isColumnSelected;
    private renderText;
    private renderRect;
    private renderSingleColumn;
    renderBar(): void;
}

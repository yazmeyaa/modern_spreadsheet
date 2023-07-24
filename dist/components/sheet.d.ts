import { Spreadsheet } from "../main";
import { Position } from "../modules/cell";
/**
 * Display (CANVAS) element where cells render
 */
export declare class Sheet {
    element: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    root: Spreadsheet;
    constructor(root: Spreadsheet);
    getCellByCoords(x: number, y: number): Position;
    renderCell(position: Position): void;
    renderSheet(): void;
}

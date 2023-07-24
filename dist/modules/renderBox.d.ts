import { Position } from "./cell";
import { Config } from "./config";
export declare class RenderBox {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(config: Config, cellPosition: Position);
    private getXCoord;
    private getYCoord;
}

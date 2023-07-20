import { Position } from "./cell";
import { Config } from "./config";

export class RenderBox {
    x: number
    y: number
    width: number
    height: number
    constructor(config: Config, cellPosition: Position) {
        this.x = this.getXCoord(cellPosition.column, config)
        this.y = this.getYCoord(cellPosition.row, config)
        this.width = config.columns[cellPosition.column].width
        this.height = config.rows[cellPosition.row].height
    }

    private getXCoord(column: number, config: Config): number {
        let x = 0;

        for(let i = 0; i < column; i++) {
            x += config.columns[i].width
        }

        return x
    }

    private getYCoord(row: number, config: Config): number {
        let y = 0
        for(let i = 0; i < row; i++) {
            y += config.rows[i].height
        }
        return y
    }
}
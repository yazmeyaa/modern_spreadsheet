import { Config } from "./config"

export type CellConstructorProps = {
    value: string
    displayValue: string
    resultValue: string
    position: Position
}

export class Position {
    row: number
    column: number
    constructor(row: number, column: number) {
        this.row = row
        this.column = column
    }
}

export class Cell {
    value: string
    displayValue: string
    /** This refers to the values ​​​​that were obtained by calculations, for example, after calculating the formula  */
    resultValue: string
    position: Position
    constructor(props: CellConstructorProps) {
        this.value = props.value
        this.displayValue = props.displayValue
        this.resultValue = props.resultValue
        this.position = props.position
    }

    render(ctx: CanvasRenderingContext2D, config: Config) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, 20, 20)
    }
}
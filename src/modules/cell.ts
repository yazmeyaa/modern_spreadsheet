import { Spreadsheet } from "../main"
import { RenderBox } from "./renderBox"

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

    render(root: Spreadsheet) {
        let {height, width, x, y} = new RenderBox(root.config, this.position)
        const { ctx } = root

        y -= root.viewport.top
        x -= root.viewport.left

        ctx.clearRect(x, y, width, height)
        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'black'
        ctx.fillRect(x + 1, y + 1, width - 1, height - 1)
        ctx.strokeRect(x, y, width, height)

        ctx.fillStyle = 'black'
        ctx.textAlign = 'left'
        ctx.font = '16px Arial'
        ctx.textBaseline = 'middle'
        ctx.fillText(this.displayValue, x + 2, y + height / 2, width)
    }
}
import { Spreadsheet } from "../main"
import { RenderBox } from "./renderBox"

export type CellConstructorProps = {
    value: string
    displayValue: string
    resultValue: string
    position: Position
}

export class CellStyles {
    fontSize: number = 16
    fontColor: string = 'black'
    background: string = 'white'
    borderColor: string = 'black'

    selectedBackground = '#4287f5'
    selectedFontColor = '#ffffff'
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
    style: CellStyles = new CellStyles()

    constructor(props: CellConstructorProps) {
        this.value = props.value
        this.displayValue = props.displayValue
        this.resultValue = props.resultValue
        this.position = props.position
    }

    changeValues(values: Partial<Omit<CellConstructorProps, 'position'>>) {
        Object.assign(this, values)
    }

    private isCellInRange(root: Spreadsheet): boolean {
        const { column, row } = this.position
        const { selectedRange } = root.selection

        if (!selectedRange) return false;

        const isCellInRow = row >= Math.min(selectedRange.from.row, selectedRange.to.row) && row <= Math.max(selectedRange.to.row, selectedRange.from.row)
        const isCellInCol = column >= Math.min(selectedRange.from.column, selectedRange.to.column) && column <= Math.max(selectedRange.to.column, selectedRange.from.column)

        return isCellInCol && isCellInRow
    }

    render(root: Spreadsheet) {
        let { height, width, x, y } = new RenderBox(root.config, this.position)
        const { ctx } = root

        const isCellSelected = (root.selection.selectedCell?.row === this.position.row && root.selection.selectedCell.column === this.position.column)
        const isCellInRange = this.isCellInRange(root)
        y -= root.viewport.top
        x -= root.viewport.left

        ctx.clearRect(x, y, width, height)
        ctx.fillStyle = isCellSelected || isCellInRange ? this.style.selectedBackground : this.style.background
        ctx.strokeStyle = 'black'
        ctx.fillRect(x, y, width - 1, height - 1)
        ctx.strokeRect(x, y, width, height)

        ctx.fillStyle = isCellSelected || isCellInRange ? this.style.selectedFontColor : this.style.fontColor
        ctx.textAlign = 'left'
        ctx.font = `${this.style.fontSize}px Arial`
        ctx.textBaseline = 'middle'
        ctx.fillText(this.displayValue, x + 2, y + height / 2, width)
    }
}
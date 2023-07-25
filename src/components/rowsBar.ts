import Spreadsheet, { RenderBox } from "../main";

export class RowsBar {
    element: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    root: Spreadsheet
    width: number = 30
    height: number
    resizerHeight = 1
    constructor(root: Spreadsheet) {
        this.root = root
        this.element = this.createElement()
        const ctx = this.element.getContext('2d')
        if (!ctx) throw new Error("Enable hardware acceleration");
        this.ctx = ctx

        this.height = this.root.viewProps.height
    }

    private createElement() {
        const element = document.createElement('canvas')

        element.style.position = 'absolute'
        element.style.height = this.root.viewProps.height + 'px'
        element.style.width = this.width + 'px'
        element.style.display = 'block'


        element.width = this.width
        element.height = this.root.viewProps.height
        return element
    }

    public setElementPosition(top: number, left: number) {
        this.element.style.top = top + 'px'
        this.element.style.left = left + 'px'
    }

    private isRowSelected(row: number): boolean {
        const { selectedCell, selectedRange } = this.root.selection
        if (selectedCell && selectedCell.row === row) return true
        if (selectedRange) {
            const inRange =
                row >= Math.min(selectedRange.from.row, selectedRange.to.row) &&
                row <= Math.max(selectedRange.from.row, selectedRange.to.row)

            return inRange
        }
        return false
    }


    private renderText(row: number, renderBox: RenderBox) {
        const { y, height  } = renderBox

        this.ctx.fillStyle = 'black'
        this.ctx.textAlign = 'left'
        this.ctx.textBaseline = 'middle'
        this.ctx.font = '16px Arial'
        this.ctx.fillText(this.root.config.rows[row].title, 0 + 2, y - this.root.viewport.top + height / 2)
    }

    private renderRect(column: number, renderBox: RenderBox) {
        const { y, height } = renderBox


        const isRowSeleted = this.isRowSelected(column)

        this.ctx.fillStyle = isRowSeleted ? this.root.styles.cells.selectedBackground : 'white'
        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = this.resizerHeight
        this.ctx.fillRect(0 + 1, y - this.root.viewport.top, this.width + 1, height)
        this.ctx.strokeRect(0 + 1, y - this.root.viewport.top, this.width - 1, height)
    }

    private renderSingleRow(row: number) {
        const renderBox = new RenderBox(this.root.config, {
            column: 0,
            row: row
        })

        this.renderRect(row, renderBox)
        this.renderText(row, renderBox)
    }

    public renderBar() {
        const lastRowIdx = this.root.viewport.lastRow + 3;
        const firstRowIdx = this.root.viewport.firstRow;

        for (let col = firstRowIdx; col <= lastRowIdx; col++) {
            this.renderSingleRow(col)
            console.log(123)
        }
    }

}
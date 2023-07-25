import Spreadsheet, { RenderBox } from "../main"

export class ColumnsBar {
    public element: HTMLCanvasElement
    private root: Spreadsheet
    public height: number = 32
    public width: number
    private resizerWidth = 2
    ctx: CanvasRenderingContext2D

    constructor(root: Spreadsheet) {
        this.root = root
        this.element = this.createElement()
        const ctx = this.element.getContext('2d')
        if (!ctx) throw new Error("Enable hardware acceleration");
        this.ctx = ctx

        this.width = this.root.viewProps.width
    }

    private createElement(): HTMLCanvasElement {
        const element = document.createElement('canvas')
        element.style.position = 'absolute'
        element.style.top = '0'
        element.style.left = '0'
        element.style.height = this.height + 'px'
        element.style.width = this.root.viewProps.width + 'px'
        element.style.display = 'block'

        element.width = this.root.viewProps.width
        element.height = this.height
        return element
    }

    private isColumnSelected(column: number): boolean {
        const { selectedCell, selectedRange } = this.root.selection
        if (selectedCell && selectedCell.column === column) return true
        if (selectedRange) {
            const inRange =
                column >= Math.min(selectedRange.from.column, selectedRange.to.column) &&
                column <= Math.max(selectedRange.from.column, selectedRange.to.column)

            return inRange
        }
        return false
    }

    private renderText(column: number, renderBox: RenderBox) {
        const { width, x } = renderBox

        this.ctx.fillStyle = 'black'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.font = '16px Arial'
        this.ctx.fillText(this.root.config.columns[column].title, x + (width / 2) - this.root.viewport.left, 0 + this.height / 2)
    }

    private renderRect(column: number, renderBox: RenderBox) {
        const { width, x } = renderBox

        const { selectedCell } = this.root.selection

        const isColSelected = this.isColumnSelected(column)

        console.log(selectedCell)

        this.ctx.fillStyle = isColSelected ? this.root.styles.cells.selectedBackground : 'white'
        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = this.resizerWidth
        this.ctx.fillRect(x - this.root.viewport.left - 1, 1, width - 1, this.height - 1)
        this.ctx.strokeRect(x - this.root.viewport.left, 0, width, this.height)

    }

    private renderSingleColumn(column: number) {
        const renderBox = new RenderBox(this.root.config, {
            row: 0,
            column: column
        })

        this.renderRect(column, renderBox)
        this.renderText(column, renderBox)
    }

    public renderBar() {
        const lastColIdx = this.root.viewport.lastCol + 3;
        const firstColIdx = this.root.viewport.firstCol;

        for (let col = firstColIdx; col <= lastColIdx; col++) {
            this.renderSingleColumn(col)
        }
    }
}
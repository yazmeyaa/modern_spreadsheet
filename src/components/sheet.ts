import { Spreadsheet } from "../main"
import { Position } from "../modules/cell"

/**
 * Display (CANVAS) element where cells render
 */
export class Sheet {
    element: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    root: Spreadsheet
    constructor(root: Spreadsheet) {
        this.root = root
        const canvas = document.createElement('canvas')
        canvas.classList.add('sheet')

        //* Set up canvas sizes based on provided root config
        canvas.height = this.root.config.view.height
        canvas.width = this.root.config.view.width
        canvas.style.width = this.root.config.view.width + 'px'
        canvas.style.height = this.root.config.view.height + 'px'

        this.element = canvas

        const ctx = this.element.getContext('2d')
        if (!ctx) throw new Error('Enable hardware acceleration')
        this.ctx = ctx

    }

    getCellByCoords(x: number, y: number): Position {
        let row = 0;
        let height = 0
        while (height <= y) {
            height += this.root.config.rows[row].height
            if (height >= y) break;
            row++;
        }

        let col = 0;
        let width = 0;
        while (width <= x) {
            width += this.root.config.columns[col].width
            if (width >= x) break;
            col++;
        }

        return new Position(row, col)
    }

    renderCell(position: Position) {
        const { column, row } = position
        this.root.data[row][column].render(this.root)
    }

    renderSheet() {
        const firstRowIdx = this.root.viewport.firstRow
        const lastColIdx = this.root.viewport.lastCol + 3
        const lastRowIdx = this.root.viewport.lastRow + 3
        const firstColIdx = this.root.viewport.firstCol

        for (let row = firstRowIdx; row <= lastRowIdx; row++) {
            for (let col = firstColIdx; col <= lastColIdx; col++) {
                if (!this.root.config.columns[col] || !this.root.config.rows[row]) break;  //* Prevent read undefined

                this.renderCell({ column: col, row })
            }
        }

    }

}
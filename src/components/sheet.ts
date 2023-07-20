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
        if(!ctx) throw new Error('Enable hardware acceleration')
        this.ctx = ctx

    }

    renderCell(position: Position) {
        const {column, row} = position
        this.root.data[row][column].render(this.root)
    }

    renderSheet() {
        const {columns, rows} = this.root.config
        const lastColIdx = columns.length - 1
        const lastRowIdx = rows.length - 1

        for(let row = 0; row <= lastRowIdx; row++) {
            for(let col = 0; col <= lastColIdx; col++ ) {
                this.renderCell({column: col, row})
            }
        }
    }

}
import { Spreadsheet } from "../main"

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
        this.element = canvas

        const ctx = this.element.getContext('2d')
        if(!ctx) throw new Error('Enable hardware acceleration')
        this.ctx = ctx
    }

    renderSheet() {
        const {columns, rows} = this.root.config
        const lastColIdx = columns.length - 1
        const lastRowIdx = rows.length - 1

        for(let row = 0; row <= lastRowIdx; row++) {
            for(let col = 0; col <= lastColIdx; col++ ) {
                this.root.data[row][col].render(this.root.ctx, this.root.config)
            }
        }
    }
}
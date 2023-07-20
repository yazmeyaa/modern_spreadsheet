import { Spreadsheet } from "../main"

/**
 * Display (CANVAS) element where cells render
 */
export class Sheet {
    element: HTMLCanvasElement
    root: Spreadsheet
    constructor(root: Spreadsheet) {
        this.root = root
        const canvas = document.createElement('canvas')
        canvas.classList.add('sheet')
        this.element = canvas
    }
}

/**
 * Display (CANVAS) element where cells render
 */
export class Sheet {
    element: HTMLCanvasElement
    constructor() {
        const canvas = document.createElement('canvas')
        this.element = canvas
    }
}
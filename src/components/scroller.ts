import { Spreadsheet } from "../main"

export class Scroller {
    element: HTMLDivElement
    root: Spreadsheet
    constructor(root: Spreadsheet) {
        this.root = root
        const scroller = document.createElement('div')
        scroller.classList.add('scroller')
        this.element = scroller
    }
    setScrollerHeight(height: number) {
        this.element.style.height = height + 'px'
    }

    setScrollerWidth(width: number) {
        this.element.style.width = width + 'px'
    }
}
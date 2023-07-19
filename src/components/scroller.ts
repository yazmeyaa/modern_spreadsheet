import { Spreadsheet } from "../main"

export class Scroller {
    element: HTMLDivElement
    root: Spreadsheet
    constructor(root: Spreadsheet) {
        this.root = root
        const scroller = document.createElement('div')
        scroller.classList.add(this.root.cssPrefix + 'scroller')
        this.element = scroller
    }
}
import { Spreadsheet } from "../main"

/** Base (root) component */
export class Table {
    element: HTMLDivElement
    root: Spreadsheet
    constructor(root: Spreadsheet) {
        this.root = root
        const container = document.createElement('div')
        container.classList.add(this.root.cssPrefix + 'spreadsheet_container')
        this.element = container
    }
}
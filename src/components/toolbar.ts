import { Spreadsheet } from "../main"

export class Toolbar {
    element: HTMLDivElement
    root: Spreadsheet
    constructor(root: Spreadsheet) {
        this.root = root
        const toolbarElement = document.createElement('div')
        toolbarElement.classList.add(this.root.cssPrefix + 'toolbar')
        this.element = toolbarElement
    }
}
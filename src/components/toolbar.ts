import Spreadsheet from "../main"

export class Toolbar {
    element: HTMLDivElement
    root: Spreadsheet
    constructor(root: Spreadsheet) {
        this.root = root
        const toolbarElement = document.createElement('div')
        toolbarElement.classList.add('toolbar')
        this.element = toolbarElement
    }
}
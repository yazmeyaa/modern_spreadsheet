import Spreadsheet from "../main"

export class Header {
    element: HTMLHeadElement
    root: Spreadsheet
    constructor(root: Spreadsheet) {
        this.root = root
        const headerElement = document.createElement('header')
        headerElement.classList.add()
        this.element = headerElement
    }
}
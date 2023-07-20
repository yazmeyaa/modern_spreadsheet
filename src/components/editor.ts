import { Spreadsheet } from "../main";

export class Editor {
    element: HTMLInputElement
    root: Spreadsheet
    constructor(root: Spreadsheet) {
        this.root = root
        const element = document.createElement('input')
        this.element = element
        this.hide()
    }
    
    hide() {
        this.element.style.display = 'none'
    }
    show() {
        this.element.style.display = 'block'
    }
}
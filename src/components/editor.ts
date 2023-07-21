import { Spreadsheet } from "../main";
import { Position } from "../modules/cell";
import { RenderBox } from "../modules/renderBox";

export class Editor {
    element: HTMLInputElement
    root: Spreadsheet
    constructor(root: Spreadsheet) {
        this.root = root
        const element = document.createElement('input')
        element.classList.add('editor')
        this.element = element
        this.hide()
    }

    hide() {
        this.element.style.display = 'none'
        this.element.classList.add('hide')
        this.element.blur()
        window.removeEventListener('click', this.handleClickOutside)
        this.element.removeEventListener('keydown', this.handleKeydown)
        
        this.root.focusTable()
    }

    show(position: Position) {
        const { height, width, x, y } = new RenderBox(this.root.config, position);
        const cell = this.root.getCell(position)
        this.element.classList.remove('hide')

        this.element.style.top = (y - this.root.viewport.top) + 'px'
        this.element.style.left = (x - this.root.viewport.left) + 'px'
        this.element.style.width = width + 'px'
        this.element.style.height = height + 'px'
        this.element.style.display = 'block'

        window.addEventListener('click', this.handleClickOutside)
        this.element.addEventListener('keydown', this.handleKeydown)
        this.element.value = cell.value
        this.element.focus()
    }

    handleKeydown = (event: KeyboardEvent) =>  {
        const {key} = event
        
        switch(key) {
            case 'Escape': {
                this.hide();
                break;
            }
            case 'Enter': {
                this.root.changeCellValues(this.root.selection.selectedCell!, {
                    value: this.element.value,
                    displayValue: this.element.value
                })
                this.hide();
            }
        }
    }

    handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        if (!this.element.contains(target)) {
            this.hide()
        }
    }
}
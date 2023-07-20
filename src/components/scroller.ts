import { Spreadsheet } from "../main"

export class Scroller {
    element: HTMLDivElement
    private verticalScroller: HTMLDivElement
    private horizontalScroller: HTMLDivElement
    private root: Spreadsheet

    constructor(root: Spreadsheet) {
        this.root = root
        const {horizontalScroller, scroller, verticalScroller} = this.buildComponent()
        this.element = scroller
        this.verticalScroller = verticalScroller
        this.horizontalScroller = horizontalScroller

        this.element.style.height = this.root.config.view.height + 'px'
        this.element.style.width = this.root.config.view.width + 'px'

        this.updateScrollerSize()   //* Init size set
    }

    buildComponent() {
        const scroller = document.createElement('div')
        const verticalScroller = document.createElement('div')
        const horizontalScroller = document.createElement('div')
        const groupScrollers = document.createElement('div')
        const stack = document.createElement('div')

        verticalScroller.style.width = '0px'
        verticalScroller.style.pointerEvents = 'none'

        horizontalScroller.style.pointerEvents = 'none'
        
        groupScrollers.style.display = 'flex'

        stack.appendChild(verticalScroller)
        stack.appendChild(horizontalScroller)
        groupScrollers.appendChild(stack)
        this.verticalScroller = verticalScroller
        this.horizontalScroller  = horizontalScroller
        scroller.appendChild(groupScrollers)
        scroller.classList.add('scroller')

        return {scroller, verticalScroller, horizontalScroller}
    }

    getActualHeight() {
        return this.root.config.rows.reduce((acc, curr) => {
            acc += curr.height
            return acc
        }, 0)
    }

    getActualWidth() {
        return this.root.config.columns.reduce((acc, curr) => {
            acc += curr.width
            return acc
        }, 0)
    }

    updateScrollerSize() {
        const totalHeight = this.getActualHeight()
        const totalWidth = this.getActualWidth()

        this.setScrollerHeight(totalHeight)
        this.setScrollerWidth(totalWidth)
    }

    setScrollerHeight(height: number) {
        this.verticalScroller.style.height = height + 'px'
    }

    setScrollerWidth(width: number) {
        this.horizontalScroller.style.width = width + 'px'
    }
}
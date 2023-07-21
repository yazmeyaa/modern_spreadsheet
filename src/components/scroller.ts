import { Spreadsheet } from "../main"

export interface ViewportRect {
    top: number
    left: number
    right: number
    bottom: number
}

export class Scroller {
    element: HTMLDivElement
    private verticalScroller: HTMLDivElement
    private horizontalScroller: HTMLDivElement
    private root: Spreadsheet
    
    private isSelecting = false

    constructor(root: Spreadsheet) {
        this.root = root
        const { horizontalScroller, scroller, verticalScroller } = this.buildComponent()
        this.element = scroller
        this.verticalScroller = verticalScroller
        this.horizontalScroller = horizontalScroller

        this.element.style.height = this.root.config.view.height + 'px'
        this.element.style.width = this.root.config.view.width + 'px'

        this.updateScrollerSize()   //* Init size set

        this.element.addEventListener('scroll', this.handleScroll)

        this.element.addEventListener('mousedown', this.handleClick)
        this.element.addEventListener('mousemove', event => {
            if(!this.isSelecting) return;
            const {offsetX, offsetY} = event
            const lastSelectedCell = this.root.getCellByCoords(offsetX, offsetY)
            if(this.root.selection.selectedRange) {
                this.root.selection.selectedRange.to = lastSelectedCell
            }
            this.root.renderSheet()
        })
        this.element.addEventListener('mouseup', () => {
            this.isSelecting = false
            this.root.renderSheet()
        })
        this.element.addEventListener('dblclick', event => {
            event.preventDefault();
            const position = this.root.getCellByCoords(event.offsetX, event.offsetY)
            this.root.showEditor(position)
        })

    }

    private handleClick = (event: MouseEvent) => {
        if(event.button !== 0) return; // Left mouse button
        const {offsetX, offsetY} = event
        const clickedCell = this.root.getCellByCoords(offsetX, offsetY)
        this.isSelecting = true
        this.root.selection.selectedRange = {
            from: clickedCell,
            to: clickedCell
        }
        this.root.selection.selectedCell =  clickedCell

        this.root.renderSheet()
    }

    private handleScroll = () => {
        const rect = this.getViewportBoundlingRect()
        this.root.viewport.updateValues(rect)

        this.root.renderSheet()
    }

    public getViewportBoundlingRect(): ViewportRect {
        const { scrollTop, scrollLeft } = this.element
        const { height, width } = this.element.getBoundingClientRect()
        const bottom = scrollTop + height
        const right = scrollLeft + width

        return {
            top: scrollTop,
            left: scrollLeft,
            bottom,
            right
        }
    }

    private buildComponent() {
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
        this.horizontalScroller = horizontalScroller
        scroller.appendChild(groupScrollers)
        scroller.classList.add('scroller')

        return { scroller, verticalScroller, horizontalScroller }
    }

    private getActualHeight() {
        return this.root.config.rows.reduce((acc, curr) => {
            acc += curr.height
            return acc
        }, 0)
    }

    private getActualWidth() {
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

    private setScrollerHeight(height: number) {
        this.verticalScroller.style.height = height + 'px'
    }

    private setScrollerWidth(width: number) {
        this.horizontalScroller.style.width = width + 'px'
    }
}
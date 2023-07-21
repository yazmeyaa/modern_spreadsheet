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
        this.element.tabIndex = -1

        this.updateScrollerSize()   //* Init size set

        this.element.addEventListener('scroll', this.handleScroll)

        this.element.addEventListener('mousedown', this.handleClick)
        this.element.addEventListener('mousemove', this.handleMouseMove)
        this.element.addEventListener('mouseup', this.handleMouseUp)
        this.element.addEventListener('dblclick', this.handleDoubleClick)

        this.element.addEventListener('keydown', this.handleKeydown)
    }

    private handleMouseMove = (event: MouseEvent) => {
        if (!this.isSelecting) return;
        const { offsetX, offsetY } = event
        const lastSelectedCell = this.root.getCellByCoords(offsetX, offsetY)
        if (this.root.selection.selectedRange) {
            this.root.selection.selectedRange.to = lastSelectedCell
        }
        this.root.renderSheet()
    }

    private handleMouseUp = () => {
        this.isSelecting = false

        if (this.root.selection.selectedRange) {
            if (
                (this.root.selection.selectedRange.from.row === this.root.selection.selectedRange.to.row) &&
                (this.root.selection.selectedRange.from.column === this.root.selection.selectedRange.to.column)
            ) {
                this.root.selection.selectedRange = null
            }
        }

        this.root.renderSheet()
    }

    private handleDoubleClick = (event: MouseEvent) => {
        event.preventDefault();
        const position = this.root.getCellByCoords(event.offsetX, event.offsetY)
        this.root.showEditor(position)
    }

    private handleKeydown = (event: KeyboardEvent) => {
        console.log(event.key)
        //* Navigation
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
            event.preventDefault()
            this.root.selection.selectedRange = null
            switch (event.key) {
                case 'ArrowLeft': {
                    if (this.root.selection.selectedCell && this.root.selection.selectedCell.column > 0) {
                        console.log('tick')
                        this.root.selection.selectedCell.column -= 1
                        this.root.renderSheet()
                    }
                    break;
                }
                case 'ArrowRight': {
                    if (this.root.selection.selectedCell && this.root.selection.selectedCell.column < this.root.config.columns.length - 1) {
                        this.root.selection.selectedCell.column += 1
                        this.root.renderSheet()
                    }
                    break;
                }
                case 'ArrowUp': {
                    if (this.root.selection.selectedCell && this.root.selection.selectedCell.row > 0) {
                        this.root.selection.selectedCell.row -= 1
                        this.root.renderSheet()
                    }
                    break;
                }
                case 'ArrowDown': {
                    if (this.root.selection.selectedCell && this.root.selection.selectedCell.row < this.root.config.rows.length - 1) {
                        this.root.selection.selectedCell.row += 1
                        this.root.renderSheet()
                    }
                    break;
                }
            }
        }

        if (event.key === 'F2') {
            event.preventDefault()
            if (!this.root.selection.selectedCell) return;
            this.root.showEditor(this.root.selection.selectedCell)
        }

        if (event.key === 'Delete') {
            event.preventDefault()
            this.root.deleteSelectedCellsValues()
            this.root.renderSheet()
        }
    }

    private handleClick = (event: MouseEvent) => {
        if (event.button !== 0) return; // Left mouse button
        const { offsetX, offsetY } = event
        const clickedCell = this.root.getCellByCoords(offsetX, offsetY)
        this.isSelecting = true
        this.root.selection.selectedRange = {
            from: clickedCell,
            to: clickedCell
        }
        this.root.selection.selectedCell = clickedCell

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
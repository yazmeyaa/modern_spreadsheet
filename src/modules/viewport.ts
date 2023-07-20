import { Spreadsheet } from "../main"

export type ViewportConstructorProps = {
    top: number
    left: number
    right: number
    bottom: number
}

export class Viewport {
    root: Spreadsheet

    top: number
    left: number
    right: number
    bottom: number

    firstRow: number
    lastRow: number
    firstCol: number
    lastCol: number

    constructor(root: Spreadsheet, props: ViewportConstructorProps) {
        this.root = root

        this.top = props.top
        this.left = props.left
        this.right = props.right
        this.bottom = props.bottom

        this.firstRow = this.getFirstRow()
        this.lastCol = this.getFirstRow()   //!Temp
        this.firstCol = this.getFirstRow()  //!Temp
        this.lastRow = this.getLastRow()

        this.updateValues({
            top: 0,
            left: 0,
            right: this.root.viewProps.width,
            bottom: this.root.viewProps.height
        })
    }

    updateValues(props: ViewportConstructorProps) {
        this.top = props.top
        this.left = props.left
        this.right = props.right
        this.bottom = props.bottom

        this.firstRow = this.getFirstRow()
        this.lastRow = this.getLastRow()
        this.firstCol = this.getFirstCol()
        this.lastCol = this.getLastCol()

        console.log({ first: this.firstCol, last: this.lastCol })
    }

    /** Get index of first row in viewport */
    private getFirstRow(): number {
        let rowIdx = 0
        for (let idx = 0, currHeight = 0; currHeight <= this.top; idx++) {
            currHeight += this.root.config.rows[idx].height
            rowIdx = idx
        }
        return rowIdx
    }

    private getLastRow(): number {
        let rowIdx = this.getFirstRow()
        let height = this.top

        while (height <= this.bottom) {
            height += this.root.config.rows[rowIdx].height
            if (height >= this.bottom) break;
            rowIdx++;
        }

        return rowIdx
    }

    private getFirstCol(): number {
        let colIdx = 0;
        let currWidth = 0

        while (currWidth <= this.left) {
            currWidth += this.root.config.columns[colIdx].width
            if (currWidth >= this.left) break;
            colIdx += 1
        }

        return colIdx
    }

    private getLastCol(): number {
        let colIdx = this.getFirstCol()
        let width = this.left

        while (width <= this.right) {
            width += this.root.config.columns[colIdx].width
            if (width >= this.right) break;
            colIdx++;
        }

        return colIdx
    }

}
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
    }

    /** Get index of first row in viewport */
    private getFirstRow(): number {
        let rowIdx = this.root.cache.getRowByYCoord(this.top)
        return rowIdx
    }

    private getLastRow(): number {
        let rowIdx = this.root.cache.getRowByYCoord(this.bottom)
        return rowIdx
    }

    private getFirstCol(): number {
        let colIdx = this.root.cache.getColumnByXCoord(this.left)

        return colIdx
    }

    private getLastCol(): number {
        let colIdx = this.root.cache.getColumnByXCoord(this.right)

        return colIdx
    }

}
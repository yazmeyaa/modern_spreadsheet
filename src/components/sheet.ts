import { Spreadsheet } from "../main"
import { Column } from "../modules/column"
import { Row } from "../modules/row"

export type SheetConfigConstructorProps = {
    rows: Row[]
    columns: Column[]
}

export class SheetConfig {
    rows: Row[]
    columns: Column[]

    constructor(props: SheetConfigConstructorProps) {
        this.rows = props.rows
        this.columns = props.columns
    }
}

/**
 * Display (CANVAS) element where cells render
 */
export class Sheet {
    element: HTMLCanvasElement
    config: SheetConfig
    root: Spreadsheet
    constructor(root: Spreadsheet, sheetConfig: SheetConfig) {
        this.root = root
        const canvas = document.createElement('canvas')
        canvas.classList.add(this.root.cssPrefix + 'sheet')
        this.element = canvas
        this.config = new SheetConfig(sheetConfig)
    }
}
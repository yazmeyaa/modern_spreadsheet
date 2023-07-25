import { Editor } from "./components/editor";
import { Header } from "./components/header";
import { Scroller } from "./components/scroller";
import { Sheet } from "./components/sheet";
import { Table } from "./components/table";
import { Toolbar } from "./components/toolbar";
import { Cell, CellConstructorProps, CellStyles, Position, SerializableCell } from "./modules/cell";
import { Config, ViewProperties } from "./modules/config";
import { RangeSelectionType, Selection } from "./modules/selection";
import { Styles } from "./modules/styles";
import { Viewport } from "./modules/viewport";
import './scss/main.scss'
import { createSampleData } from "./utils/createData";
import { Cache, CachedColumn, CachedRow } from "./modules/cache";
import { Row } from "./modules/row";
import { Column } from "./modules/column";

/*
 ! Component structure
    <Table>
        <Toolbar />
        <Content>   //* Abstract
            <Header />
            <Sheet />
        </Content>
        <Scroller />
    </Table>
*/

interface SpreadsheetConstructorProperties {
    config?: Omit<Config, 'view'>   // Not optional.
    view?: ViewProperties
}

export const CSS_PREFIX = "modern_sc_"

export default class Spreadsheet {
    private table: Table
    private scroller: Scroller
    private toolbar: Toolbar
    private header: Header
    private sheet: Sheet
    private editor: Editor
    public styles: Styles
    public config: Config
    public data: Cell[][]
    public viewport: Viewport
    public selection: Selection
    public cache: Cache

    constructor(target: string | HTMLElement, props?: SpreadsheetConstructorProperties) {
        const data = createSampleData(40, 40)
        const config = this.makeConfigFromData(data, props?.view ?? { height: 600, width: 800 })
        if (props?.view) {
            config.view = props.view
        }

        this.config = new Config(config)
        this.sheet = new Sheet(this)

        this.table = new Table(this)
        this.scroller = new Scroller(this)
        this.toolbar = new Toolbar(this)
        this.header = new Header(this)
        this.editor = new Editor(this)
        this.cache = this.getInitialCache()
        this.viewport = new Viewport(this, this.scroller.getViewportBoundlingRect())
        this.selection = new Selection()


        this.data = data
        this.styles = new Styles()
        this.buildComponent()
        this.appendTableToTarget(target)
        this.renderSheet()
    }

    private getInitialCache(): Cache {
        const cachedCols: CachedColumn[] = []
        let currentWidth = 0
        for (let i = 0; i <= this.config.columns.length - 1; i++) {
            const col = this.config.columns[i]
            currentWidth += col.width
            const cacheCol = new CachedColumn({
                xPos: currentWidth,
                colIdx: i
            })
            cachedCols.push(cacheCol)
        }

        const cachedRows: CachedRow[] = []
        let currentHeight = 0
        for (let i = 0; i <= this.config.rows.length - 1; i++) {
            const row = this.config.rows[i]
            currentHeight += row.height
            const cacheRow = new CachedRow({
                yPos: currentHeight,
                rowIdx: i
            })
            cachedRows.push(cacheRow)
        }


        const cache = new Cache({
            columns: cachedCols,
            rows: cachedRows
        })

        console.log("CACHE: ", cache)
        console.log("CONFIG: ", this.config)
        return cache
    }

    private buildComponent(): void {

        const content = document.createElement('div')   //* Abstract
        content.appendChild(this.header.element)
        content.appendChild(this.sheet.element)

        content.classList.add(CSS_PREFIX + 'content')

        this.table.element.appendChild(this.toolbar.element)
        this.table.element.appendChild(content)
        this.table.element.appendChild(this.scroller.element)
        this.table.element.append(this.editor.element)
    }

    /**Destroy spreadsheet DOM element.
     * 
     * May be usefull when need to rerender component.
     */
    public destroy() {
        this.table.element.remove()
    }

    private appendTableToTarget(target: string | HTMLElement) {
        if (typeof target === 'string') {
            const element = document.querySelector(target)
            if (!element) throw new Error(`Element with selector ${target} is not finded in DOM.\n Make sure it exists.`)
            element?.appendChild(this.table.element)
        }
        if (target instanceof HTMLElement) {
            target.append(this.table.element)
        }
    }

    /** Canvas rendering context 2D. 
     * 
     * Abble to draw on canvas with default CanvasAPI methods
     */
    get ctx() {
        return this.sheet.ctx
    }

    get viewProps() {
        return this.config.view
    }

    /** Focusing on interactive part of spreadsheet */
    focusTable() {
        this.scroller.element.focus()
    }

    getCellByCoords(x: number, y: number) {
        return this.sheet.getCellByCoords(x, y)
    }

    getCell(position: Position): Cell {
        const { column, row } = position
        return this.data[row][column]
    }

    changeCellValues(position: Position, values: Partial<Omit<CellConstructorProps, 'position'>>) {
        const { column, row } = position

        this.data[row][column].changeValues(values)
        this.renderCell(row, column)
    }

    changeCellStyles(position: Position, styles: CellStyles) {
        const { column, row } = position
        this.data[row][column].changeStyles(styles)
        this.renderCell(row, column)
    }

    applyActionToRange(range: RangeSelectionType, callback: (cell: Cell) => any): void {
        const fromRow = Math.min(range.from.row, range.to.row)
        const toRow = Math.max(range.from.row, range.to.row)

        const fromCol = Math.min(range.from.column, range.to.column)
        const toCol = Math.max(range.from.column, range.to.column)

        for (let row = fromRow; row <= toRow; row++) {
            for (let col = fromCol; col <= toCol; col++) {
                const cell = this.data[row][col]
                callback(cell)
            }
        }
    }

    deleteSelectedCellsValues() {
        if (this.selection.selectedRange !== null) {

            this.applyActionToRange(this.selection.selectedRange, cell => {
                this.changeCellValues(cell.position, {
                    displayValue: '',
                    resultValue: '',
                    value: ''
                })
            })

        } else {
            if (!this.selection.selectedCell) return;
            this.changeCellValues(this.selection.selectedCell, {
                displayValue: '',
                resultValue: '',
                value: ''
            })
        }
    }

    showEditor(position: Position, initialString?: string) {
        this.editor.show(position, initialString)
    }

    renderSheet() {
        this.sheet.renderSheet()
    }

    renderCell(row: number, col: number) {
        this.data[row][col].render(this)
    }

    public loadData(data: Cell[][] | SerializableCell[][]): Spreadsheet {
        const rowsLength = data.length
        const colsLength = data[0] ? this.data[0].length : 0
        this.data = []

        const formattedData: Cell[][] = []

        for (let row = 0; row < rowsLength; row++) {
            const innerRow: Cell[] = []
            for (let col = 0; col < colsLength; col++) {
                const cell = data[row][col]
                innerRow.push(new Cell({
                    displayValue: cell.displayValue,
                    position: cell.position,
                    resultValue: cell.resultValue,
                    value: cell.value,
                    style: cell.style
                }))
            }
            formattedData.push(innerRow)
        }

        this.data = formattedData

        this.selection.selectedCell = null
        this.selection.selectedRange = null
        this.config = this.makeConfigFromData(formattedData, this.config.view)
        this.cache = this.getInitialCache()
        this.scroller.updateScrollerSize()
        this.viewport = new Viewport(this, this.scroller.getViewportBoundlingRect())
        this.renderSheet()

        return this
    }

    private makeConfigFromData(data: Cell[][], view: ViewProperties): Config {
        const lastRowIdx = data.length - 1
        const lastColIdx = data[0] ? data[0].length : 0

        const rows: Row[] = []
        for (let row = 0; row < lastRowIdx; row++) {
            rows.push(new Row({
                height: 40,
                title: String(row)
            }))
        }

        const columns: Column[] = []

        for (let col = 0; col < lastColIdx; col++) {
            columns.push(new Column({
                width: 150,
                title: String(col)
            }))
        }

        const config = new Config({
            view,
            rows,
            columns
        })

        return config
    }

    public serializeData(): SerializableCell[][] {
        const rowsLength = this.data.length
        const colsLength = this.data[0] ? this.data[0].length : 0

        const cellsArray: SerializableCell[][] = []

        for (let row = 0; row < rowsLength; row++) {
            const innerRow: SerializableCell[] = []
            for (let col = 0; col < colsLength; col++) {
                innerRow.push(this.data[row][col].getSerializableCell())
            }
            cellsArray.push(innerRow)
        }

        return cellsArray
    }
}

export * from './modules/cache'
export * from './modules/cell'
export * from './modules/column'
export * from './modules/config'
export * from './modules/renderBox'
export * from './modules/row'
export * from './modules/selection'
export * from './modules/styles'
export * from './modules/viewport'

export * from './utils/createData'
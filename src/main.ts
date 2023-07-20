import { Editor } from "./components/editor";
import { Header } from "./components/header";
import { Scroller } from "./components/scroller";
import { Sheet } from "./components/sheet";
import { Table } from "./components/table";
import { Toolbar } from "./components/toolbar";
import { Cell } from "./modules/cell";
import { Config, ConfigProperties } from "./modules/config";
import { Styles } from "./modules/styles";
import './scss/main.scss'
import { createSampleConfig, createSampleData, makeSpreadsheetConfigAndData } from "./utils/createData";

/*
 * Component structure
    <Table>
        <Toolbar />
        <Content>   //* Abstract
            <Header />
            <Sheet />
        </Content>
        <Scroller />
    </Table>
*/

export class Spreadsheet {
    private table: Table
    private scroller: Scroller
    private toolbar: Toolbar
    private header: Header
    private sheet: Sheet
    private editor: Editor
    public styles: Styles
    public config: Config
    public data: Cell[][]



    constructor(target: string | HTMLElement, config?: ConfigProperties) {
        const data = createSampleData(40, 40)
        this.data = data

        this.config = new Config(config ?? createSampleConfig(40, 40))

        this.styles = new Styles()

        this.table = new Table(this)
        this.scroller = new Scroller(this)
        this.toolbar = new Toolbar(this)
        this.header = new Header(this)
        this.sheet = new Sheet(this)
        this.editor = new Editor(this)

        this.buildComponent()
        this.appendTableToTarget(target)
    }

    private buildComponent(): void {
        const content = document.createElement('div')   //* Abstract
        content.classList.add('content')
        content.appendChild(this.header.element)
        content.appendChild(this.sheet.element)

        this.table.element.appendChild(this.toolbar.element)
        this.table.element.appendChild(content)
        this.table.element.appendChild(this.scroller.element)
        this.table.element.append(this.editor.element)
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

    get ctx() {
        return this.sheet.ctx
    }

    get viewProps() {
        return this.config.view
    }

    renderSheet() {
        this.sheet.renderSheet()
    }

    renderCell(row: number, col: number) {
        this.data[row][col].render(this.ctx, this.config)
    }
}



const spreadsheet = new Spreadsheet('#spreadsheet')
spreadsheet.renderSheet()
console.log(spreadsheet)

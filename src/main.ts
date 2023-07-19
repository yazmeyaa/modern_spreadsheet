import { Editor } from "./components/editor";
import { Header } from "./components/header";
import { Scroller } from "./components/scroller";
import { Sheet } from "./components/sheet";
import { Table } from "./components/table";
import { Toolbar } from "./components/toolbar";
// import { Viewport } from "./components/viewport";
import { Config, ConfigProperties } from "./modules/config";
import { Styles } from "./modules/styles";

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
    // private viewport: Viewport
    public styles: Styles
    private config: Config

    get cssPrefix() {
        return this.config.css_prefix
    }

    constructor(target: string | HTMLElement, config?: ConfigProperties) {
        this.config = new Config(config)
        this.styles = new Styles()

        this.table = new Table(this)
        this.scroller = new Scroller(this)
        this.toolbar = new Toolbar(this)
        this.header = new Header(this)
        this.sheet = new Sheet(this, {
            columns: [],
            rows: []
        })
        this.editor = new Editor(this)
        // this.viewport = new Viewport()

        this.buildComponent()
        this.appendTableToTarget(target)
    }

    private buildComponent(): void {
        const content = document.createElement('div')   //* Abstract
        content.classList.add(this.cssPrefix + 'content')
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
}

const spreadsheet = new Spreadsheet('#spreadsheet')
console.log(spreadsheet.cssPrefix)

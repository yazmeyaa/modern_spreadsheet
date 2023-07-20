import { Column } from "./column"
import { Row } from "./row"

export interface ViewProperties {
    width: number
    height: number
}

export type ConfigProperties = {
    /** Please, end it with '_' symbol. 
     * 
     * *Example:* 
     * 
     *      'test_'
     *      'google_' */
    rows: Row[]
    columns: Column[]
    view: ViewProperties
}


export type SheetConfigConstructorProps = {
    rows: Row[]
    columns: Column[]
}

export class Config {
    rows: Row[]
    columns: Column[]
    view: ViewProperties = {
        width: 800,
        height: 600,
    }
    constructor(props: ConfigProperties) {
            this.columns = props.columns
            this.rows = props.rows
            this.view = props.view
    }
}
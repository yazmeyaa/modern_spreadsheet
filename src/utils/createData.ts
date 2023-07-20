import { Cell } from "../modules/cell";
import { Column } from "../modules/column";
import { Config } from "../modules/config";
import { Row } from "../modules/row";

export function createSampleData(rows: number, columns: number): Cell[][] {
    const data: Cell[][] = []

    for (let row = 0; row <= rows; row++) {
        const innerRow: Cell[] = []
        for (let col = 0; col <= columns; col++) {
            const value = `${row}:${col}`

            const cell = new Cell({
                displayValue: value,
                resultValue: value,
                value,
                position: {
                    column: col,
                    row: row
                }
            })

            innerRow.push(cell)
        }
        data.push(innerRow)
    }
    return data
}

export function createSampleConfig(rows: number, columns: number): Config {

    const rowsArr: Row[] = []
    for(let i = 0; i <= rows; i++) {
        const rowItem = new Row({
            height: 40,
            title: String(i)
        })
        rowsArr.push(rowItem)
    }

    const colsArr: Column[] = []
    for(let i = 0; i <= columns; i++) {
        const colItem = new Column({
            title: String(i),
            width: 150
        })
        colsArr.push(colItem)
    }

    const config = new Config({
        columns: colsArr,
        rows: rowsArr,
        view: {
            height: 600,
            width: 800
        }
    })

    return config
}

type SpreadsheetConfigAndDataReturnType = {
    config: Config,
    data: Cell[][]
}

export function makeSpreadsheetConfigAndData(rows: number, columns: number): SpreadsheetConfigAndDataReturnType {
    const data = createSampleData(rows, columns)
    const config = createSampleConfig(rows, columns)

    return {data, config}
}
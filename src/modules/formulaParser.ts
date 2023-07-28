import Parser, { DepParser } from 'fast-formula-parser'
import Spreadsheet from '../main'

export class FormulaParser {
    parser: Parser
    depParser: DepParser
    root: Spreadsheet
    constructor(root: Spreadsheet) {
        this.root = root

        this.parser = new Parser({
            onCell: ({col, row}) => {
                const cell = this.root.data[row - 1][col - 1]
                const cellValue = cell.resultValue.length > 0 ? cell.resultValue : cell.value
                if( cellValue &&  isNaN(Number(cellValue)) === false) return Number(cellValue)
                return this.root.data[row - 1][col - 1].resultValue ?? ''
            },
        })

        this.depParser = new DepParser({})
        this.depParser
    }
}
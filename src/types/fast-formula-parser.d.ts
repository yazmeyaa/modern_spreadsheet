declare module 'fast-formula-parser' {
    export type PositionWithSheet = {
        sheet?: string
        row: number
        col: number
    }

    export type FunctionArgument = {
        isArray: boolean
        isCellRef: boolean
        isRangeRef: boolean
        value: string | number
    }

    export type Position = {
        col: number
        row: number
    }

    export type RangeReference = {
        sheet?: string
        from: Position,
        to: Position
    }

    export type Config = {
        functions?: Record<string, (...args: FunctionArgument[]) => string>
        functionsNeedContext?: (context: Parser, ...args: FunctionArgument[]) => string
        onCell?: (position: PositionWithSheet) => number | string
        onRange?: (ref) => Array<string|number>[]
        onVariable?: (name: string, sheetName: string) => RangeReference
    }

    export const Types = {
        NUMBER: 0,
        ARRAY: 1,
        BOOLEAN: 2,
        STRING: 3,
        RANGE_REF: 4, // can be 'A:C' or '1:4', not only 'A1:C3'
        CELL_REF: 5,
        COLLECTIONS: 6, // Unions of references
        NUMBER_NO_BOOLEAN: 10,
    };

    export const Factorials: number[]

    export default class Parser {
        constructor(config: Config)
        parse: (expression: string, position: PositionWithSheet) => string
        parseAsync: (expression: string, position: PositionWithSheet) => Promise<string>

    }


    type FormulaHelpersType = {
        accept: (param: FunctionArgument, type?: number, defValue?: number | string, flat?: boolean, allowSingleValue?: boolean) => number | string
        type: (variable) => number
        isRangeRef: (param) => boolean
        isCellRef: (param) => boolean 
    }

    export class DepParser {
        constructor(config?: {onVariable?: (name: string, sheetName: string) => RangeReference})
        parse(expression: string, position: PositionWithSheet): PositionWithSheet[]
    }

    export const FormulaHelpers: FormulaHelpersType
}
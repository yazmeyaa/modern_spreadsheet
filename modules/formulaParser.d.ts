import Parser, { DepParser } from 'fast-formula-parser';
import Spreadsheet from '../main';
export declare class FormulaParser {
    parser: Parser;
    depParser: DepParser;
    root: Spreadsheet;
    constructor(root: Spreadsheet);
}

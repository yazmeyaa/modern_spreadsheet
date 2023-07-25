import Spreadsheet from "../main";
export type CellConstructorProps = {
    value: string;
    displayValue: string;
    resultValue: string;
    position: Position;
};
interface CellStylesConstructorProps {
    fontSize: number;
    fontColor: string;
    background: string;
    borderColor: string;
    selectedBackground: string;
    selectedFontColor: string;
}
export declare class CellStyles {
    fontSize: number;
    fontColor: string;
    background: string;
    borderColor: string;
    selectedBackground: string;
    selectedFontColor: string;
    constructor(props?: CellStylesConstructorProps);
}
export declare class Position {
    row: number;
    column: number;
    constructor(row: number, column: number);
}
export declare class Cell {
    value: string;
    displayValue: string;
    /** This refers to the values ​​​​that were obtained by calculations, for example, after calculating the formula  */
    resultValue: string;
    position: Position;
    style: CellStyles;
    constructor(props: CellConstructorProps);
    changeValues(values: Partial<Omit<CellConstructorProps, 'position'>>): void;
    private isCellInRange;
    render(root: Spreadsheet): void;
}
export {};

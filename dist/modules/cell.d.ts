import Spreadsheet from "../main";
export type CellConstructorProps = {
    value: string;
    displayValue: string;
    resultValue: string;
    position: Position;
    style: CellStyles | null;
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
export declare class SerializableCell {
    value: string;
    displayValue: string;
    resultValue: string;
    position: Position;
    style: CellStyles | null;
    constructor(props: SerializableCell | SerializableCell);
}
export declare class Cell {
    /** True value (data) */
    value: string;
    /** Value to render */
    displayValue: string;
    /** This refers to the values that were obtained by calculations, for example, after calculating the formula  */
    resultValue: string;
    position: Position;
    style: CellStyles | null;
    constructor(props: CellConstructorProps);
    getSerializableCell(): SerializableCell;
    changeStyles(styles: CellStyles): void;
    changeValues(values: Partial<Omit<CellConstructorProps, "position">>): void;
    render(root: Spreadsheet): void;
}
export {};

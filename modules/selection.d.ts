export type BaseSelectionType = {
    row: number;
    column: number;
};
export type RangeSelectionType = {
    from: BaseSelectionType;
    to: BaseSelectionType;
};
export declare class Selection {
    selectedCell: BaseSelectionType | null;
    selectedRange: RangeSelectionType | null;
}

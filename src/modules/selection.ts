export type BaseSelectionType = {
    row: number
    column: number
}

export type RangeSelectionType = {
    from: BaseSelectionType
    to: BaseSelectionType
}

export class Selection {
    selectedCell: BaseSelectionType | null = null
    selectedRange: RangeSelectionType | null = null
}
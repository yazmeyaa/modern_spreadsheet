import { BaseSelectionType, RangeSelectionType } from "../main";

export function checkEqualRanges(
  range1: RangeSelectionType,
  range2: RangeSelectionType,
) {
  const equalRows = range1.from.row === range2.to.row;
  const equalColumns = range1.from.column === range2.to.column;

  return equalRows && equalColumns;
}

export function checkEqualCellSelections(
  selection1: BaseSelectionType,
  selection2: BaseSelectionType,
) {
  return (
    selection1.column === selection2.column && selection1.row === selection2.row
  );
}

import Spreadsheet from "../main";
import { Position } from "../modules/cell";
export declare class Editor {
    element: HTMLInputElement;
    root: Spreadsheet;
    constructor(root: Spreadsheet);
    hide(): void;
    show(position: Position, initialString?: string): void;
    handleKeydown: (event: KeyboardEvent) => void;
    handleClickOutside: (event: MouseEvent) => void;
}

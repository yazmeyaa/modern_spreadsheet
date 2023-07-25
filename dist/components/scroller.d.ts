import Spreadsheet from "../main";
export interface ViewportRect {
    top: number;
    left: number;
    right: number;
    bottom: number;
}
export declare class Scroller {
    element: HTMLDivElement;
    private verticalScroller;
    private horizontalScroller;
    private root;
    private isSelecting;
    constructor(root: Spreadsheet);
    private handleMouseMove;
    private handleMouseUp;
    private handleDoubleClick;
    private handleKeydown;
    private handleClick;
    private handleScroll;
    getViewportBoundlingRect(): ViewportRect;
    private buildComponent;
    private getActualHeight;
    private getActualWidth;
    updateScrollerSize(): void;
    private setScrollerHeight;
    private setScrollerWidth;
}

import { Spreadsheet } from "../main";
import { ViewProperties } from "../modules/config";
/** Base (root) component */
export declare class Table {
    element: HTMLDivElement;
    root: Spreadsheet;
    constructor(root: Spreadsheet);
    changeElementSizes(sizes: ViewProperties): void;
}

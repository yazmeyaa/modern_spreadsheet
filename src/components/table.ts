import Spreadsheet, { CSS_PREFIX } from "../main";
import { ViewProperties } from "../modules/config";

/** Base (root) component */
export class Table {
  element: HTMLDivElement;
  root: Spreadsheet;
  constructor(root: Spreadsheet) {
    this.root = root;
    const container = document.createElement("div");
    container.classList.add(CSS_PREFIX + "spreadsheet_container");
    this.element = container;

    this.changeElementSizes(this.root.viewProps);
  }

  changeElementSizes(sizes: ViewProperties) {
    const { height, width } = sizes;
    this.element.style.width = width + "px";
    this.element.style.height = height + "px";
  }
}

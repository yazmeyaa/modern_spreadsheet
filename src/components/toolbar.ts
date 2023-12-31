import Spreadsheet, { CSS_PREFIX } from "../main";

export class Toolbar {
  element: HTMLDivElement;
  root: Spreadsheet;
  height: number = 0;
  constructor(root: Spreadsheet) {
    this.root = root;
    const toolbarElement = document.createElement("div");
    toolbarElement.classList.add(CSS_PREFIX + "toolbar");
    this.element = toolbarElement;
  }
}

import Spreadsheet, { CSS_PREFIX } from "../main";
import { Position } from "../modules/cell";
import { EventTypes } from "../modules/events";
import { RenderBox } from "../modules/renderBox";

export class Editor {
  element: HTMLInputElement;
  root: Spreadsheet;
  constructor(root: Spreadsheet) {
    this.root = root;
    const element = document.createElement("input");
    element.classList.add(CSS_PREFIX + "editor");
    this.element = element;
    this.hide();
  }

  hide() {
    this.element.style.display = "none";
    this.element.classList.add("hide");
    this.element.blur();
    window.removeEventListener("click", this.handleClickOutside);
    this.element.removeEventListener("keydown", this.handleKeydown);

    this.root.focusTable();
  }

  show(position: Position, initialString?: string) {
    const { height, width, x, y } = new RenderBox(this.root.config, position);
    const cell = this.root.getCell(position);
    this.element.classList.remove("hide");

    this.element.style.top =
      y - this.root.viewport.top + this.root.columnsBarHeight + "px";
    this.element.style.left =
      x - this.root.viewport.left + this.root.rowsBarWidth + "px";
    this.element.style.width = width + "px";
    this.element.style.height = height + "px";
    this.element.style.display = "block";

    window.addEventListener("click", this.handleClickOutside);
    this.element.addEventListener("keydown", this.handleKeydown);
    this.element.value = initialString ? initialString : cell.value;
    this.element.focus();
    if (!initialString) this.element.select();
  }

  handleKeydown = (event: KeyboardEvent) => {
    const { key } = event;

    switch (key) {
      case "Escape": {
        this.hide();
        break;
      }
      case "Enter": {
        if (!this.root.selection.selectedCell) return;

        this.root.changeCellValues(this.root.selection.selectedCell, {
          value: this.element.value,
          displayValue: this.element.value,
        });

        this.root.events.dispatch({
          type: EventTypes.CELL_CHANGE,
          cell: this.root.getCell(this.root.selection.selectedCell),
        });

        this.hide();
        this.root.renderSelection()
      }
    }
  };

  handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!this.element.contains(target)) {
      this.hide();
    }
  };
}

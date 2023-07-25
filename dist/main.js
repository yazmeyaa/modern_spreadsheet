var R = Object.defineProperty;
var v = (n, t, e) => t in n ? R(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var s = (n, t, e) => (v(n, typeof t != "symbol" ? t + "" : t, e), e);
class w {
  constructor(t, e) {
    s(this, "x");
    s(this, "y");
    s(this, "width");
    s(this, "height");
    this.x = this.getXCoord(e.column, t), this.y = this.getYCoord(e.row, t), this.width = t.columns[e.column].width, this.height = t.rows[e.row].height;
  }
  getXCoord(t, e) {
    let o = 0;
    for (let i = 0; i < t; i++)
      o += e.columns[i].width;
    return o;
  }
  getYCoord(t, e) {
    let o = 0;
    for (let i = 0; i < t; i++)
      o += e.rows[i].height;
    return o;
  }
}
class S {
  constructor(t) {
    s(this, "element");
    s(this, "root");
    s(this, "handleKeydown", (t) => {
      const { key: e } = t;
      switch (e) {
        case "Escape": {
          this.hide();
          break;
        }
        case "Enter":
          this.root.changeCellValues(this.root.selection.selectedCell, {
            value: this.element.value,
            displayValue: this.element.value
          }), this.hide();
      }
    });
    s(this, "handleClickOutside", (t) => {
      const e = t.target;
      this.element.contains(e) || this.hide();
    });
    this.root = t;
    const e = document.createElement("input");
    e.classList.add(a + "editor"), this.element = e, this.hide();
  }
  hide() {
    this.element.style.display = "none", this.element.classList.add("hide"), this.element.blur(), window.removeEventListener("click", this.handleClickOutside), this.element.removeEventListener("keydown", this.handleKeydown), this.root.focusTable();
  }
  show(t, e) {
    const { height: o, width: i, x: r, y: l } = new w(this.root.config, t), h = this.root.getCell(t);
    this.element.classList.remove("hide"), this.element.style.top = l - this.root.viewport.top + this.root.columnsBarHeight + "px", this.element.style.left = r - this.root.viewport.left + this.root.rowsBarWidth + "px", this.element.style.width = i + "px", this.element.style.height = o + "px", this.element.style.display = "block", window.addEventListener("click", this.handleClickOutside), this.element.addEventListener("keydown", this.handleKeydown), this.element.value = e || h.value, this.element.focus(), e || this.element.select();
  }
}
class b {
  constructor(t) {
    s(this, "element");
    s(this, "verticalScroller");
    s(this, "horizontalScroller");
    s(this, "root");
    s(this, "isSelecting", !1);
    s(this, "handleMouseMove", (t) => {
      if (!this.isSelecting)
        return;
      const { offsetX: e, offsetY: o } = t, i = this.root.getCellByCoords(e, o);
      this.root.selection.selectedRange && (this.root.selection.selectedRange.to = i), this.root.renderSheet(), this.root.renderColumnsBar(), this.root.renderRowsBar();
    });
    s(this, "handleMouseUp", () => {
      this.isSelecting = !1, this.root.selection.selectedRange && this.root.selection.selectedRange.from.row === this.root.selection.selectedRange.to.row && this.root.selection.selectedRange.from.column === this.root.selection.selectedRange.to.column && (this.root.selection.selectedRange = null), this.root.renderSheet(), this.root.renderColumnsBar(), this.root.renderRowsBar();
    });
    s(this, "handleDoubleClick", (t) => {
      t.preventDefault();
      const e = this.root.getCellByCoords(t.offsetX, t.offsetY);
      this.root.showEditor(e);
    });
    s(this, "handleKeydown", (t) => {
      if (console.log(t), ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(t.key))
        switch (t.preventDefault(), this.root.selection.selectedRange = null, t.key) {
          case "ArrowLeft": {
            this.root.selection.selectedCell && this.root.selection.selectedCell.column > 0 && (console.log("tick"), this.root.selection.selectedCell.column -= 1, this.root.renderSheet());
            break;
          }
          case "ArrowRight": {
            this.root.selection.selectedCell && this.root.selection.selectedCell.column < this.root.config.columns.length - 1 && (this.root.selection.selectedCell.column += 1, this.root.renderSheet());
            break;
          }
          case "ArrowUp": {
            this.root.selection.selectedCell && this.root.selection.selectedCell.row > 0 && (this.root.selection.selectedCell.row -= 1, this.root.renderSheet());
            break;
          }
          case "ArrowDown": {
            this.root.selection.selectedCell && this.root.selection.selectedCell.row < this.root.config.rows.length - 1 && (this.root.selection.selectedCell.row += 1, this.root.renderSheet());
            break;
          }
        }
      const e = /^([a-z]|[а-я])$/;
      if (!t.metaKey && !t.ctrlKey) {
        const o = e.test(t.key.toLowerCase());
        if (t.key === "F2" || o) {
          if (t.preventDefault(), !this.root.selection.selectedCell)
            return;
          this.root.showEditor(this.root.selection.selectedCell, o ? t.key : void 0);
        }
      }
      t.key === "Delete" && (t.preventDefault(), this.root.deleteSelectedCellsValues(), this.root.renderSheet());
    });
    s(this, "handleClick", (t) => {
      if (t.button !== 0)
        return;
      const { offsetX: e, offsetY: o } = t, i = this.root.getCellByCoords(e, o);
      this.isSelecting = !0, this.root.selection.selectedRange = {
        from: i,
        to: i
      }, this.root.selection.selectedCell = i, this.root.renderSheet(), this.root.renderColumnsBar(), this.root.renderRowsBar();
    });
    s(this, "handleScroll", () => {
      const t = this.getViewportBoundlingRect();
      this.root.viewport.updateValues(t), this.root.renderSheet(), this.root.renderColumnsBar(), this.root.renderRowsBar();
    });
    this.root = t;
    const { horizontalScroller: e, scroller: o, verticalScroller: i } = this.buildComponent();
    this.element = o, this.verticalScroller = i, this.horizontalScroller = e, this.element.style.height = this.root.config.view.height + "px", this.element.style.width = this.root.config.view.width + "px", this.element.style.top = this.root.columnsBarHeight + "px", this.element.style.left = this.root.rowsBarWidth + "px", this.element.tabIndex = -1, this.updateScrollerSize(), this.element.addEventListener("scroll", this.handleScroll), this.element.addEventListener("mousedown", this.handleClick), this.element.addEventListener("mousemove", this.handleMouseMove), this.element.addEventListener("mouseup", this.handleMouseUp), this.element.addEventListener("dblclick", this.handleDoubleClick), this.element.addEventListener("keydown", this.handleKeydown);
  }
  getViewportBoundlingRect() {
    const { scrollTop: t, scrollLeft: e } = this.element, { height: o, width: i } = this.element.getBoundingClientRect(), r = t + o, l = e + i;
    return {
      top: t,
      left: e,
      bottom: r,
      right: l
    };
  }
  buildComponent() {
    const t = document.createElement("div"), e = document.createElement("div"), o = document.createElement("div"), i = document.createElement("div"), r = document.createElement("div");
    return e.style.width = "0px", e.style.pointerEvents = "none", o.style.pointerEvents = "none", i.style.display = "flex", r.appendChild(e), r.appendChild(o), i.appendChild(r), this.verticalScroller = e, this.horizontalScroller = o, t.appendChild(i), t.classList.add(a + "scroller"), { scroller: t, verticalScroller: e, horizontalScroller: o };
  }
  getActualHeight() {
    return this.root.config.rows.reduce((t, e) => (t += e.height, t), 0);
  }
  getActualWidth() {
    return this.root.config.columns.reduce((t, e) => (t += e.width, t), 0);
  }
  updateScrollerSize() {
    const t = this.getActualHeight(), e = this.getActualWidth();
    this.setScrollerHeight(t), this.setScrollerWidth(e);
  }
  setScrollerHeight(t) {
    this.verticalScroller.style.height = t + "px";
  }
  setScrollerWidth(t) {
    this.horizontalScroller.style.width = t + "px";
  }
}
class B {
  constructor(t) {
    s(this, "fontSize", 16);
    s(this, "fontColor", "black");
    s(this, "background", "white");
    s(this, "borderColor", "black");
    s(this, "selectedBackground", "#4287f5");
    s(this, "selectedFontColor", "#ffffff");
    t && Object.assign(this, t);
  }
}
class k {
  constructor(t, e) {
    s(this, "row");
    s(this, "column");
    this.row = t, this.column = e;
  }
}
class E {
  constructor(t) {
    s(this, "value");
    s(this, "displayValue");
    s(this, "resultValue");
    s(this, "position");
    s(this, "style");
    this.value = t.value, this.displayValue = t.displayValue, this.resultValue = t.resultValue, this.position = t.position, this.style = t.style;
  }
}
class C {
  constructor(t) {
    /** True value (data) */
    s(this, "value");
    /** Value to render */
    s(this, "displayValue");
    /** This refers to the values that were obtained by calculations, for example, after calculating the formula  */
    s(this, "resultValue");
    s(this, "position");
    s(this, "style", null);
    this.value = t.value, this.displayValue = t.displayValue, this.resultValue = t.resultValue, this.position = t.position, this.style = t.style;
  }
  getSerializableCell() {
    return new E({
      displayValue: this.displayValue,
      position: this.position,
      resultValue: this.resultValue,
      style: this.style,
      value: this.value
    });
  }
  changeStyles(t) {
    this.style = t;
  }
  changeValues(t) {
    Object.assign(this, t);
  }
  isCellInRange(t) {
    const { column: e, row: o } = this.position, { selectedRange: i } = t.selection;
    if (!i)
      return !1;
    const r = o >= Math.min(i.from.row, i.to.row) && o <= Math.max(i.to.row, i.from.row);
    return e >= Math.min(i.from.column, i.to.column) && e <= Math.max(i.to.column, i.from.column) && r;
  }
  render(t) {
    var g;
    const e = new w(t.config, this.position);
    let { x: o, y: i } = e;
    const { height: r, width: l } = e, { ctx: h } = t, c = ((g = t.selection.selectedCell) == null ? void 0 : g.row) === this.position.row && t.selection.selectedCell.column === this.position.column, u = this.isCellInRange(t);
    i -= t.viewport.top, o -= t.viewport.left;
    const d = this.style ?? t.styles.cells;
    h.clearRect(o, i, l, r), h.fillStyle = c || u ? d.selectedBackground : d.background, h.strokeStyle = "black", h.fillRect(o, i, l - 1, r - 1), h.strokeRect(o, i, l, r), h.fillStyle = c || u ? d.selectedFontColor : d.fontColor, h.textAlign = "left", h.font = `${d.fontSize}px Arial`, h.textBaseline = "middle", h.fillText(this.displayValue, o + 2, i + r / 2);
  }
}
class V {
  constructor(t) {
    s(this, "element");
    s(this, "ctx");
    s(this, "root");
    this.root = t;
    const e = document.createElement("canvas");
    e.classList.add(a + "sheet"), e.height = this.root.config.view.height, e.width = this.root.config.view.width, e.style.width = this.root.config.view.width + "px", e.style.height = this.root.config.view.height + "px", e.style.left = "0px", this.element = e;
    const o = this.element.getContext("2d");
    if (!o)
      throw new Error("Enable hardware acceleration");
    this.ctx = o;
  }
  getCellByCoords(t, e) {
    let o = 0, i = 0;
    for (; i <= e && (i += this.root.config.rows[o].height, !(i >= e)); )
      o++;
    let r = 0, l = 0;
    for (; l <= t && (l += this.root.config.columns[r].width, !(l >= t)); )
      r++;
    return new k(o, r);
  }
  renderCell(t) {
    const { column: e, row: o } = t;
    this.root.data[o][e].render(this.root);
  }
  renderSheet() {
    const t = this.root.viewport.firstRow, e = this.root.viewport.lastCol + 3, o = this.root.viewport.lastRow + 3, i = this.root.viewport.firstCol;
    for (let r = t; r <= o; r++)
      for (let l = i; l <= e && !(!this.root.config.columns[l] || !this.root.config.rows[r]); l++)
        this.renderCell({ column: l, row: r });
  }
}
class I {
  constructor(t) {
    s(this, "element");
    s(this, "root");
    this.root = t;
    const e = document.createElement("div");
    e.classList.add(a + "spreadsheet_container"), this.element = e, this.changeElementSizes(this.root.viewProps);
  }
  changeElementSizes(t) {
    const { height: e, width: o } = t;
    this.element.style.width = o + this.root.rowsBarWidth + "px", this.element.style.height = e + this.root.columnsBarHeight + "px";
  }
}
class L {
  constructor(t) {
    s(this, "element");
    s(this, "root");
    s(this, "height", 0);
    this.root = t;
    const e = document.createElement("div");
    e.classList.add(a + "toolbar"), this.element = e;
  }
}
class m {
  constructor(t) {
    s(this, "rows");
    s(this, "columns");
    s(this, "view", {
      width: 800,
      height: 600
    });
    this.columns = t.columns, this.rows = t.rows, this.view = t.view;
  }
}
class P {
  constructor() {
    s(this, "selectedCell", null);
    s(this, "selectedRange", null);
  }
}
class T {
  constructor() {
    s(this, "cells");
    this.cells = new B();
  }
}
class f {
  constructor(t, e) {
    s(this, "root");
    s(this, "top");
    s(this, "left");
    s(this, "right");
    s(this, "bottom");
    s(this, "firstRow");
    s(this, "lastRow");
    s(this, "firstCol");
    s(this, "lastCol");
    this.root = t, this.top = e.top, this.left = e.left, this.right = e.right, this.bottom = e.bottom, this.firstRow = this.getFirstRow(), this.lastCol = this.getFirstRow();
    //!Temp
    this.firstCol = this.getFirstRow();
    //!Temp
    this.lastRow = this.getLastRow(), this.updateValues({
      top: 0,
      left: 0,
      right: this.root.viewProps.width,
      bottom: this.root.viewProps.height
    });
  }
  updateValues(t) {
    this.top = t.top, this.left = t.left, this.right = t.right, this.bottom = t.bottom, this.firstRow = this.getFirstRow(), this.lastRow = this.getLastRow(), this.firstCol = this.getFirstCol(), this.lastCol = this.getLastCol();
  }
  /** Get index of first row in viewport */
  getFirstRow() {
    return this.root.cache.getRowByYCoord(this.top);
  }
  getLastRow() {
    return this.root.cache.getRowByYCoord(this.bottom);
  }
  getFirstCol() {
    return this.root.cache.getColumnByXCoord(this.left);
  }
  getLastCol() {
    return this.root.cache.getColumnByXCoord(this.right);
  }
}
class x {
  constructor(t) {
    s(this, "width");
    s(this, "title");
    this.width = t.width, this.title = t.title;
  }
}
class p {
  constructor(t) {
    s(this, "height");
    s(this, "title");
    this.height = t.height, this.title = t.title;
  }
}
function y(n, t, e = !1) {
  const o = [];
  for (let i = 0; i <= n; i++) {
    const r = [];
    for (let l = 0; l <= t; l++) {
      const h = e ? `${i}:${l}` : "", c = new C({
        displayValue: h,
        resultValue: h,
        value: h,
        position: {
          column: l,
          row: i
        },
        style: null
      });
      r.push(c);
    }
    o.push(r);
  }
  return o;
}
function A(n, t) {
  const e = [];
  for (let r = 0; r <= n; r++) {
    const l = new p({
      height: 40,
      title: String(r)
    });
    e.push(l);
  }
  const o = [];
  for (let r = 0; r <= t; r++) {
    const l = new x({
      title: String(r),
      width: 150
    });
    o.push(l);
  }
  return new m({
    columns: o,
    rows: e,
    view: {
      height: 600,
      width: 800
    }
  });
}
function X(n, t) {
  const e = y(n, t), o = A(n, t);
  return { data: e, config: o };
}
class M {
  constructor(t) {
    s(this, "xPos");
    s(this, "colIdx");
    this.xPos = t.xPos, this.colIdx = t.colIdx;
  }
}
class z {
  constructor(t) {
    s(this, "yPos");
    s(this, "rowIdx");
    this.yPos = t.yPos, this.rowIdx = t.rowIdx;
  }
}
class D {
  constructor(t) {
    s(this, "columns");
    s(this, "rows");
    this.columns = t.columns, this.rows = t.rows;
  }
  getRowByYCoord(t) {
    let e = 0;
    for (let o = 0; o < this.rows.length; o++)
      if (t <= this.rows[o].yPos) {
        e = o;
        break;
      }
    return e;
  }
  getColumnByXCoord(t) {
    let e = 0;
    for (let o = 0; o < this.columns.length; o++)
      if (t <= this.columns[o].xPos) {
        e = o;
        break;
      }
    return e;
  }
}
class H {
  constructor(t) {
    s(this, "element");
    s(this, "root");
    s(this, "height", 32);
    s(this, "width");
    // private resizerWidth = 1;
    s(this, "ctx");
    this.root = t, this.element = this.createElement();
    const e = this.element.getContext("2d");
    if (!e)
      throw new Error("Enable hardware acceleration");
    this.ctx = e, this.width = this.root.viewProps.width;
  }
  createElement() {
    const t = document.createElement("canvas");
    return t.style.position = "absolute", t.style.height = this.height + "px", t.style.width = this.root.viewProps.width + "px", t.style.display = "block", t.style.borderLeft = "1px solid black", t.width = this.root.viewProps.width, t.height = this.height, t;
  }
  setElementPosition(t, e) {
    this.element.style.top = t + "px", this.element.style.left = e + "px";
  }
  isColumnSelected(t) {
    const { selectedCell: e, selectedRange: o } = this.root.selection;
    return e && e.column === t ? !0 : o ? t >= Math.min(o.from.column, o.to.column) && t <= Math.max(o.from.column, o.to.column) : !1;
  }
  // private getYCoordWithOffset(renderBox: RenderBox): number {
  //     const {y} = renderBox
  //     return y + this.root.toolbarHeight
  // }
  // private getXCoordWithOffset(renderBox: RenderBox): number {
  //     const {x} = renderBox
  //     return x
  // }
  renderText(t, e) {
    const { width: o, x: i } = e;
    this.ctx.fillStyle = "black", this.ctx.textAlign = "center", this.ctx.textBaseline = "middle", this.ctx.font = "16px Arial", this.ctx.fillText(this.root.config.columns[t].title, i + o / 2 - this.root.viewport.left, 0 + this.height / 2);
  }
  renderRect(t, e) {
    const { width: o, x: i } = e, r = this.isColumnSelected(t);
    this.ctx.fillStyle = r ? this.root.styles.cells.selectedBackground : "white", this.ctx.strokeStyle = "black", this.ctx.lineWidth = 1;
    const l = i - this.root.viewport.left;
    this.ctx.fillRect(l - 1, 0, o, this.height), this.ctx.strokeRect(l - 1, 0, o, this.height);
  }
  renderSingleColumn(t) {
    const e = new w(this.root.config, {
      row: 0,
      column: t
    });
    this.renderRect(t, e), this.renderText(t, e);
  }
  renderBar() {
    const t = this.root.viewport.lastCol + 3, e = this.root.viewport.firstCol;
    this.ctx.beginPath(), this.ctx.strokeStyle = "black", this.ctx.lineWidth = 1, this.ctx.moveTo(0, 0), this.ctx.lineTo(0, this.height), this.ctx.closePath(), this.ctx.stroke();
    for (let o = e; o <= t && this.root.config.columns[o]; o++)
      this.renderSingleColumn(o);
  }
}
class F {
  constructor(t) {
    s(this, "element");
    s(this, "ctx");
    s(this, "root");
    s(this, "width", 30);
    s(this, "height");
    s(this, "resizerHeight", 1);
    this.root = t, this.element = this.createElement();
    const e = this.element.getContext("2d");
    if (!e)
      throw new Error("Enable hardware acceleration");
    this.ctx = e, this.height = this.root.viewProps.height;
  }
  createElement() {
    const t = document.createElement("canvas");
    return t.style.position = "absolute", t.style.height = this.root.viewProps.height + "px", t.style.width = this.width + "px", t.style.display = "block", t.style.borderTop = "1px solid black", t.width = this.width, t.height = this.root.viewProps.height, t;
  }
  setElementPosition(t, e) {
    this.element.style.top = t + "px", this.element.style.left = e + "px";
  }
  isRowSelected(t) {
    const { selectedCell: e, selectedRange: o } = this.root.selection;
    return e && e.row === t ? !0 : o ? t >= Math.min(o.from.row, o.to.row) && t <= Math.max(o.from.row, o.to.row) : !1;
  }
  renderText(t, e) {
    const { y: o, height: i } = e;
    this.ctx.fillStyle = "black", this.ctx.textAlign = "center", this.ctx.textBaseline = "middle", this.ctx.font = "16px Arial", this.ctx.fillText(this.root.config.rows[t].title, this.width / 2, o - this.root.viewport.top + i / 2);
  }
  renderRect(t, e) {
    const { y: o, height: i } = e, r = this.isRowSelected(t);
    this.ctx.fillStyle = r ? this.root.styles.cells.selectedBackground : "white", this.ctx.strokeStyle = "black", this.ctx.lineWidth = this.resizerHeight;
    const l = o - this.root.viewport.top;
    this.ctx.fillRect(0, l - 1, this.width, i), this.ctx.strokeRect(0, l - 1, this.width, i);
  }
  renderSingleRow(t) {
    const e = new w(this.root.config, {
      column: 0,
      row: t
    });
    this.renderRect(t, e), this.renderText(t, e);
  }
  renderBar() {
    const t = this.root.viewport.lastRow + 3, e = this.root.viewport.firstRow;
    this.ctx.beginPath(), this.ctx.moveTo(0, 0), this.ctx.strokeStyle = "black", this.ctx.lineWidth = 16, this.ctx.lineTo(35, 0), this.ctx.closePath(), this.ctx.stroke();
    for (let o = e; o <= t && this.root.config.rows[o]; o++)
      this.renderSingleRow(o);
  }
}
const a = "modern_sc_";
class Y {
  constructor(t, e) {
    s(this, "table");
    s(this, "scroller");
    s(this, "toolbar");
    s(this, "rowsBar");
    s(this, "columnsBar");
    s(this, "sheet");
    s(this, "editor");
    s(this, "styles");
    s(this, "config");
    s(this, "data");
    s(this, "viewport");
    s(this, "selection");
    s(this, "cache");
    const o = y(40, 40), i = this.makeConfigFromData(o, (e == null ? void 0 : e.view) ?? { height: 600, width: 800 });
    e != null && e.view && (i.view = e.view), this.config = new m(i), this.rowsBar = new F(this), this.columnsBar = new H(this), this.sheet = new V(this), this.table = new I(this), this.scroller = new b(this), this.toolbar = new L(this), this.editor = new S(this), this.cache = this.getInitialCache(), this.viewport = new f(this, this.scroller.getViewportBoundlingRect()), this.selection = new P(), this.data = o, this.styles = new T(), this.buildComponent(), this.setElementsPositions(), this.appendTableToTarget(t), this.renderSheet(), this.renderColumnsBar(), this.renderRowsBar();
  }
  setRowsBarPosition() {
    const t = this.columnsBar.height + this.toolbar.height, e = 0;
    this.rowsBar.setElementPosition(t, e);
  }
  setColumnsBarPosition() {
    const t = this.toolbar.height, e = this.rowsBar.width;
    console.log(t, e), this.columnsBar.setElementPosition(t, e);
  }
  setElementsPositions() {
    this.setRowsBarPosition(), this.setColumnsBarPosition();
  }
  getInitialCache() {
    const t = [];
    let e = 0;
    for (let l = 0; l <= this.config.columns.length - 1; l++) {
      const h = this.config.columns[l];
      e += h.width;
      const c = new M({
        xPos: e,
        colIdx: l
      });
      t.push(c);
    }
    const o = [];
    let i = 0;
    for (let l = 0; l <= this.config.rows.length - 1; l++) {
      const h = this.config.rows[l];
      i += h.height;
      const c = new z({
        yPos: i,
        rowIdx: l
      });
      o.push(c);
    }
    const r = new D({
      columns: t,
      rows: o
    });
    return console.log("CACHE: ", r), console.log("CONFIG: ", this.config), r;
  }
  buildComponent() {
    const t = document.createElement("div");
    t.style.top = this.columnsBarHeight + "px", t.style.left = this.rowsBarWidth + "px", t.appendChild(this.sheet.element), t.classList.add(a + "content"), this.table.element.appendChild(this.toolbar.element), this.table.element.appendChild(this.rowsBar.element), this.table.element.appendChild(this.columnsBar.element), this.table.element.appendChild(t), this.table.element.appendChild(this.scroller.element), this.table.element.append(this.editor.element);
  }
  /**Destroy spreadsheet DOM element.
   *
   * May be usefull when need to rerender component.
   */
  destroy() {
    this.table.element.remove();
  }
  appendTableToTarget(t) {
    if (typeof t == "string") {
      const e = document.querySelector(t);
      if (!e)
        throw new Error(`Element with selector ${t} is not finded in DOM.
 Make sure it exists.`);
      e == null || e.appendChild(this.table.element);
    }
    t instanceof HTMLElement && t.append(this.table.element);
  }
  /** Canvas rendering context 2D.
   *
   * Abble to draw on canvas with default CanvasAPI methods
   */
  get ctx() {
    return this.sheet.ctx;
  }
  get viewProps() {
    return this.config.view;
  }
  get columnsBarHeight() {
    return this.columnsBar.height;
  }
  get rowsBarWidth() {
    return this.rowsBar.width;
  }
  get toolbarHeight() {
    return this.toolbar.height;
  }
  /** Focusing on interactive part of spreadsheet */
  focusTable() {
    this.scroller.element.focus();
  }
  getCellByCoords(t, e) {
    return this.sheet.getCellByCoords(t, e);
  }
  getCell(t) {
    const { column: e, row: o } = t;
    return this.data[o][e];
  }
  changeCellValues(t, e) {
    const { column: o, row: i } = t;
    this.data[i][o].changeValues(e), this.renderCell(i, o);
  }
  changeCellStyles(t, e) {
    const { column: o, row: i } = t;
    this.data[i][o].changeStyles(e), this.renderCell(i, o);
  }
  applyActionToRange(t, e) {
    const o = Math.min(t.from.row, t.to.row), i = Math.max(t.from.row, t.to.row), r = Math.min(t.from.column, t.to.column), l = Math.max(t.from.column, t.to.column);
    for (let h = o; h <= i; h++)
      for (let c = r; c <= l; c++) {
        const u = this.data[h][c];
        e(u);
      }
  }
  deleteSelectedCellsValues() {
    if (this.selection.selectedRange !== null)
      this.applyActionToRange(this.selection.selectedRange, (t) => {
        this.changeCellValues(t.position, {
          displayValue: "",
          resultValue: "",
          value: ""
        });
      });
    else {
      if (!this.selection.selectedCell)
        return;
      this.changeCellValues(this.selection.selectedCell, {
        displayValue: "",
        resultValue: "",
        value: ""
      });
    }
  }
  showEditor(t, e) {
    this.editor.show(t, e);
  }
  renderSheet() {
    this.sheet.renderSheet();
  }
  renderColumnsBar() {
    this.columnsBar.renderBar();
  }
  renderRowsBar() {
    this.rowsBar.renderBar();
  }
  renderCell(t, e) {
    this.data[t][e].render(this);
  }
  loadData(t) {
    const e = t.length, o = t[0] ? this.data[0].length : 0;
    this.data = [];
    const i = [];
    for (let r = 0; r < e; r++) {
      const l = [];
      for (let h = 0; h < o; h++) {
        const c = t[r][h];
        l.push(new C({
          displayValue: c.displayValue,
          position: c.position,
          resultValue: c.resultValue,
          value: c.value,
          style: c.style
        }));
      }
      i.push(l);
    }
    return this.data = i, this.selection.selectedCell = null, this.selection.selectedRange = null, this.config = this.makeConfigFromData(i, this.config.view), this.cache = this.getInitialCache(), this.scroller.updateScrollerSize(), this.viewport = new f(this, this.scroller.getViewportBoundlingRect()), this.renderSheet(), this;
  }
  makeConfigFromData(t, e) {
    const o = t.length - 1, i = t[0] ? t[0].length : 0, r = [];
    for (let c = 0; c < o; c++)
      r.push(new p({
        height: 40,
        title: String(c)
      }));
    const l = [];
    for (let c = 0; c < i; c++)
      l.push(new x({
        width: 150,
        title: String(c)
      }));
    return new m({
      view: e,
      rows: r,
      columns: l
    });
  }
  serializeData() {
    const t = this.data.length, e = this.data[0] ? this.data[0].length : 0, o = [];
    for (let i = 0; i < t; i++) {
      const r = [];
      for (let l = 0; l < e; l++)
        r.push(this.data[i][l].getSerializableCell());
      o.push(r);
    }
    return o;
  }
}
export {
  a as CSS_PREFIX,
  D as Cache,
  M as CachedColumn,
  z as CachedRow,
  C as Cell,
  B as CellStyles,
  x as Column,
  m as Config,
  k as Position,
  w as RenderBox,
  p as Row,
  P as Selection,
  E as SerializableCell,
  T as Styles,
  f as Viewport,
  A as createSampleConfig,
  y as createSampleData,
  Y as default,
  X as makeSpreadsheetConfigAndData
};
//# sourceMappingURL=main.js.map

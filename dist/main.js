var v = Object.defineProperty;
var S = (r, t, e) => t in r ? v(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var s = (r, t, e) => (S(r, typeof t != "symbol" ? t + "" : t, e), e);
class m {
  constructor(t, e) {
    s(this, "x");
    s(this, "y");
    s(this, "width");
    s(this, "height");
    this.x = this.getXCoord(e.column, t), this.y = this.getYCoord(e.row, t), this.width = t.columns[e.column].width, this.height = t.rows[e.row].height;
  }
  getXCoord(t, e) {
    let o = 0;
    for (let l = 0; l < t; l++)
      o += e.columns[l].width;
    return o;
  }
  getYCoord(t, e) {
    let o = 0;
    for (let l = 0; l < t; l++)
      o += e.rows[l].height;
    return o;
  }
}
class x {
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
    e.classList.add(d + "editor"), this.element = e, this.hide();
  }
  hide() {
    this.element.style.display = "none", this.element.classList.add("hide"), this.element.blur(), window.removeEventListener("click", this.handleClickOutside), this.element.removeEventListener("keydown", this.handleKeydown), this.root.focusTable();
  }
  show(t, e) {
    const { height: o, width: l, x: n, y: i } = new m(this.root.config, t), c = this.root.getCell(t);
    this.element.classList.remove("hide"), this.element.style.top = i - this.root.viewport.top + "px", this.element.style.left = n - this.root.viewport.left + "px", this.element.style.width = l + "px", this.element.style.height = o + "px", this.element.style.display = "block", window.addEventListener("click", this.handleClickOutside), this.element.addEventListener("keydown", this.handleKeydown), this.element.value = e || c.value, this.element.focus(), e || this.element.select();
  }
}
class R {
  constructor(t) {
    s(this, "element");
    s(this, "root");
    this.root = t;
    const e = document.createElement("header");
    e.classList.add(), this.element = e;
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
      const { offsetX: e, offsetY: o } = t, l = this.root.getCellByCoords(e, o);
      this.root.selection.selectedRange && (this.root.selection.selectedRange.to = l), this.root.renderSheet();
    });
    s(this, "handleMouseUp", () => {
      this.isSelecting = !1, this.root.selection.selectedRange && this.root.selection.selectedRange.from.row === this.root.selection.selectedRange.to.row && this.root.selection.selectedRange.from.column === this.root.selection.selectedRange.to.column && (this.root.selection.selectedRange = null), this.root.renderSheet();
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
      const { offsetX: e, offsetY: o } = t, l = this.root.getCellByCoords(e, o);
      this.isSelecting = !0, this.root.selection.selectedRange = {
        from: l,
        to: l
      }, this.root.selection.selectedCell = l, this.root.renderSheet();
    });
    s(this, "handleScroll", () => {
      const t = this.getViewportBoundlingRect();
      this.root.viewport.updateValues(t), this.root.renderSheet();
    });
    this.root = t;
    const { horizontalScroller: e, scroller: o, verticalScroller: l } = this.buildComponent();
    this.element = o, this.verticalScroller = l, this.horizontalScroller = e, this.element.style.height = this.root.config.view.height + "px", this.element.style.width = this.root.config.view.width + "px", this.element.tabIndex = -1, this.updateScrollerSize(), this.element.addEventListener("scroll", this.handleScroll), this.element.addEventListener("mousedown", this.handleClick), this.element.addEventListener("mousemove", this.handleMouseMove), this.element.addEventListener("mouseup", this.handleMouseUp), this.element.addEventListener("dblclick", this.handleDoubleClick), this.element.addEventListener("keydown", this.handleKeydown);
  }
  getViewportBoundlingRect() {
    const { scrollTop: t, scrollLeft: e } = this.element, { height: o, width: l } = this.element.getBoundingClientRect(), n = t + o, i = e + l;
    return {
      top: t,
      left: e,
      bottom: n,
      right: i
    };
  }
  buildComponent() {
    const t = document.createElement("div"), e = document.createElement("div"), o = document.createElement("div"), l = document.createElement("div"), n = document.createElement("div");
    return e.style.width = "0px", e.style.pointerEvents = "none", o.style.pointerEvents = "none", l.style.display = "flex", n.appendChild(e), n.appendChild(o), l.appendChild(n), this.verticalScroller = e, this.horizontalScroller = o, t.appendChild(l), t.classList.add(d + "scroller"), { scroller: t, verticalScroller: e, horizontalScroller: o };
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
class k {
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
class V {
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
class f {
  constructor(t) {
    /** True value (data) */
    s(this, "value");
    /** Value to render */
    s(this, "displayValue");
    /** This refers to the values ​​​​that were obtained by calculations, for example, after calculating the formula  */
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
    const { column: e, row: o } = this.position, { selectedRange: l } = t.selection;
    if (!l)
      return !1;
    const n = o >= Math.min(l.from.row, l.to.row) && o <= Math.max(l.to.row, l.from.row);
    return e >= Math.min(l.from.column, l.to.column) && e <= Math.max(l.to.column, l.from.column) && n;
  }
  render(t) {
    var w;
    let { height: e, width: o, x: l, y: n } = new m(t.config, this.position);
    const { ctx: i } = t, c = ((w = t.selection.selectedCell) == null ? void 0 : w.row) === this.position.row && t.selection.selectedCell.column === this.position.column, h = this.isCellInRange(t);
    n -= t.viewport.top, l -= t.viewport.left;
    const a = this.style ?? t.styles.cells;
    i.clearRect(l, n, o, e), i.fillStyle = c || h ? a.selectedBackground : a.background, i.strokeStyle = "black", i.fillRect(l, n, o - 1, e - 1), i.strokeRect(l, n, o, e), i.fillStyle = c || h ? a.selectedFontColor : a.fontColor, i.textAlign = "left", i.font = `${a.fontSize}px Arial`, i.textBaseline = "middle", i.fillText(this.displayValue, l + 2, n + e / 2);
  }
}
class I {
  constructor(t) {
    s(this, "element");
    s(this, "ctx");
    s(this, "root");
    this.root = t;
    const e = document.createElement("canvas");
    e.classList.add(d + "sheet"), e.height = this.root.config.view.height, e.width = this.root.config.view.width, e.style.width = this.root.config.view.width + "px", e.style.height = this.root.config.view.height + "px", this.element = e;
    const o = this.element.getContext("2d");
    if (!o)
      throw new Error("Enable hardware acceleration");
    this.ctx = o;
  }
  getCellByCoords(t, e) {
    let o = 0, l = 0;
    for (; l <= e && (l += this.root.config.rows[o].height, !(l >= e)); )
      o++;
    let n = 0, i = 0;
    for (; i <= t && (i += this.root.config.columns[n].width, !(i >= t)); )
      n++;
    return new V(o, n);
  }
  renderCell(t) {
    const { column: e, row: o } = t;
    this.root.data[o][e].render(this.root);
  }
  renderSheet() {
    const t = this.root.viewport.firstRow, e = this.root.viewport.lastCol + 3, o = this.root.viewport.lastRow + 3, l = this.root.viewport.firstCol;
    for (let n = t; n <= o; n++)
      for (let i = l; i <= e && !(!this.root.config.columns[i] || !this.root.config.rows[n]); i++)
        this.renderCell({ column: i, row: n });
  }
}
class L {
  constructor(t) {
    s(this, "element");
    s(this, "root");
    this.root = t;
    const e = document.createElement("div");
    e.classList.add(d + "spreadsheet_container"), this.element = e, this.changeElementSizes(this.root.viewProps);
  }
  changeElementSizes(t) {
    const { height: e, width: o } = t;
    this.element.style.width = o + "px", this.element.style.height = e + "px";
  }
}
class A {
  constructor(t) {
    s(this, "element");
    s(this, "root");
    this.root = t;
    const e = document.createElement("div");
    e.classList.add(d + "toolbar"), this.element = e;
  }
}
class u {
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
class B {
  constructor() {
    s(this, "selectedCell", null);
    s(this, "selectedRange", null);
  }
}
class z {
  constructor() {
    s(this, "cells");
    this.cells = new k();
  }
}
class g {
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
class C {
  constructor(t) {
    s(this, "width");
    s(this, "title");
    this.width = t.width, this.title = t.title;
  }
}
class y {
  constructor(t) {
    s(this, "height");
    s(this, "title");
    this.height = t.height, this.title = t.title;
  }
}
function p(r, t, e = !1) {
  const o = [];
  for (let l = 0; l <= r; l++) {
    const n = [];
    for (let i = 0; i <= t; i++) {
      const c = e ? `${l}:${i}` : "", h = new f({
        displayValue: c,
        resultValue: c,
        value: c,
        position: {
          column: i,
          row: l
        },
        style: null
      });
      n.push(h);
    }
    o.push(n);
  }
  return o;
}
function D(r, t) {
  const e = [];
  for (let n = 0; n <= r; n++) {
    const i = new y({
      height: 40,
      title: String(n)
    });
    e.push(i);
  }
  const o = [];
  for (let n = 0; n <= t; n++) {
    const i = new C({
      title: String(n),
      width: 150
    });
    o.push(i);
  }
  return new u({
    columns: o,
    rows: e,
    view: {
      height: 600,
      width: 800
    }
  });
}
function H(r, t) {
  const e = p(r, t), o = D(r, t);
  return { data: e, config: o };
}
class M {
  constructor(t) {
    s(this, "xPos");
    s(this, "colIdx");
    this.xPos = t.xPos, this.colIdx = t.colIdx;
  }
}
class F {
  constructor(t) {
    s(this, "yPos");
    s(this, "rowIdx");
    this.yPos = t.yPos, this.rowIdx = t.rowIdx;
  }
}
class T {
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
const d = "modern_sc_";
class X {
  constructor(t, e) {
    s(this, "table");
    s(this, "scroller");
    s(this, "toolbar");
    s(this, "header");
    s(this, "sheet");
    s(this, "editor");
    s(this, "styles");
    s(this, "config");
    s(this, "data");
    s(this, "viewport");
    s(this, "selection");
    s(this, "cache");
    const o = p(40, 40), l = this.makeConfigFromData(o, (e == null ? void 0 : e.view) ?? { height: 600, width: 800 });
    e != null && e.view && (l.view = e.view), this.config = new u(l), this.sheet = new I(this), this.table = new L(this), this.scroller = new b(this), this.toolbar = new A(this), this.header = new R(this), this.editor = new x(this), this.cache = this.getInitialCache(), this.viewport = new g(this, this.scroller.getViewportBoundlingRect()), this.selection = new B(), this.data = o, this.styles = new z(), this.buildComponent(), this.appendTableToTarget(t), this.renderSheet();
  }
  getInitialCache() {
    const t = [];
    let e = 0;
    for (let i = 0; i <= this.config.columns.length - 1; i++) {
      const c = this.config.columns[i];
      e += c.width;
      const h = new M({
        xPos: e,
        colIdx: i
      });
      t.push(h);
    }
    const o = [];
    let l = 0;
    for (let i = 0; i <= this.config.rows.length - 1; i++) {
      const c = this.config.rows[i];
      l += c.height;
      const h = new F({
        yPos: l,
        rowIdx: i
      });
      o.push(h);
    }
    const n = new T({
      columns: t,
      rows: o
    });
    return console.log("CACHE: ", n), console.log("CONFIG: ", this.config), n;
  }
  buildComponent() {
    const t = document.createElement("div");
    t.appendChild(this.header.element), t.appendChild(this.sheet.element), t.classList.add(d + "content"), this.table.element.appendChild(this.toolbar.element), this.table.element.appendChild(t), this.table.element.appendChild(this.scroller.element), this.table.element.append(this.editor.element);
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
    const { column: o, row: l } = t;
    this.data[l][o].changeValues(e), this.renderCell(l, o);
  }
  changeCellStyles(t, e) {
    const { column: o, row: l } = t;
    this.data[l][o].changeStyles(e), this.renderCell(l, o);
  }
  applyActionToRange(t, e) {
    const o = Math.min(t.from.row, t.to.row), l = Math.max(t.from.row, t.to.row), n = Math.min(t.from.column, t.to.column), i = Math.max(t.from.column, t.to.column);
    for (let c = o; c <= l; c++)
      for (let h = n; h <= i; h++) {
        const a = this.data[c][h];
        e(a);
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
  renderCell(t, e) {
    this.data[t][e].render(this);
  }
  loadData(t) {
    const e = t.length, o = t[0] ? this.data[0].length : 0;
    this.data = [];
    const l = [];
    for (let n = 0; n < e; n++) {
      const i = [];
      for (let c = 0; c < o; c++) {
        const h = t[n][c];
        i.push(new f({
          displayValue: h.displayValue,
          position: h.position,
          resultValue: h.resultValue,
          value: h.value,
          style: h.style
        }));
      }
      l.push(i);
    }
    return this.data = l, this.selection.selectedCell = null, this.selection.selectedRange = null, this.config = this.makeConfigFromData(l, this.config.view), this.cache = this.getInitialCache(), this.scroller.updateScrollerSize(), this.viewport = new g(this, this.scroller.getViewportBoundlingRect()), this.renderSheet(), this;
  }
  makeConfigFromData(t, e) {
    const o = t.length - 1, l = t[0] ? t[0].length : 0, n = [];
    for (let h = 0; h < o; h++)
      n.push(new y({
        height: 40,
        title: String(h)
      }));
    const i = [];
    for (let h = 0; h < l; h++)
      i.push(new C({
        width: 150,
        title: String(h)
      }));
    return new u({
      view: e,
      rows: n,
      columns: i
    });
  }
  serializeData() {
    const t = this.data.length, e = this.data[0] ? this.data[0].length : 0, o = [];
    for (let l = 0; l < t; l++) {
      const n = [];
      for (let i = 0; i < e; i++)
        n.push(this.data[l][i].getSerializableCell());
      o.push(n);
    }
    return o;
  }
}
export {
  d as CSS_PREFIX,
  T as Cache,
  M as CachedColumn,
  F as CachedRow,
  f as Cell,
  k as CellStyles,
  C as Column,
  u as Config,
  V as Position,
  m as RenderBox,
  y as Row,
  B as Selection,
  E as SerializableCell,
  z as Styles,
  g as Viewport,
  D as createSampleConfig,
  p as createSampleData,
  X as default,
  H as makeSpreadsheetConfigAndData
};
//# sourceMappingURL=main.js.map

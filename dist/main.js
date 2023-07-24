var p = Object.defineProperty;
var y = (r, t, e) => t in r ? p(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var o = (r, t, e) => (y(r, typeof t != "symbol" ? t + "" : t, e), e);
class w {
  constructor(t, e) {
    o(this, "x");
    o(this, "y");
    o(this, "width");
    o(this, "height");
    this.x = this.getXCoord(e.column, t), this.y = this.getYCoord(e.row, t), this.width = t.columns[e.column].width, this.height = t.rows[e.row].height;
  }
  getXCoord(t, e) {
    let s = 0;
    for (let l = 0; l < t; l++)
      s += e.columns[l].width;
    return s;
  }
  getYCoord(t, e) {
    let s = 0;
    for (let l = 0; l < t; l++)
      s += e.rows[l].height;
    return s;
  }
}
class v {
  constructor(t) {
    o(this, "element");
    o(this, "root");
    o(this, "handleKeydown", (t) => {
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
    o(this, "handleClickOutside", (t) => {
      const e = t.target;
      this.element.contains(e) || this.hide();
    });
    this.root = t;
    const e = document.createElement("input");
    e.classList.add("editor"), this.element = e, this.hide();
  }
  hide() {
    this.element.style.display = "none", this.element.classList.add("hide"), this.element.blur(), window.removeEventListener("click", this.handleClickOutside), this.element.removeEventListener("keydown", this.handleKeydown), this.root.focusTable();
  }
  show(t) {
    const { height: e, width: s, x: l, y: n } = new w(this.root.config, t), i = this.root.getCell(t);
    this.element.classList.remove("hide"), this.element.style.top = n - this.root.viewport.top + "px", this.element.style.left = l - this.root.viewport.left + "px", this.element.style.width = s + "px", this.element.style.height = e + "px", this.element.style.display = "block", window.addEventListener("click", this.handleClickOutside), this.element.addEventListener("keydown", this.handleKeydown), this.element.value = i.value, this.element.focus(), this.element.select();
  }
}
class S {
  constructor(t) {
    o(this, "element");
    o(this, "root");
    this.root = t;
    const e = document.createElement("header");
    e.classList.add(), this.element = e;
  }
}
class x {
  constructor(t) {
    o(this, "element");
    o(this, "verticalScroller");
    o(this, "horizontalScroller");
    o(this, "root");
    o(this, "isSelecting", !1);
    o(this, "handleMouseMove", (t) => {
      if (!this.isSelecting)
        return;
      const { offsetX: e, offsetY: s } = t, l = this.root.getCellByCoords(e, s);
      this.root.selection.selectedRange && (this.root.selection.selectedRange.to = l), this.root.renderSheet();
    });
    o(this, "handleMouseUp", () => {
      this.isSelecting = !1, this.root.selection.selectedRange && this.root.selection.selectedRange.from.row === this.root.selection.selectedRange.to.row && this.root.selection.selectedRange.from.column === this.root.selection.selectedRange.to.column && (this.root.selection.selectedRange = null), this.root.renderSheet();
    });
    o(this, "handleDoubleClick", (t) => {
      t.preventDefault();
      const e = this.root.getCellByCoords(t.offsetX, t.offsetY);
      this.root.showEditor(e);
    });
    o(this, "handleKeydown", (t) => {
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
      if (!t.metaKey && !t.ctrlKey && (t.key === "F2" || /^([a-z]|[а-я])$/.test(t.key.toLowerCase()))) {
        if (t.preventDefault(), !this.root.selection.selectedCell)
          return;
        this.root.showEditor(this.root.selection.selectedCell);
      }
      t.key === "Delete" && (t.preventDefault(), this.root.deleteSelectedCellsValues(), this.root.renderSheet());
    });
    o(this, "handleClick", (t) => {
      if (t.button !== 0)
        return;
      const { offsetX: e, offsetY: s } = t, l = this.root.getCellByCoords(e, s);
      this.isSelecting = !0, this.root.selection.selectedRange = {
        from: l,
        to: l
      }, this.root.selection.selectedCell = l, this.root.renderSheet();
    });
    o(this, "handleScroll", () => {
      const t = this.getViewportBoundlingRect();
      this.root.viewport.updateValues(t), this.root.renderSheet();
    });
    this.root = t;
    const { horizontalScroller: e, scroller: s, verticalScroller: l } = this.buildComponent();
    this.element = s, this.verticalScroller = l, this.horizontalScroller = e, this.element.style.height = this.root.config.view.height + "px", this.element.style.width = this.root.config.view.width + "px", this.element.tabIndex = -1, this.updateScrollerSize(), this.element.addEventListener("scroll", this.handleScroll), this.element.addEventListener("mousedown", this.handleClick), this.element.addEventListener("mousemove", this.handleMouseMove), this.element.addEventListener("mouseup", this.handleMouseUp), this.element.addEventListener("dblclick", this.handleDoubleClick), this.element.addEventListener("keydown", this.handleKeydown);
  }
  getViewportBoundlingRect() {
    const { scrollTop: t, scrollLeft: e } = this.element, { height: s, width: l } = this.element.getBoundingClientRect(), n = t + s, i = e + l;
    return {
      top: t,
      left: e,
      bottom: n,
      right: i
    };
  }
  buildComponent() {
    const t = document.createElement("div"), e = document.createElement("div"), s = document.createElement("div"), l = document.createElement("div"), n = document.createElement("div");
    return e.style.width = "0px", e.style.pointerEvents = "none", s.style.pointerEvents = "none", l.style.display = "flex", n.appendChild(e), n.appendChild(s), l.appendChild(n), this.verticalScroller = e, this.horizontalScroller = s, t.appendChild(l), t.classList.add("scroller"), { scroller: t, verticalScroller: e, horizontalScroller: s };
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
class R {
  constructor(t) {
    o(this, "fontSize", 16);
    o(this, "fontColor", "black");
    o(this, "background", "white");
    o(this, "borderColor", "black");
    o(this, "selectedBackground", "#4287f5");
    o(this, "selectedFontColor", "#ffffff");
    t && Object.assign(this, t);
  }
}
class b {
  constructor(t, e) {
    o(this, "row");
    o(this, "column");
    this.row = t, this.column = e;
  }
}
class k {
  constructor(t) {
    o(this, "value");
    o(this, "displayValue");
    /** This refers to the values ​​​​that were obtained by calculations, for example, after calculating the formula  */
    o(this, "resultValue");
    o(this, "position");
    o(this, "style", new R());
    this.value = t.value, this.displayValue = t.displayValue, this.resultValue = t.resultValue, this.position = t.position;
  }
  changeValues(t) {
    Object.assign(this, t);
  }
  isCellInRange(t) {
    const { column: e, row: s } = this.position, { selectedRange: l } = t.selection;
    if (!l)
      return !1;
    const n = s >= Math.min(l.from.row, l.to.row) && s <= Math.max(l.to.row, l.from.row);
    return e >= Math.min(l.from.column, l.to.column) && e <= Math.max(l.to.column, l.from.column) && n;
  }
  render(t) {
    var a;
    let { height: e, width: s, x: l, y: n } = new w(t.config, this.position);
    const { ctx: i } = t, c = ((a = t.selection.selectedCell) == null ? void 0 : a.row) === this.position.row && t.selection.selectedCell.column === this.position.column, h = this.isCellInRange(t);
    n -= t.viewport.top, l -= t.viewport.left, i.clearRect(l, n, s, e), i.fillStyle = c || h ? this.style.selectedBackground : this.style.background, i.strokeStyle = "black", i.fillRect(l, n, s - 1, e - 1), i.strokeRect(l, n, s, e), i.fillStyle = c || h ? this.style.selectedFontColor : this.style.fontColor, i.textAlign = "left", i.font = `${this.style.fontSize}px Arial`, i.textBaseline = "middle", i.fillText(this.displayValue, l + 2, n + e / 2, s);
  }
}
class E {
  constructor(t) {
    o(this, "element");
    o(this, "ctx");
    o(this, "root");
    this.root = t;
    const e = document.createElement("canvas");
    e.classList.add("sheet"), e.height = this.root.config.view.height, e.width = this.root.config.view.width, e.style.width = this.root.config.view.width + "px", e.style.height = this.root.config.view.height + "px", this.element = e;
    const s = this.element.getContext("2d");
    if (!s)
      throw new Error("Enable hardware acceleration");
    this.ctx = s;
  }
  getCellByCoords(t, e) {
    let s = 0, l = 0;
    for (; l <= e && (l += this.root.config.rows[s].height, !(l >= e)); )
      s++;
    let n = 0, i = 0;
    for (; i <= t && (i += this.root.config.columns[n].width, !(i >= t)); )
      n++;
    return new b(s, n);
  }
  renderCell(t) {
    const { column: e, row: s } = t;
    this.root.data[s][e].render(this.root);
  }
  renderSheet() {
    const t = this.root.viewport.firstRow, e = this.root.viewport.lastCol + 3, s = this.root.viewport.lastRow + 3, l = this.root.viewport.firstCol;
    for (let n = t; n <= s; n++)
      for (let i = l; i <= e && !(!this.root.config.columns[i] || !this.root.config.rows[n]); i++)
        this.renderCell({ column: i, row: n });
  }
}
class I {
  constructor(t) {
    o(this, "element");
    o(this, "root");
    this.root = t;
    const e = document.createElement("div");
    e.classList.add("spreadsheet_container"), this.element = e, this.changeElementSizes(this.root.viewProps);
  }
  changeElementSizes(t) {
    const { height: e, width: s } = t;
    this.element.style.width = s + "px", this.element.style.height = e + "px";
  }
}
class V {
  constructor(t) {
    o(this, "element");
    o(this, "root");
    this.root = t;
    const e = document.createElement("div");
    e.classList.add("toolbar"), this.element = e;
  }
}
class d {
  constructor(t) {
    o(this, "rows");
    o(this, "columns");
    o(this, "view", {
      width: 800,
      height: 600
    });
    this.columns = t.columns, this.rows = t.rows, this.view = t.view;
  }
}
class L {
  constructor() {
    o(this, "selectedCell", null);
    o(this, "selectedRange", null);
  }
}
class B {
}
class u {
  constructor(t, e) {
    o(this, "root");
    o(this, "top");
    o(this, "left");
    o(this, "right");
    o(this, "bottom");
    o(this, "firstRow");
    o(this, "lastRow");
    o(this, "firstCol");
    o(this, "lastCol");
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
class m {
  constructor(t) {
    o(this, "width");
    o(this, "title");
    this.width = t.width, this.title = t.title;
  }
}
class g {
  constructor(t) {
    o(this, "height");
    o(this, "title");
    this.height = t.height, this.title = t.title;
  }
}
function f(r, t, e = !1) {
  const s = [];
  for (let l = 0; l <= r; l++) {
    const n = [];
    for (let i = 0; i <= t; i++) {
      const c = e ? `${l}:${i}` : "", h = new k({
        displayValue: c,
        resultValue: c,
        value: c,
        position: {
          column: i,
          row: l
        }
      });
      n.push(h);
    }
    s.push(n);
  }
  return s;
}
function A(r, t) {
  const e = [];
  for (let n = 0; n <= r; n++) {
    const i = new g({
      height: 40,
      title: String(n)
    });
    e.push(i);
  }
  const s = [];
  for (let n = 0; n <= t; n++) {
    const i = new m({
      title: String(n),
      width: 150
    });
    s.push(i);
  }
  return new d({
    columns: s,
    rows: e,
    view: {
      height: 600,
      width: 800
    }
  });
}
class M {
  constructor(t) {
    o(this, "xPos");
    o(this, "colIdx");
    this.xPos = t.xPos, this.colIdx = t.colIdx;
  }
}
class T {
  constructor(t) {
    o(this, "yPos");
    o(this, "rowIdx");
    this.yPos = t.yPos, this.rowIdx = t.rowIdx;
  }
}
class D {
  constructor(t) {
    o(this, "columns");
    o(this, "rows");
    this.columns = t.columns, this.rows = t.rows;
  }
  getRowByYCoord(t) {
    let e = 0;
    for (let s = 0; s < this.rows.length; s++)
      if (t <= this.rows[s].yPos) {
        e = s;
        break;
      }
    return e;
  }
  getColumnByXCoord(t) {
    let e = 0;
    for (let s = 0; s < this.columns.length; s++)
      if (t <= this.columns[s].xPos) {
        e = s;
        break;
      }
    return e;
  }
}
class z {
  constructor(t, e) {
    o(this, "table");
    o(this, "scroller");
    o(this, "toolbar");
    o(this, "header");
    o(this, "sheet");
    o(this, "editor");
    o(this, "styles");
    o(this, "config");
    o(this, "data");
    o(this, "viewport");
    o(this, "selection");
    o(this, "cache");
    const s = A(500, 500);
    e != null && e.view && (s.view = e.view), this.config = new d(s), this.sheet = new E(this);
    const l = f(500, 500);
    this.table = new I(this), this.scroller = new x(this), this.toolbar = new V(this), this.header = new S(this), this.editor = new v(this), this.cache = this.getInitialCache(), this.viewport = new u(this, this.scroller.getViewportBoundlingRect()), this.selection = new L(), this.data = l, this.styles = new B(), this.buildComponent(), this.appendTableToTarget(t), this.renderSheet();
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
    const s = [];
    let l = 0;
    for (let i = 0; i <= this.config.rows.length - 1; i++) {
      const c = this.config.rows[i];
      l += c.height;
      const h = new T({
        yPos: l,
        rowIdx: i
      });
      s.push(h);
    }
    const n = new D({
      columns: t,
      rows: s
    });
    return console.log("CACHE: ", n), console.log("CONFIG: ", this.config), n;
  }
  buildComponent() {
    const t = document.createElement("div");
    t.appendChild(this.header.element), t.appendChild(this.sheet.element), t.classList.add("content"), this.table.element.appendChild(this.toolbar.element), this.table.element.appendChild(t), this.table.element.appendChild(this.scroller.element), this.table.element.append(this.editor.element);
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
  get ctx() {
    return this.sheet.ctx;
  }
  get viewProps() {
    return this.config.view;
  }
  focusTable() {
    this.scroller.element.focus();
  }
  getCellByCoords(t, e) {
    return this.sheet.getCellByCoords(t, e);
  }
  getCell(t) {
    const { column: e, row: s } = t;
    return this.data[s][e];
  }
  changeCellValues(t, e) {
    const { column: s, row: l } = t;
    this.data[l][s].changeValues(e), this.renderCell(l, s);
  }
  applyActionToRange(t, e) {
    const s = Math.min(t.from.row, t.to.row), l = Math.max(t.from.row, t.to.row), n = Math.min(t.from.column, t.to.column), i = Math.max(t.from.column, t.to.column);
    for (let c = s; c <= l; c++)
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
  showEditor(t) {
    this.editor.show(t);
  }
  renderSheet() {
    this.sheet.renderSheet();
  }
  renderCell(t, e) {
    this.data[t][e].render(this);
  }
  loadData(t) {
    this.data = t, this.config = this.makeConfigFromData(t, this.config.view), this.cache = this.getInitialCache(), this.scroller.updateScrollerSize(), this.viewport = new u(this, this.scroller.getViewportBoundlingRect()), this.renderSheet();
  }
  makeConfigFromData(t, e) {
    const s = t.length - 1, l = t[0] ? t[0].length : 0, n = [];
    for (let h = 0; h < s; h++)
      n.push(new g({
        height: 40,
        title: String(h)
      }));
    const i = [];
    for (let h = 0; h < l; h++)
      i.push(new m({
        width: 150,
        title: String(h)
      }));
    return new d({
      view: e,
      rows: n,
      columns: i
    });
  }
}
const C = new z("#spreadsheet", {
  view: {
    height: 768,
    width: 1366
  }
}), F = f(45, 45, !0);
C.changeCellValues({ column: 2, row: 2 }, {
  displayValue: "Loading...",
  resultValue: "Loading...",
  value: "Loading..."
});
setTimeout(() => {
  C.loadData(F);
}, 2e3);
export {
  z as Spreadsheet
};

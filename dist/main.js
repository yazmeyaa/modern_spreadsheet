var I = Object.defineProperty;
var A = (r, t, e) => t in r ? I(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var s = (r, t, e) => (A(r, typeof t != "symbol" ? t + "" : t, e), e);
var d;
(function(r) {
  r.CELL_CLICK = "CELL_CLICK", r.SELECTION_CHANGE = "CHANGE_SELECTION", r.CELL_CHANGE = "CELL_CHANGE", r.COPY_CELLS = "COPY_CELLS";
})(d || (d = {}));
class P {
  constructor(t) {
    s(this, "root");
    s(this, "cellClick", (t, e) => {
      var c, a;
      if (t.button !== 0)
        return;
      const { offsetX: o, offsetY: l } = t, i = this.root.getCellByCoords(o, l), n = this.root.getCell(i), h = new v();
      h.selectedCell = i, h.selectedRange = {
        from: i,
        to: i
      }, e.setSelectingMode(!0), this.changeSelection(h, !0), (a = (c = this.root.config).onCellClick) == null || a.call(c, t, n);
    });
    s(this, "changeSelection", (t, e = !1) => {
      var o, l;
      this.root.selection = t, e && ((l = (o = this.root.config).onSelectonChange) == null || l.call(o, t)), this.root.renderSheet(), this.root.renderColumnsBar(), this.root.renderRowsBar();
    });
    s(this, "copy", (t, e, o) => {
      var l, i;
      (i = (l = this.root.config).onCopy) == null || i.call(l, t, e, o);
    });
    this.root = t;
  }
  dispatch(t) {
    switch (t.type) {
      case d.CELL_CLICK: {
        const { event: e, scroller: o } = t;
        this.cellClick(e, o);
        break;
      }
      case d.SELECTION_CHANGE: {
        const { selection: e, enableCallback: o } = t;
        this.changeSelection(e, o);
        break;
      }
      case d.CELL_CHANGE: {
        const { cell: e, enableCallback: o } = t;
        this.changeCellValues(e, o);
        break;
      }
      case d.COPY_CELLS: {
        const { data: e, dataAsString: o, range: l } = t;
        this.copy(l, e, o);
        break;
      }
    }
  }
  changeCellValues(t, e = !0) {
    var o, l;
    e && ((l = (o = this.root.config).onCellChange) == null || l.call(o, t));
  }
}
class y {
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
class T {
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
        case "Enter": {
          if (!this.root.selection.selectedCell)
            return;
          this.root.changeCellValues(this.root.selection.selectedCell, {
            value: this.element.value,
            displayValue: this.element.value
          }), this.root.events.dispatch({
            type: d.CELL_CHANGE,
            cell: this.root.getCell(this.root.selection.selectedCell)
          }), this.hide();
        }
      }
    });
    s(this, "handleClickOutside", (t) => {
      const e = t.target;
      this.element.contains(e) || this.hide();
    });
    this.root = t;
    const e = document.createElement("input");
    e.classList.add(m + "editor"), this.element = e, this.hide();
  }
  hide() {
    this.element.style.display = "none", this.element.classList.add("hide"), this.element.blur(), window.removeEventListener("click", this.handleClickOutside), this.element.removeEventListener("keydown", this.handleKeydown), this.root.focusTable();
  }
  show(t, e) {
    const { height: o, width: l, x: i, y: n } = new y(this.root.config, t), h = this.root.getCell(t);
    this.element.classList.remove("hide"), this.element.style.top = n - this.root.viewport.top + this.root.columnsBarHeight + "px", this.element.style.left = i - this.root.viewport.left + this.root.rowsBarWidth + "px", this.element.style.width = l + "px", this.element.style.height = o + "px", this.element.style.display = "block", window.addEventListener("click", this.handleClickOutside), this.element.addEventListener("keydown", this.handleKeydown), this.element.value = e || h.value, this.element.focus(), e || this.element.select();
  }
}
function b(r, t) {
  return r.column === t.column && r.row === t.row;
}
class H {
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
      let i = !1;
      this.root.selection.selectedRange && (i = !b(this.root.selection.selectedRange.to, l), i && (this.root.selection.selectedRange.to = l, this.root.events.dispatch({
        type: d.SELECTION_CHANGE,
        selection: this.root.selection,
        enableCallback: !0
      })));
    });
    s(this, "handleMouseUp", () => {
      this.isSelecting = !1;
      const t = { ...this.root.selection };
      this.root.selection.selectedRange && b(this.root.selection.selectedRange.from, this.root.selection.selectedRange.to) && (t.selectedRange = null, this.root.events.dispatch({
        type: d.SELECTION_CHANGE,
        selection: t,
        enableCallback: !1
      })), this.root.renderSheet(), this.root.renderColumnsBar(), this.root.renderRowsBar();
    });
    s(this, "handleDoubleClick", (t) => {
      t.preventDefault();
      const e = this.root.getCellByCoords(t.offsetX, t.offsetY);
      this.root.showEditor(e);
    });
    s(this, "handleKeydown", (t) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(t.key)) {
        switch (t.preventDefault(), this.root.selection.selectedRange = null, t.key) {
          case "ArrowLeft": {
            this.root.selection.selectedCell && this.root.selection.selectedCell.column > 0 && (this.root.selection.selectedCell.column -= 1);
            break;
          }
          case "ArrowRight": {
            this.root.selection.selectedCell && this.root.selection.selectedCell.column < this.root.config.columns.length - 1 && (this.root.selection.selectedCell.column += 1);
            break;
          }
          case "ArrowUp": {
            this.root.selection.selectedCell && this.root.selection.selectedCell.row > 0 && (this.root.selection.selectedCell.row -= 1);
            break;
          }
          case "ArrowDown": {
            this.root.selection.selectedCell && this.root.selection.selectedCell.row < this.root.config.rows.length - 1 && (this.root.selection.selectedCell.row += 1);
            break;
          }
        }
        this.root.events.dispatch({
          type: d.SELECTION_CHANGE,
          selection: this.root.selection,
          enableCallback: !0
        });
      }
      const e = /^([a-z]|[а-я]|[0-9])$/;
      if (!t.metaKey && !t.ctrlKey) {
        const o = e.test(t.key.toLowerCase());
        if (t.key === "F2" || o) {
          if (t.preventDefault(), !this.root.selection.selectedCell)
            return;
          this.root.showEditor(this.root.selection.selectedCell, o ? t.key : void 0);
        }
      }
      if (t.key === "Delete" && (t.preventDefault(), this.root.deleteSelectedCellsValues(), this.root.renderSheet()), t.metaKey || t.ctrlKey) {
        if (console.log(t.code), t.code === "KeyC") {
          let o;
          const l = new v();
          if (this.root.selection.selectedRange) {
            const { from: i, to: n } = this.root.selection.selectedRange;
            l.selectedRange = this.root.selection.selectedRange, o = [...this.root.data.slice(i.row, n.row + 1).map((a) => a.slice(i.column, n.column + 1))];
          } else if (this.root.selection.selectedCell) {
            const { column: i, row: n } = this.root.selection.selectedCell;
            o = [[this.root.data[n][i]]], l.selectedRange = {
              from: this.root.selection.selectedCell,
              to: this.root.selection.selectedCell
            };
          } else
            return;
          this.root.clipboard.copy(o, l.selectedRange);
          return;
        }
        t.code;
      }
    });
    s(this, "handleClick", (t) => {
      this.root.events.dispatch({
        type: d.CELL_CLICK,
        event: t,
        scroller: this
      });
    });
    s(this, "handleScroll", () => {
      const t = this.getViewportBoundlingRect();
      this.root.viewport.updateValues(t), this.root.renderSheet(), this.root.renderColumnsBar(), this.root.renderRowsBar();
    });
    this.root = t;
    const { horizontalScroller: e, scroller: o, verticalScroller: l } = this.buildComponent();
    this.element = o, this.verticalScroller = l, this.horizontalScroller = e, this.element.style.height = this.root.config.view.height + "px", this.element.style.width = this.root.config.view.width + "px", this.element.style.top = this.root.columnsBarHeight + "px", this.element.style.left = this.root.rowsBarWidth + "px", this.element.tabIndex = -1, this.updateScrollerSize(), this.element.addEventListener("scroll", this.handleScroll), this.element.addEventListener("mousedown", this.handleClick), this.element.addEventListener("mousemove", this.handleMouseMove), this.element.addEventListener("mouseup", this.handleMouseUp), this.element.addEventListener("dblclick", this.handleDoubleClick), this.element.addEventListener("keydown", this.handleKeydown), this.element.addEventListener("paste", (i) => {
      this.root.selection.selectedCell && this.root.clipboard.paste(this.root, this.root.selection.selectedCell, i);
    });
  }
  setSelectingMode(t) {
    this.isSelecting = t;
  }
  getViewportBoundlingRect() {
    const { scrollTop: t, scrollLeft: e } = this.element, { height: o, width: l } = this.element.getBoundingClientRect(), i = t + o, n = e + l;
    return {
      top: t,
      left: e,
      bottom: i,
      right: n
    };
  }
  buildComponent() {
    const t = document.createElement("div"), e = document.createElement("div"), o = document.createElement("div"), l = document.createElement("div"), i = document.createElement("div");
    return e.style.width = "0px", e.style.pointerEvents = "none", o.style.pointerEvents = "none", l.style.display = "flex", i.appendChild(e), i.appendChild(o), l.appendChild(i), this.verticalScroller = e, this.horizontalScroller = o, t.appendChild(l), t.contentEditable = "false", t.classList.add(m + "scroller"), { scroller: t, verticalScroller: e, horizontalScroller: o };
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
    s(this, "fontSize", 16);
    s(this, "fontColor", "black");
    s(this, "background", "white");
    s(this, "borderColor", "black");
    s(this, "selectedBackground", "#4287f5");
    s(this, "selectedFontColor", "#ffffff");
    t && Object.assign(this, t);
  }
}
class M {
  constructor(t, e) {
    s(this, "row");
    s(this, "column");
    this.row = t, this.column = e;
  }
}
class _ {
  constructor(t) {
    s(this, "value");
    s(this, "displayValue");
    s(this, "resultValue");
    s(this, "position");
    s(this, "style");
    this.value = t.value, this.displayValue = t.displayValue, this.resultValue = t.resultValue, this.position = t.position, this.style = t.style;
  }
}
class x {
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
    return new _({
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
    const i = o >= Math.min(l.from.row, l.to.row) && o <= Math.max(l.to.row, l.from.row);
    return e >= Math.min(l.from.column, l.to.column) && e <= Math.max(l.to.column, l.from.column) && i;
  }
  render(t) {
    var C;
    const e = new y(t.config, this.position);
    let { x: o, y: l } = e;
    const { height: i, width: n } = e, { ctx: h } = t, c = ((C = t.selection.selectedCell) == null ? void 0 : C.row) === this.position.row && t.selection.selectedCell.column === this.position.column, a = this.isCellInRange(t);
    l -= t.viewport.top, o -= t.viewport.left;
    const u = this.style ?? t.styles.cells;
    h.clearRect(o, l, n, i), h.fillStyle = c || a ? u.selectedBackground : u.background, h.strokeStyle = "black", h.fillRect(o, l, n - 1, i - 1), h.strokeRect(o, l, n, i), h.fillStyle = c || a ? u.selectedFontColor : u.fontColor, h.textAlign = "left", h.font = `${u.fontSize}px Arial`, h.textBaseline = "middle", h.fillText(this.displayValue, o + 2, l + i / 2);
  }
}
class D {
  constructor(t) {
    s(this, "element");
    s(this, "ctx");
    s(this, "root");
    this.root = t;
    const e = document.createElement("canvas");
    e.classList.add(m + "sheet"), e.height = this.root.config.view.height, e.width = this.root.config.view.width, e.style.width = this.root.config.view.width + "px", e.style.height = this.root.config.view.height + "px", e.style.left = "0px", this.element = e;
    const o = this.element.getContext("2d");
    if (!o)
      throw new Error("Enable hardware acceleration");
    this.ctx = o;
  }
  getCellByCoords(t, e) {
    let o = 0, l = 0;
    for (; l <= e && (l += this.root.config.rows[o].height, !(l >= e)); )
      o++;
    let i = 0, n = 0;
    for (; n <= t && (n += this.root.config.columns[i].width, !(n >= t)); )
      i++;
    return new M(o, i);
  }
  renderCell(t) {
    const { column: e, row: o } = t;
    this.root.data[o][e].render(this.root);
  }
  renderSheet() {
    const t = this.root.viewport.firstRow, e = this.root.viewport.lastCol + 3, o = this.root.viewport.lastRow + 3, l = this.root.viewport.firstCol;
    for (let i = t; i <= o; i++)
      for (let n = l; n <= e && !(!this.root.config.columns[n] || !this.root.config.rows[i]); n++)
        this.renderCell({ column: n, row: i });
  }
}
class z {
  constructor(t) {
    s(this, "element");
    s(this, "root");
    this.root = t;
    const e = document.createElement("div");
    e.classList.add(m + "spreadsheet_container"), this.element = e, this.changeElementSizes(this.root.viewProps);
  }
  changeElementSizes(t) {
    const { height: e, width: o } = t;
    this.element.style.width = o + this.root.rowsBarWidth + "px", this.element.style.height = e + this.root.columnsBarHeight + "px";
  }
}
class N {
  constructor(t) {
    s(this, "element");
    s(this, "root");
    s(this, "height", 0);
    this.root = t;
    const e = document.createElement("div");
    e.classList.add(m + "toolbar"), this.element = e;
  }
}
class p {
  constructor(t) {
    s(this, "rows");
    s(this, "columns");
    s(this, "view", {
      width: 800,
      height: 600
    });
    s(this, "onCellClick", null);
    s(this, "onSelectonChange", null);
    s(this, "onCellChange", null);
    s(this, "onCopy");
    this.columns = t.columns, this.rows = t.rows, this.view = t.view, this.onCellClick = t.onCellClick ?? null, this.onSelectonChange = t.onSelectionChange ?? null, this.onCellChange = t.onCellChange ?? null, this.onCopy = t.onCopy ?? null;
  }
}
class v {
  constructor() {
    s(this, "selectedCell", null);
    s(this, "selectedRange", null);
  }
}
class O {
  constructor() {
    s(this, "cells");
    this.cells = new R();
  }
}
class S {
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
class E {
  constructor(t) {
    s(this, "width");
    s(this, "title");
    this.width = t.width, this.title = t.title;
  }
}
class k {
  constructor(t) {
    s(this, "height");
    s(this, "title");
    this.height = t.height, this.title = t.title;
  }
}
function B(r, t, e = !1) {
  const o = [];
  for (let l = 0; l <= r; l++) {
    const i = [];
    for (let n = 0; n <= t; n++) {
      const h = e ? `${l}:${n}` : "", c = new x({
        displayValue: h,
        resultValue: h,
        value: h,
        position: {
          column: n,
          row: l
        },
        style: null
      });
      i.push(c);
    }
    o.push(i);
  }
  return o;
}
function K(r, t) {
  const e = [];
  for (let i = 0; i <= r; i++) {
    const n = new k({
      height: 40,
      title: String(i)
    });
    e.push(n);
  }
  const o = [];
  for (let i = 0; i <= t; i++) {
    const n = new E({
      title: String(i),
      width: 150
    });
    o.push(n);
  }
  return new p({
    columns: o,
    rows: e,
    view: {
      height: 600,
      width: 800
    }
  });
}
function U(r, t) {
  const e = B(r, t), o = K(r, t);
  return { data: e, config: o };
}
class F {
  constructor(t) {
    s(this, "xPos");
    s(this, "colIdx");
    this.xPos = t.xPos, this.colIdx = t.colIdx;
  }
}
class W {
  constructor(t) {
    s(this, "yPos");
    s(this, "rowIdx");
    this.yPos = t.yPos, this.rowIdx = t.rowIdx;
  }
}
class Y {
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
class G {
  constructor(t) {
    s(this, "element");
    s(this, "root");
    s(this, "height", 35);
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
    const { width: o, x: l } = e;
    this.ctx.fillStyle = "black", this.ctx.textAlign = "center", this.ctx.textBaseline = "middle", this.ctx.font = "12px Arial", this.ctx.fillText(this.root.config.columns[t].title, l + o / 2 - this.root.viewport.left, 0 + this.height / 2);
  }
  renderRect(t, e) {
    const { width: o, x: l } = e, i = this.isColumnSelected(t);
    this.ctx.fillStyle = i ? this.root.styles.cells.selectedBackground : "white", this.ctx.strokeStyle = "black", this.ctx.lineWidth = 1;
    const n = l - this.root.viewport.left;
    this.ctx.fillRect(n - 1, 0, o, this.height), this.ctx.strokeRect(n - 1, 0, o, this.height);
  }
  renderSingleColumn(t) {
    const e = new y(this.root.config, {
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
class X {
  constructor(t) {
    s(this, "element");
    s(this, "ctx");
    s(this, "root");
    s(this, "width", 35);
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
    const { y: o, height: l } = e;
    this.ctx.fillStyle = "black", this.ctx.textAlign = "center", this.ctx.textBaseline = "middle", this.ctx.font = "12px Arial", this.ctx.fillText(this.root.config.rows[t].title, this.width / 2, o - this.root.viewport.top + l / 2);
  }
  renderRect(t, e) {
    const { y: o, height: l } = e, i = this.isRowSelected(t);
    this.ctx.fillStyle = i ? this.root.styles.cells.selectedBackground : "white", this.ctx.strokeStyle = "black", this.ctx.lineWidth = this.resizerHeight;
    const n = o - this.root.viewport.top;
    this.ctx.fillRect(0, n - 1, this.width, l), this.ctx.strokeRect(0, n - 1, this.width, l);
  }
  renderSingleRow(t) {
    const e = new y(this.root.config, {
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
class j {
  constructor(t) {
    s(this, "saved", null);
    s(this, "root");
    this.root = t;
  }
  copy(t, e) {
    const o = t.map((l) => l.map((i) => i.displayValue).join("	")).join(`
`);
    this.saved = t, navigator.clipboard.writeText(o), this.root.events.dispatch({
      type: d.COPY_CELLS,
      data: t,
      dataAsString: o,
      range: e
    });
  }
  paste(t, { column: e, row: o }, l) {
    if (!this.saved) {
      if (!l.clipboardData)
        return;
      const h = l.clipboardData.getData("text");
      try {
        const a = h.split(`
`).map((w) => w.split("	")).map((w) => w.map((g) => {
          const f = {
            displayValue: g,
            position: {
              column: e,
              row: o
            },
            resultValue: g,
            style: new R(),
            value: g
          };
          return new x(f);
        })), u = a.length, C = a[0] ? a[0].length : 0;
        for (let w = 0; w < u; w++)
          for (let g = 0; g < C; g++) {
            const f = a[w][g], L = {
              column: e + g,
              row: o + w
            }, V = {
              displayValue: f.displayValue,
              value: f.value,
              style: f.style
            };
            t.changeCellValues(L, V, !1);
          }
      } catch (c) {
        console.error("Cannot read clipboard. ", c);
      }
      return;
    }
    const i = this.saved.length, n = this.saved[0] ? this.saved[0].length : 0;
    for (let h = 0; h < i; h++)
      for (let c = 0; c < n; c++) {
        const a = this.saved[h][c], u = {
          column: e + c,
          row: o + h
        }, C = {
          displayValue: a.displayValue,
          value: a.value,
          style: a.style
        };
        t.changeCellValues(u, C, !1);
      }
  }
}
const m = "modern_sc_";
class q {
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
    s(this, "events");
    s(this, "clipboard");
    const o = B(40, 40), l = this.makeConfigFromData(o, (e == null ? void 0 : e.view) ?? { height: 600, width: 800 });
    e != null && e.view && (l.view = e.view), this.config = new p(l), this.config.onCellClick = (e == null ? void 0 : e.onCellClick) ?? null, this.config.onSelectonChange = (e == null ? void 0 : e.onSelectionChange) ?? null, this.config.onCellChange = (e == null ? void 0 : e.onCellChange) ?? null, this.config.onCopy = (e == null ? void 0 : e.onCopy) ?? null, this.rowsBar = new X(this), this.columnsBar = new G(this), this.sheet = new D(this), this.table = new z(this), this.scroller = new H(this), this.toolbar = new N(this), this.editor = new T(this), this.cache = this.getInitialCache(), this.viewport = new S(this, this.scroller.getViewportBoundlingRect()), this.selection = new v(), this.events = new P(this), this.clipboard = new j(this), this.data = o, this.styles = new O(), this.buildComponent(), this.setElementsPositions(), this.appendTableToTarget(t), this.renderSheet(), this.renderColumnsBar(), this.renderRowsBar();
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
    for (let n = 0; n <= this.config.columns.length - 1; n++) {
      const h = this.config.columns[n];
      e += h.width;
      const c = new F({
        xPos: e,
        colIdx: n
      });
      t.push(c);
    }
    const o = [];
    let l = 0;
    for (let n = 0; n <= this.config.rows.length - 1; n++) {
      const h = this.config.rows[n];
      l += h.height;
      const c = new W({
        yPos: l,
        rowIdx: n
      });
      o.push(c);
    }
    const i = new Y({
      columns: t,
      rows: o
    });
    return console.log("CACHE: ", i), console.log("CONFIG: ", this.config), i;
  }
  buildComponent() {
    const t = document.createElement("div");
    t.style.top = this.columnsBarHeight + "px", t.style.left = this.rowsBarWidth + "px", t.appendChild(this.sheet.element), t.classList.add(m + "content"), this.table.element.appendChild(this.toolbar.element), this.table.element.appendChild(this.rowsBar.element), this.table.element.appendChild(this.columnsBar.element), this.table.element.appendChild(t), this.table.element.appendChild(this.scroller.element), this.table.element.append(this.editor.element);
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
  changeCellValues(t, e, o = !0) {
    const { column: l, row: i } = t;
    this.data[i][l].changeValues(e), this.events.dispatch({
      type: d.CELL_CHANGE,
      cell: this.data[i][l],
      enableCallback: o
    }), this.renderCell(i, l);
  }
  changeCellStyles(t, e) {
    const { column: o, row: l } = t;
    this.data[l][o].changeStyles(e), this.renderCell(l, o);
  }
  applyActionToRange(t, e) {
    const o = Math.min(t.from.row, t.to.row), l = Math.max(t.from.row, t.to.row), i = Math.min(t.from.column, t.to.column), n = Math.max(t.from.column, t.to.column);
    for (let h = o; h <= l; h++)
      for (let c = i; c <= n; c++) {
        const a = this.data[h][c];
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
    const l = [];
    for (let i = 0; i < e; i++) {
      const n = [];
      for (let h = 0; h < o; h++) {
        const c = t[i][h];
        n.push(new x({
          displayValue: c.displayValue,
          position: c.position,
          resultValue: c.resultValue,
          value: c.value,
          style: c.style
        }));
      }
      l.push(n);
    }
    return this.data = l, this.selection.selectedCell = null, this.selection.selectedRange = null, this.config = this.makeConfigFromData(l, this.config.view), this.cache = this.getInitialCache(), this.scroller.updateScrollerSize(), this.viewport = new S(this, this.scroller.getViewportBoundlingRect()), this.renderSheet(), this;
  }
  makeConfigFromData(t, e) {
    const o = t.length - 1, l = t[0] ? t[0].length : 0, i = [];
    for (let c = 0; c < o; c++)
      i.push(new k({
        height: 40,
        title: String(c)
      }));
    const n = [];
    for (let c = 0; c < l; c++)
      n.push(new E({
        width: 150,
        title: String(c)
      }));
    return new p({
      view: e,
      rows: i,
      columns: n,
      onCellClick: null
    });
  }
  serializeData() {
    const t = this.data.length, e = this.data[0] ? this.data[0].length : 0, o = [];
    for (let l = 0; l < t; l++) {
      const i = [];
      for (let n = 0; n < e; n++)
        i.push(this.data[l][n].getSerializableCell());
      o.push(i);
    }
    return o;
  }
}
export {
  m as CSS_PREFIX,
  Y as Cache,
  F as CachedColumn,
  W as CachedRow,
  x as Cell,
  R as CellStyles,
  E as Column,
  p as Config,
  M as Position,
  y as RenderBox,
  k as Row,
  v as Selection,
  _ as SerializableCell,
  O as Styles,
  S as Viewport,
  K as createSampleConfig,
  B as createSampleData,
  q as default,
  U as makeSpreadsheetConfigAndData
};
//# sourceMappingURL=main.js.map

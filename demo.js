var Ys = Object.defineProperty;
var Ks = (t, e, n) => e in t ? Ys(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var U = (t, e, n) => (Ks(t, typeof e != "symbol" ? e + "" : e, n), n);
(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload"))
    return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]'))
    r(i);
  new MutationObserver((i) => {
    for (const a of i)
      if (a.type === "childList")
        for (const c of a.addedNodes)
          c.tagName === "LINK" && c.rel === "modulepreload" && r(c);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(i) {
    const a = {};
    return i.integrity && (a.integrity = i.integrity), i.referrerPolicy && (a.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? a.credentials = "include" : i.crossOrigin === "anonymous" ? a.credentials = "omit" : a.credentials = "same-origin", a;
  }
  function r(i) {
    if (i.ep)
      return;
    i.ep = !0;
    const a = n(i);
    fetch(i.href, a);
  }
})();
var yt = /* @__PURE__ */ ((t) => (t.CELL_CLICK = "CELL_CLICK", t.SELECTION_CHANGE = "CHANGE_SELECTION", t.CELL_CHANGE = "CELL_CHANGE", t.COPY_CELLS = "COPY_CELLS", t))(yt || {});
class zs {
  constructor(e) {
    U(this, "root");
    U(this, "cellClick", (e, n) => {
      var p, u;
      if (e.button !== 0)
        return;
      const { offsetX: r, offsetY: i } = e, a = this.root.getCellByCoords(r, i), c = this.root.getCell(a), h = new Fr();
      h.selectedCell = a, h.selectedRange = {
        from: a,
        to: a
      }, n.setSelectingMode(!0), this.changeSelection(h, !0), (u = (p = this.root.config).onCellClick) == null || u.call(p, e, c);
    });
    U(this, "changeSelection", (e, n = !1) => {
      var r, i;
      this.root.selection = e, n && ((i = (r = this.root.config).onSelectonChange) == null || i.call(r, e)), this.root.renderSheet(), this.root.renderColumnsBar(), this.root.renderRowsBar();
    });
    U(this, "copy", (e, n, r) => {
      var i, a;
      (a = (i = this.root.config).onCopy) == null || a.call(i, e, n, r);
    });
    this.root = e;
  }
  async dispatch(e) {
    switch (e.type) {
      case "CELL_CLICK": {
        const { event: n, scroller: r } = e;
        this.cellClick(n, r);
        break;
      }
      case "CHANGE_SELECTION": {
        const { selection: n, enableCallback: r } = e;
        this.changeSelection(n, r);
        break;
      }
      case "CELL_CHANGE": {
        const { cell: n, enableCallback: r } = e;
        if (n.value.substring(0, 1).startsWith("="))
          try {
            await n.evalFormula(this.root.formulaParser), n.displayValue = n.resultValue, this.root.renderCell(n.position.row, n.position.column), this.changeCellValues(n, r);
            return;
          } catch (i) {
            console.error(i);
          }
        this.root.renderCell(n.position.row, n.position.column), this.changeCellValues(n, r);
        break;
      }
      case "COPY_CELLS": {
        const { data: n, dataAsString: r, range: i } = e;
        this.copy(i, n, r);
        break;
      }
    }
  }
  changeCellValues(e, n = !0) {
    var r, i;
    n && ((i = (r = this.root.config).onCellChange) == null || i.call(r, e));
  }
}
class Gt {
  constructor(e, n) {
    U(this, "x");
    U(this, "y");
    U(this, "width");
    U(this, "height");
    this.x = this.getXCoord(n.column, e), this.y = this.getYCoord(n.row, e), this.width = e.columns[n.column].width, this.height = e.rows[n.row].height;
  }
  getXCoord(e, n) {
    let r = 0;
    for (let i = 0; i < e; i++)
      r += n.columns[i].width;
    return r;
  }
  getYCoord(e, n) {
    let r = 0;
    for (let i = 0; i < e; i++)
      r += n.rows[i].height;
    return r;
  }
}
class Xs {
  constructor(e) {
    U(this, "element");
    U(this, "root");
    U(this, "handleKeydown", (e) => {
      const { key: n } = e;
      switch (n) {
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
            type: yt.CELL_CHANGE,
            cell: this.root.getCell(this.root.selection.selectedCell)
          }), this.hide(), this.root.renderSelection();
        }
      }
    });
    U(this, "handleClickOutside", (e) => {
      const n = e.target;
      this.element.contains(n) || this.hide();
    });
    this.root = e;
    const n = document.createElement("input");
    n.classList.add(Wt + "editor"), this.element = n, this.hide();
  }
  hide() {
    this.element.style.display = "none", this.element.classList.add("hide"), this.element.blur(), window.removeEventListener("click", this.handleClickOutside), this.element.removeEventListener("keydown", this.handleKeydown), this.root.focusTable();
  }
  show(e, n) {
    const { height: r, width: i, x: a, y: c } = new Gt(this.root.config, e), h = this.root.getCell(e);
    this.element.classList.remove("hide"), this.element.style.top = c - this.root.viewport.top + this.root.columnsBarHeight + "px", this.element.style.left = a - this.root.viewport.left + this.root.rowsBarWidth + "px", this.element.style.width = i + "px", this.element.style.height = r + "px", this.element.style.display = "block", window.addEventListener("click", this.handleClickOutside), this.element.addEventListener("keydown", this.handleKeydown), this.element.value = n || h.value, this.element.focus(), n || this.element.select();
  }
}
function ni(t, e) {
  return t.column === e.column && t.row === e.row;
}
class Qs {
  constructor(e) {
    U(this, "element");
    U(this, "verticalScroller");
    U(this, "horizontalScroller");
    U(this, "root");
    U(this, "isSelecting", !1);
    U(this, "handleMouseMove", (e) => {
      if (!this.isSelecting)
        return;
      const { offsetX: n, offsetY: r } = e, i = this.root.getCellByCoords(n, r);
      let a = !1;
      this.root.selection.selectedRange && (a = !ni(
        this.root.selection.selectedRange.to,
        i
      ), a && (this.root.selection.selectedRange.to = i, this.root.events.dispatch({
        type: yt.SELECTION_CHANGE,
        selection: this.root.selection,
        enableCallback: !0
      })));
    });
    U(this, "handleMouseUp", () => {
      this.isSelecting = !1;
      const e = { ...this.root.selection };
      this.root.selection.selectedRange && ni(
        this.root.selection.selectedRange.from,
        this.root.selection.selectedRange.to
      ) && (e.selectedRange = null, this.root.events.dispatch({
        type: yt.SELECTION_CHANGE,
        selection: e,
        enableCallback: !1
      })), this.root.renderSheet(), this.root.renderColumnsBar(), this.root.renderRowsBar();
    });
    U(this, "handleDoubleClick", (e) => {
      e.preventDefault();
      const n = this.root.getCellByCoords(e.offsetX, e.offsetY);
      this.root.showEditor(n);
    });
    U(this, "handleKeydown", (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        switch (e.preventDefault(), this.root.selection.selectedRange = null, e.key) {
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
          type: yt.SELECTION_CHANGE,
          selection: this.root.selection,
          enableCallback: !0
        });
      }
      const n = /^([a-z]|[а-я]|[0-9]|=)$/;
      if (!e.metaKey && !e.ctrlKey) {
        const r = n.test(e.key.toLowerCase());
        if (e.key === "F2" || r) {
          if (e.preventDefault(), !this.root.selection.selectedCell)
            return;
          this.root.showEditor(
            this.root.selection.selectedCell,
            r ? e.key : void 0
          );
        }
      }
      if (e.key === "Delete" && (e.preventDefault(), this.root.deleteSelectedCellsValues(), this.root.renderSheet()), e.metaKey || e.ctrlKey) {
        if (e.code === "KeyC") {
          let r;
          const i = new Fr();
          if (this.root.selection.selectedRange) {
            const { from: a, to: c } = this.root.selection.selectedRange;
            i.selectedRange = this.root.selection.selectedRange, r = [...this.root.data.slice(a.row, c.row + 1).map((u) => u.slice(a.column, c.column + 1))];
          } else if (this.root.selection.selectedCell) {
            const { column: a, row: c } = this.root.selection.selectedCell;
            r = [[this.root.data[c][a]]], i.selectedRange = {
              from: this.root.selection.selectedCell,
              to: this.root.selection.selectedCell
            };
          } else
            return;
          this.root.clipboard.copy(r, i.selectedRange);
          return;
        }
        e.code;
      }
    });
    U(this, "handleClick", (e) => {
      this.root.events.dispatch({
        type: yt.CELL_CLICK,
        event: e,
        scroller: this
      });
    });
    U(this, "handleScroll", () => {
      const e = this.getViewportBoundlingRect();
      this.root.viewport.updateValues(e), this.root.renderSheet(), this.root.renderColumnsBar(), this.root.renderRowsBar();
    });
    this.root = e;
    const { horizontalScroller: n, scroller: r, verticalScroller: i } = this.buildComponent();
    this.element = r, this.verticalScroller = i, this.horizontalScroller = n, this.element.style.height = this.root.config.view.height + "px", this.element.style.width = this.root.config.view.width + "px", this.element.style.top = this.root.columnsBarHeight + "px", this.element.style.left = this.root.rowsBarWidth + "px", this.element.tabIndex = -1, this.updateScrollerSize(), this.element.addEventListener("scroll", this.handleScroll), this.element.addEventListener("mousedown", this.handleClick), this.element.addEventListener("mousemove", this.handleMouseMove), this.element.addEventListener("mouseup", this.handleMouseUp), this.element.addEventListener("dblclick", this.handleDoubleClick), this.element.addEventListener("keydown", this.handleKeydown), this.element.addEventListener("paste", (a) => {
      this.root.selection.selectedCell && this.root.clipboard.paste(
        this.root,
        this.root.selection.selectedCell,
        a
      );
    });
  }
  setSelectingMode(e) {
    this.isSelecting = e;
  }
  getViewportBoundlingRect() {
    const { scrollTop: e, scrollLeft: n } = this.element, { height: r, width: i } = this.element.getBoundingClientRect(), a = e + r, c = n + i;
    return {
      top: e,
      left: n,
      bottom: a,
      right: c
    };
  }
  buildComponent() {
    const e = document.createElement("div"), n = document.createElement("div"), r = document.createElement("div"), i = document.createElement("div"), a = document.createElement("div");
    return n.style.width = "0px", n.style.pointerEvents = "none", r.style.pointerEvents = "none", i.style.display = "flex", a.appendChild(n), a.appendChild(r), i.appendChild(a), this.verticalScroller = n, this.horizontalScroller = r, e.appendChild(i), e.contentEditable = "false", e.classList.add(Wt + "scroller"), { scroller: e, verticalScroller: n, horizontalScroller: r };
  }
  getActualHeight() {
    return this.root.config.rows.reduce((e, n) => (e += n.height, e), 0);
  }
  getActualWidth() {
    return this.root.config.columns.reduce((e, n) => (e += n.width, e), 0);
  }
  updateScrollerSize() {
    const e = this.getActualHeight(), n = this.getActualWidth();
    this.setScrollerHeight(e), this.setScrollerWidth(n);
  }
  setScrollerHeight(e) {
    this.verticalScroller.style.height = e + "px";
  }
  setScrollerWidth(e) {
    this.horizontalScroller.style.width = e + "px";
  }
}
class vo {
  constructor(e) {
    U(this, "fontSize", 16);
    U(this, "fontColor", "black");
    U(this, "background", "white");
    U(this, "borderColor", "black");
    U(this, "selectedBackground", "#4287f5");
    U(this, "selectedFontColor", "#ffffff");
    e && Object.assign(this, e);
  }
}
class Zs {
  constructor(e, n) {
    U(this, "row");
    U(this, "column");
    this.row = e, this.column = n;
  }
}
class Js {
  constructor(e) {
    U(this, "value");
    U(this, "displayValue");
    U(this, "resultValue");
    U(this, "position");
    U(this, "style");
    this.value = e.value, this.displayValue = e.displayValue, this.resultValue = e.resultValue, this.position = e.position, this.style = e.style;
  }
}
let Br = class {
  constructor(e) {
    /** True value (data) */
    U(this, "value");
    /** Value to render */
    U(this, "displayValue");
    /** This refers to the values that were obtained by calculations, for example, after calculating the formula  */
    U(this, "resultValue");
    U(this, "position");
    U(this, "style", null);
    U(this, "cellsDependsOnThisCell", []);
    U(this, "dependedFromCells", []);
    this.value = e.value, this.displayValue = e.displayValue, this.resultValue = e.resultValue, this.position = e.position, this.style = e.style;
  }
  getSerializableCell() {
    return new Js({
      displayValue: this.displayValue,
      position: this.position,
      resultValue: this.resultValue,
      style: this.style,
      value: this.value
    });
  }
  changeStyles(e) {
    this.style = e;
  }
  changeValues(e) {
    Object.assign(this, e);
  }
  evalFormula(e) {
    this.value.substring(0, 1) === "=" && (this.resultValue = e.parser.parse(this.value.slice(1), {
      col: this.position.column,
      row: this.position.row
    }));
  }
  // private isCellInRange(root: Spreadsheet): boolean {
  //   const { column, row } = this.position;
  //   const { selectedRange } = root.selection;
  //   if (!selectedRange) return false;
  //   const isCellInRow =
  //     row >= Math.min(selectedRange.from.row, selectedRange.to.row) &&
  //     row <= Math.max(selectedRange.to.row, selectedRange.from.row);
  //   const isCellInCol =
  //     column >= Math.min(selectedRange.from.column, selectedRange.to.column) &&
  //     column <= Math.max(selectedRange.to.column, selectedRange.from.column);
  //   return isCellInCol && isCellInRow;
  // }
  render(e) {
    const n = new Gt(e.config, this.position);
    let { x: r, y: i } = n;
    const { height: a, width: c } = n, { ctx: h } = e;
    i -= e.viewport.top, r -= e.viewport.left;
    const p = this.style ?? e.styles.cells;
    h.clearRect(r, i, c, a), h.fillStyle = p.background, h.strokeStyle = "black", h.fillRect(r, i, c - 1, a - 1), h.strokeRect(r, i, c, a), h.fillStyle = p.fontColor, h.textAlign = "left", h.font = `${p.fontSize}px Arial`, h.textBaseline = "middle", h.fillText(this.displayValue, r + 2, i + a / 2);
  }
}, js = class {
  constructor(e) {
    U(this, "element");
    U(this, "ctx");
    U(this, "root");
    this.root = e;
    const n = document.createElement("canvas");
    n.classList.add(Wt + "sheet"), n.height = this.root.config.view.height, n.width = this.root.config.view.width, n.style.width = this.root.config.view.width + "px", n.style.height = this.root.config.view.height + "px", n.style.left = "0px", this.element = n;
    const r = this.element.getContext("2d");
    if (!r)
      throw new Error("Enable hardware acceleration");
    this.ctx = r;
  }
  getCellByCoords(e, n) {
    let r = 0, i = 0;
    for (; i <= n && (i += this.root.config.rows[r].height, !(i >= n)); )
      r++;
    let a = 0, c = 0;
    for (; c <= e && (c += this.root.config.columns[a].width, !(c >= e)); )
      a++;
    return new Zs(r, a);
  }
  renderCell(e) {
    const { column: n, row: r } = e;
    this.root.data[r][n].render(this.root);
  }
  getSelectionRange() {
    const { selectedCell: e, selectedRange: n } = this.root.selection;
    if (!(!e && !n)) {
      if (n) {
        const r = Math.min(n.from.row, n.to.row), i = Math.min(
          n.from.column,
          n.to.column
        ), a = Math.max(n.from.row, n.to.row), c = Math.max(
          n.from.column,
          n.to.column
        ), h = new Gt(this.root.config, {
          row: r,
          column: i
        });
        let p = 0;
        for (let l = i; l <= c; l++)
          p += this.root.config.columns[l].width;
        let u = 0;
        for (let l = r; l <= a; l++)
          u += this.root.config.rows[l].height;
        const o = h.x - this.root.viewport.left, s = h.y - this.root.viewport.top;
        return { x: o, y: s, height: u, width: p };
      }
      if (!n && e) {
        const r = new Gt(this.root.config, e);
        return r.x -= this.root.viewport.left, r.y -= this.root.viewport.top, r;
      }
    }
  }
  renderSelectionRange(e, n, r, i) {
    this.ctx.save(), this.ctx.strokeStyle = "#7da8ff", this.ctx.lineWidth = 3, this.ctx.strokeRect(e, n, r, i), this.ctx.fillStyle = "#7da8ff35", this.ctx.fillRect(e, n, r, i), this.ctx.restore();
  }
  renderSelection() {
    const e = this.getSelectionRange();
    if (!e)
      return;
    const { height: n, width: r, x: i, y: a } = e;
    this.renderSelectionRange(i, a, r, n);
  }
  renderSheet() {
    const e = this.root.viewport.firstRow, n = this.root.viewport.lastCol + 3, r = this.root.viewport.lastRow + 3, i = this.root.viewport.firstCol;
    for (let a = e; a <= r; a++)
      for (let c = i; c <= n && !(!this.root.config.columns[c] || !this.root.config.rows[a]); c++)
        this.renderCell({ column: c, row: a });
    this.renderSelection();
  }
};
class ea {
  constructor(e) {
    U(this, "element");
    U(this, "root");
    this.root = e;
    const n = document.createElement("div");
    n.classList.add(Wt + "spreadsheet_container"), this.element = n, this.changeElementSizes(this.root.viewProps);
  }
  changeElementSizes(e) {
    const { height: n, width: r } = e;
    this.element.style.width = r + this.root.rowsBarWidth + "px", this.element.style.height = n + this.root.columnsBarHeight + "px";
  }
}
class ta {
  constructor(e) {
    U(this, "element");
    U(this, "root");
    U(this, "height", 0);
    this.root = e;
    const n = document.createElement("div");
    n.classList.add(Wt + "toolbar"), this.element = n;
  }
}
class ri {
  constructor(e) {
    U(this, "rows");
    U(this, "columns");
    U(this, "view", {
      width: 800,
      height: 600
    });
    U(this, "onCellClick", null);
    U(this, "onSelectonChange", null);
    U(this, "onCellChange", null);
    U(this, "onCopy");
    this.columns = e.columns, this.rows = e.rows, this.view = e.view, this.onCellClick = e.onCellClick ?? null, this.onSelectonChange = e.onSelectionChange ?? null, this.onCellChange = e.onCellChange ?? null, this.onCopy = e.onCopy ?? null;
  }
}
class Fr {
  constructor() {
    U(this, "selectedCell", null);
    U(this, "selectedRange", null);
  }
}
class na {
  constructor() {
    U(this, "cells");
    this.cells = new vo();
  }
}
class ii {
  constructor(e, n) {
    U(this, "root");
    U(this, "top");
    U(this, "left");
    U(this, "right");
    U(this, "bottom");
    U(this, "firstRow");
    U(this, "lastRow");
    U(this, "firstCol");
    U(this, "lastCol");
    this.root = e, this.top = n.top, this.left = n.left, this.right = n.right, this.bottom = n.bottom, this.firstRow = this.getFirstRow(), this.lastCol = this.getFirstRow();
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
  updateValues(e) {
    this.top = e.top, this.left = e.left, this.right = e.right, this.bottom = e.bottom, this.firstRow = this.getFirstRow(), this.lastRow = this.getLastRow(), this.firstCol = this.getFirstCol(), this.lastCol = this.getLastCol();
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
let ra = class {
  constructor(e) {
    U(this, "width");
    U(this, "title");
    this.width = e.width, this.title = e.title;
  }
};
class ia {
  constructor(e) {
    U(this, "height");
    U(this, "title");
    this.height = e.height, this.title = e.title;
  }
}
function oa(t, e, n = !1) {
  const r = [];
  for (let i = 0; i <= t; i++) {
    const a = [];
    for (let c = 0; c <= e; c++) {
      const h = n ? `${i}:${c}` : "", p = new Br({
        displayValue: h,
        resultValue: h,
        value: h,
        position: {
          column: c,
          row: i
        },
        style: null
      });
      a.push(p);
    }
    r.push(a);
  }
  return r;
}
class sa {
  constructor(e) {
    U(this, "xPos");
    U(this, "colIdx");
    this.xPos = e.xPos, this.colIdx = e.colIdx;
  }
}
class aa {
  constructor(e) {
    U(this, "yPos");
    U(this, "rowIdx");
    this.yPos = e.yPos, this.rowIdx = e.rowIdx;
  }
}
class ca {
  constructor(e) {
    U(this, "columns");
    U(this, "rows");
    this.columns = e.columns, this.rows = e.rows;
  }
  getRowByYCoord(e) {
    let n = 0;
    for (let r = 0; r < this.rows.length && (n = r, !(e <= this.rows[r].yPos)); r++)
      ;
    return n;
  }
  getColumnByXCoord(e) {
    let n = 0;
    for (let r = 0; r < this.columns.length && (n = r, !(e <= this.columns[r].xPos)); r++)
      ;
    return n;
  }
}
class la {
  constructor(e) {
    U(this, "element");
    U(this, "root");
    U(this, "height", 35);
    U(this, "width");
    // private resizerWidth = 1;
    U(this, "ctx");
    this.root = e, this.element = this.createElement();
    const n = this.element.getContext("2d");
    if (!n)
      throw new Error("Enable hardware acceleration");
    this.ctx = n, this.width = this.root.viewProps.width;
  }
  createElement() {
    const e = document.createElement("canvas");
    return e.style.position = "absolute", e.style.height = this.height + "px", e.style.width = this.root.viewProps.width + "px", e.style.display = "block", e.style.borderLeft = "1px solid black", e.width = this.root.viewProps.width, e.height = this.height, e;
  }
  setElementPosition(e, n) {
    this.element.style.top = e + "px", this.element.style.left = n + "px";
  }
  isColumnSelected(e) {
    const { selectedCell: n, selectedRange: r } = this.root.selection;
    return n && n.column === e ? !0 : r ? e >= Math.min(r.from.column, r.to.column) && e <= Math.max(r.from.column, r.to.column) : !1;
  }
  // private getYCoordWithOffset(renderBox: RenderBox): number {
  //     const {y} = renderBox
  //     return y + this.root.toolbarHeight
  // }
  // private getXCoordWithOffset(renderBox: RenderBox): number {
  //     const {x} = renderBox
  //     return x
  // }
  renderText(e, n) {
    const { width: r, x: i } = n;
    this.ctx.fillStyle = "black", this.ctx.textAlign = "center", this.ctx.textBaseline = "middle", this.ctx.font = "12px Arial", this.ctx.fillText(
      this.root.config.columns[e].title,
      i + r / 2 - this.root.viewport.left,
      0 + this.height / 2
    );
  }
  renderRect(e, n) {
    const { width: r, x: i } = n, a = this.isColumnSelected(e);
    this.ctx.fillStyle = a ? "#c7ebff" : "white", this.ctx.strokeStyle = "black", this.ctx.lineWidth = 1;
    const c = i - this.root.viewport.left;
    this.ctx.fillRect(c - 1, 0, r, this.height), this.ctx.strokeRect(c - 1, 0, r, this.height);
  }
  renderSingleColumn(e) {
    const n = new Gt(this.root.config, {
      row: 0,
      column: e
    });
    this.renderRect(e, n), this.renderText(e, n);
  }
  renderBar() {
    const e = this.root.viewport.lastCol + 3, n = this.root.viewport.firstCol;
    this.ctx.beginPath(), this.ctx.strokeStyle = "black", this.ctx.lineWidth = 1, this.ctx.moveTo(0, 0), this.ctx.lineTo(0, this.height), this.ctx.closePath(), this.ctx.stroke();
    for (let r = n; r <= e && this.root.config.columns[r]; r++)
      this.renderSingleColumn(r);
  }
}
class ua {
  constructor(e) {
    U(this, "element");
    U(this, "ctx");
    U(this, "root");
    U(this, "width", 35);
    U(this, "height");
    U(this, "resizerHeight", 1);
    this.root = e, this.element = this.createElement();
    const n = this.element.getContext("2d");
    if (!n)
      throw new Error("Enable hardware acceleration");
    this.ctx = n, this.height = this.root.viewProps.height;
  }
  createElement() {
    const e = document.createElement("canvas");
    return e.style.position = "absolute", e.style.height = this.root.viewProps.height + "px", e.style.width = this.width + "px", e.style.display = "block", e.style.borderTop = "1px solid black", e.width = this.width, e.height = this.root.viewProps.height, e;
  }
  setElementPosition(e, n) {
    this.element.style.top = e + "px", this.element.style.left = n + "px";
  }
  isRowSelected(e) {
    const { selectedCell: n, selectedRange: r } = this.root.selection;
    return n && n.row === e ? !0 : r ? e >= Math.min(r.from.row, r.to.row) && e <= Math.max(r.from.row, r.to.row) : !1;
  }
  renderText(e, n) {
    const { y: r, height: i } = n;
    this.ctx.fillStyle = "black", this.ctx.textAlign = "center", this.ctx.textBaseline = "middle", this.ctx.font = "12px Arial", this.ctx.fillText(
      this.root.config.rows[e].title,
      this.width / 2,
      r - this.root.viewport.top + i / 2
    );
  }
  renderRect(e, n) {
    const { y: r, height: i } = n, a = this.isRowSelected(e);
    this.ctx.fillStyle = a ? "#c7ebff" : "white", this.ctx.strokeStyle = "black", this.ctx.lineWidth = this.resizerHeight;
    const c = r - this.root.viewport.top;
    this.ctx.fillRect(0, c - 1, this.width, i), this.ctx.strokeRect(0, c - 1, this.width, i);
  }
  renderSingleRow(e) {
    const n = new Gt(this.root.config, {
      column: 0,
      row: e
    });
    this.renderRect(e, n), this.renderText(e, n);
  }
  renderBar() {
    const e = this.root.viewport.lastRow + 3, n = this.root.viewport.firstRow;
    this.ctx.beginPath(), this.ctx.moveTo(0, 0), this.ctx.strokeStyle = "black", this.ctx.lineWidth = 16, this.ctx.lineTo(35, 0), this.ctx.closePath(), this.ctx.stroke();
    for (let r = n; r <= e && this.root.config.rows[r]; r++)
      this.renderSingleRow(r);
  }
}
class fa {
  constructor(e) {
    U(this, "saved", null);
    U(this, "root");
    this.root = e;
  }
  copy(e, n) {
    const r = e.map((i) => i.map((a) => a.displayValue).join("	")).join(`
`);
    this.saved = e, navigator.clipboard.writeText(r), this.root.events.dispatch({
      type: yt.COPY_CELLS,
      data: e,
      dataAsString: r,
      range: n
    });
  }
  paste(e, { column: n, row: r }, i) {
    if (!this.saved) {
      if (!i.clipboardData)
        return;
      const h = i.clipboardData.getData("text");
      try {
        const u = h.split(`
`).map((l) => l.split("	")).map((l) => l.map((f) => {
          const v = {
            displayValue: f,
            position: {
              column: n,
              row: r
            },
            resultValue: f,
            style: new vo(),
            value: f
          };
          return new Br(v);
        })), o = u.length, s = u[0] ? u[0].length : 0;
        for (let l = 0; l < o; l++)
          for (let f = 0; f < s; f++) {
            const v = u[l][f], d = {
              column: n + f,
              row: r + l
            }, g = {
              displayValue: v.displayValue,
              value: v.value,
              style: v.style
            };
            e.changeCellValues(d, g, !1);
          }
      } catch (p) {
        console.error("Cannot read clipboard. ", p);
      }
      e.renderSheet();
      return;
    }
    const a = this.saved.length, c = this.saved[0] ? this.saved[0].length : 0;
    for (let h = 0; h < a; h++)
      for (let p = 0; p < c; p++) {
        const u = this.saved[h][p], o = {
          column: n + p,
          row: r + h
        }, s = {
          displayValue: u.displayValue,
          value: u.value,
          style: u.style
        };
        e.changeCellValues(o, s, !1);
      }
  }
}
var go = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ha(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function pa(t) {
  if (t.__esModule)
    return t;
  var e = t.default;
  if (typeof e == "function") {
    var n = function r() {
      if (this instanceof r) {
        var i = [null];
        i.push.apply(i, arguments);
        var a = Function.bind.apply(e, i);
        return new a();
      }
      return e.apply(this, arguments);
    };
    n.prototype = e.prototype;
  } else
    n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(t).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(t, r);
    Object.defineProperty(n, r, i.get ? i : {
      enumerable: !0,
      get: function() {
        return t[r];
      }
    });
  }), n;
}
let da = class {
  constructor(e, n) {
    if (e == null && n == null)
      this._data = [], this._refs = [];
    else {
      if (e.length !== n.length)
        throw Error("Collection: data length should match references length.");
      this._data = e, this._refs = n;
    }
  }
  get data() {
    return this._data;
  }
  get refs() {
    return this._refs;
  }
  get length() {
    return this._data.length;
  }
  /**
   * Add data and references to this collection.
   * @param {{}} obj - data
   * @param {{}} ref - reference
   */
  add(e, n) {
    this._data.push(e), this._refs.push(n);
  }
};
var Gn = da, or, oi;
function ge() {
  if (oi)
    return or;
  oi = 1;
  const t = he(), e = Gn, n = {
    NUMBER: 0,
    ARRAY: 1,
    BOOLEAN: 2,
    STRING: 3,
    RANGE_REF: 4,
    // can be 'A:C' or '1:4', not only 'A1:C3'
    CELL_REF: 5,
    COLLECTIONS: 6,
    // Unions of references
    NUMBER_NO_BOOLEAN: 10
  }, r = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368e3, 20922789888e3, 355687428096e3, 6402373705728e3, 121645100408832e3, 243290200817664e4, 5109094217170944e4, 11240007277776077e5, 2585201673888498e7, 6204484017332394e8, 15511210043330986e9, 40329146112660565e10, 10888869450418352e12, 30488834461171387e13, 8841761993739702e15, 26525285981219107e16, 8222838654177922e18, 2631308369336935e20, 8683317618811886e21, 29523279903960416e22, 10333147966386145e24, 37199332678990125e25, 13763753091226346e27, 5230226174666011e29, 20397882081197444e30, 8159152832478977e32, 3345252661316381e34, 140500611775288e37, 6041526306337383e37, 2658271574788449e39, 11962222086548019e40, 5502622159812089e42, 25862324151116818e43, 12413915592536073e45, 6082818640342675e47, 30414093201713376e48, 15511187532873822e50, 8065817517094388e52, 42748832840600255e53, 2308436973392414e56, 12696403353658276e57, 7109985878048635e59, 40526919504877214e60, 23505613312828785e62, 13868311854568984e64, 832098711274139e67, 5075802138772248e68, 3146997326038794e70, 198260831540444e73, 12688693218588417e73, 8247650592082472e75, 5443449390774431e77, 3647111091818868e79, 24800355424368305e80, 1711224524281413e83, 11978571669969892e84, 8504785885678623e86, 61234458376886085e87, 44701154615126844e89, 3307885441519386e92, 248091408113954e95, 18854947016660504e95, 14518309202828587e97, 11324281178206297e99, 8946182130782976e101, 7156945704626381e103, 5797126020747368e105, 4753643337012842e107, 3945523969720659e109, 3314240134565353e111, 281710411438055e114, 24227095383672734e114, 2107757298379528e117, 18548264225739844e118, 1650795516090846e121, 14857159644817615e122, 1352001527678403e125, 12438414054641308e126, 11567725070816416e128, 1087366156656743e131, 1032997848823906e133, 9916779348709496e134, 9619275968248212e136, 9426890448883248e138, 9332621544394415e140, 9332621544394415e142], i = {};
  Object.keys(n).forEach((o) => {
    i[n[o]] = o;
  });
  class a {
    constructor() {
      this.Types = n, this.type2Number = {
        number: n.NUMBER,
        boolean: n.BOOLEAN,
        string: n.STRING,
        object: -1
      };
    }
    checkFunctionResult(s) {
      if (typeof s === "number") {
        if (isNaN(s))
          return t.VALUE;
        if (!isFinite(s))
          return t.NUM;
      }
      return s ?? t.NULL;
    }
    /**
     * Flatten an array
     * @param {Array} arr1
     * @returns {*}
     */
    flattenDeep(s) {
      return s.reduce((l, f) => Array.isArray(f) ? l.concat(this.flattenDeep(f)) : l.concat(f), []);
    }
    /**
     *
     * @param obj
     * @param isArray - if it is an array: [1,2,3], will extract the first element
     * @param allowBoolean - Allow parse boolean into number
     * @returns {number|FormulaError}
     */
    acceptNumber(s, l = !0, f = !0) {
      if (s instanceof t)
        return s;
      let v;
      if (typeof s == "number")
        v = s;
      else if (typeof s == "boolean")
        if (f)
          v = Number(s);
        else
          throw t.VALUE;
      else if (typeof s == "string") {
        if (s.length === 0 || (v = Number(s), v !== v))
          throw t.VALUE;
      } else if (Array.isArray(s))
        if (l)
          v = this.acceptNumber(s[0][0]);
        else if (s[0].length === 1)
          v = this.acceptNumber(s[0][0]);
        else
          throw t.VALUE;
      else
        throw Error("Unknown type in FormulaHelpers.acceptNumber");
      return v;
    }
    /**
     * Flatten parameters to 1D array.
     * @see {@link FormulaHelpers.accept}
     * @param {Array} params - Parameter that needs to flatten.
     * @param {Types|null} valueType - The type each item should be,
     *                          null if allows any type. This only applies to literals.
     * @param {boolean} allowUnion - Allow union, e.g. (A1:C1, E4:F3)
     * @param {function} hook - Invoked after parsing each item.
     *                         of the array.
     * @param {*} [defValue=null] - The value if an param is omitted. i.e. SUM(1,2,,,,,)
     * @param {number} [minSize=1] - The minimum size of the parameters
     */
    flattenParams(s, l, f, v, d = null, g = 1) {
      if (s.length < g)
        throw t.ARG_MISSING([l]);
      d == null && (d = l === n.NUMBER ? 0 : l == null ? null : ""), s.forEach((E) => {
        const { isCellRef: A, isRangeRef: m, isArray: N } = E, y = E.value instanceof e, R = !A && !m && !N && !y, T = { isLiteral: R, isCellRef: A, isRangeRef: m, isArray: N, isUnion: y };
        if (R)
          E.omitted ? E = d : E = this.accept(E, l, d), v(E, T);
        else if (A)
          v(E.value, T);
        else if (y) {
          if (!f)
            throw t.VALUE;
          E = E.value.data, E = this.flattenDeep(E), E.forEach((w) => {
            v(w, T);
          });
        } else
          (m || N) && (E = this.flattenDeep(E.value), E.forEach((w) => {
            v(w, T);
          }));
      });
    }
    /**
     * Check if the param valid, return the parsed param.
     * If type is not given, return the un-parsed param.
     * @param {*} param
     * @param {number|null} [type] - The expected type
     *           NUMBER: Expect a single number,
     *           ARRAY: Expect an flatten array,
     *           BOOLEAN: Expect a single boolean,
     *           STRING: Expect a single string,
     *           COLLECTIONS: Expect an Array of the above types
     *           null: Do not parse the value, return it directly.
     *           The collection is not a flatted array.
     * @param {*} [defValue] - Default value if the param is not given.
     *               if undefined, this param is required, a Error will throw if not given.
     *               if null, and param is undefined, null will be returned.
     * @param {boolean} [flat=true] - If the array should be flattened,
     *                      only applicable when type is ARRAY.
     *                      If false, collection is disallowed.
     * @param {boolean} allowSingleValue - If pack single value into 2d array,
     *                     only applicable when type is ARRAY.
     * @return {string|number|boolean|{}|Array}
     */
    accept(s, l = null, f, v = !0, d = !1) {
      if (Array.isArray(l) && (l = l[0]), s == null && f === void 0)
        throw t.ARG_MISSING([l]);
      if (s == null)
        return f;
      if (typeof s != "object" || Array.isArray(s))
        return s;
      const g = s.isArray;
      if (s.value != null && (s = s.value), l == null)
        return s;
      if (s instanceof t)
        throw s;
      if (l === n.ARRAY) {
        if (Array.isArray(s))
          return v ? this.flattenDeep(s) : s;
        if (s instanceof e)
          throw t.VALUE;
        if (d)
          return v ? [s] : [[s]];
        throw t.VALUE;
      } else if (l === n.COLLECTIONS)
        return s;
      g && (s = s[0][0]);
      const E = this.type(s);
      if (l === n.STRING)
        E === n.BOOLEAN ? s = s ? "TRUE" : "FALSE" : s = `${s}`;
      else if (l === n.BOOLEAN) {
        if (E === n.STRING)
          throw t.VALUE;
        E === n.NUMBER && (s = !!s);
      } else if (l === n.NUMBER)
        s = this.acceptNumber(s, !1);
      else if (l === n.NUMBER_NO_BOOLEAN)
        s = this.acceptNumber(s, !1, !1);
      else
        throw t.VALUE;
      return s;
    }
    type(s) {
      let l = this.type2Number[typeof s];
      return l === -1 && (Array.isArray(s) ? l = n.ARRAY : s.ref ? s.ref.from ? l = n.RANGE_REF : l = n.CELL_REF : s instanceof e && (l = n.COLLECTIONS)), l;
    }
    isRangeRef(s) {
      return s.ref && s.ref.from;
    }
    isCellRef(s) {
      return s.ref && !s.ref.from;
    }
    /**
     * Helper function for SUMIF, AVERAGEIF,...
     * @param context
     * @param range1
     * @param range2
     */
    retrieveRanges(s, l, f) {
      return f = u.extend(l, f), l = this.retrieveArg(s, l), l = c.accept(l, n.ARRAY, void 0, !1, !0), f !== l ? (f = this.retrieveArg(s, f), f = c.accept(f, n.ARRAY, void 0, !1, !0)) : f = l, [l, f];
    }
    retrieveArg(s, l) {
      if (l === null)
        return { value: 0, isArray: !1, omitted: !0 };
      const f = s.utils.extractRefValue(l);
      return { value: f.val, isArray: f.isArray, ref: l.ref };
    }
  }
  const c = new a(), h = {
    /**
     * @param {string|*} obj
     * @returns {*}
     */
    isWildCard: (o) => typeof o == "string" ? /[*?]/.test(o) : !1,
    toRegex: (o, s) => RegExp(o.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/([^~]??)[?]/g, "$1.").replace(/([^~]??)[*]/g, "$1.*").replace(/~([?*])/g, "$1"), s)
  }, p = {
    /**
     * Parse criteria, support comparison and wild card match.
     * @param {string|number} criteria
     * @return {{op: string, value: string|number|boolean|RegExp, match: boolean|undefined}} - The parsed criteria.
     */
    parse: (o) => {
      const s = typeof o;
      if (s === "string") {
        const l = o.toUpperCase();
        if (l === "TRUE" || l === "FALSE")
          return { op: "=", value: l === "TRUE" };
        const f = o.match(/(<>|>=|<=|>|<|=)(.*)/);
        if (f) {
          let v = f[1], d;
          if (isNaN(f[2])) {
            const g = f[2].toUpperCase();
            if (g === "TRUE" || g === "FALSE")
              d = g === "TRUE";
            else if (/#NULL!|#DIV\/0!|#VALUE!|#NAME\?|#NUM!|#N\/A|#REF!/.test(f[2]))
              d = new t(f[2]);
            else if (d = f[2], h.isWildCard(d))
              return { op: "wc", value: h.toRegex(d), match: v === "=" };
          } else
            d = Number(f[2]);
          return { op: v, value: d };
        } else
          return h.isWildCard(o) ? { op: "wc", value: h.toRegex(o), match: !0 } : { op: "=", value: o };
      } else {
        if (s === "boolean" || s === "number" || Array.isArray(o) || o instanceof t)
          return { op: "=", value: o };
        throw Error(`Criteria.parse: type ${typeof o} not support`);
      }
    }
  }, u = {
    columnNumberToName: (o) => {
      let s = o, l = "", f = 0;
      for (; s > 0; )
        f = (s - 1) % 26, l = String.fromCharCode("A".charCodeAt(0) + f) + l, s = Math.floor((s - f) / 26);
      return l;
    },
    columnNameToNumber: (o) => {
      o = o.toUpperCase();
      const s = o.length;
      let l = 0;
      for (let f = 0; f < s; f++) {
        const v = o.charCodeAt(f);
        isNaN(v) || (l += (v - 64) * 26 ** (s - f - 1));
      }
      return l;
    },
    /**
     * Extend range2 to match with the dimension in range1.
     * @param {{ref: {}}} range1
     * @param {{ref: {}}} [range2]
     */
    extend: (o, s) => {
      if (s == null)
        return o;
      let l, f;
      if (c.isCellRef(o))
        l = 0, f = 0;
      else if (c.isRangeRef(o))
        l = o.ref.to.row - o.ref.from.row, f = o.ref.to.col - o.ref.from.col;
      else
        throw Error("Address.extend should not reach here.");
      return c.isCellRef(s) ? (l > 0 || f > 0) && (s = {
        ref: {
          from: { col: s.ref.col, row: s.ref.row },
          to: { row: s.ref.row + l, col: s.ref.col + f }
        }
      }) : (s.ref.to.row = s.ref.from.row + l, s.ref.to.col = s.ref.from.col + f), s;
    }
  };
  return or = {
    FormulaHelpers: c,
    Types: n,
    ReversedTypes: i,
    Factorials: r,
    WildCard: h,
    Criteria: p,
    Address: u
  }, or;
}
var sr, si;
function he() {
  if (si)
    return sr;
  si = 1;
  class t extends Error {
    /**
     * @param {string} error - error code, i.e. #NUM!
     * @param {string} [msg] - detailed error message
     * @param {object|Error} [details]
     * @returns {FormulaError}
     */
    constructor(n, r, i) {
      if (super(r), r == null && i == null && t.errorMap.has(n))
        return t.errorMap.get(n);
      r == null && i == null ? (this._error = n, t.errorMap.set(n, this)) : this._error = n, this.details = i;
    }
    /**
     * Get the error name.
     * @returns {string} formula error
     */
    get error() {
      return this._error;
    }
    get name() {
      return this._error;
    }
    /**
     * Return true if two errors are same.
     * @param {FormulaError} err
     * @returns {boolean} if two errors are same.
     */
    equals(n) {
      return n instanceof t && n._error === this._error;
    }
    /**
     * Return the formula error in string representation.
     * @returns {string} the formula error in string representation.
     */
    toString() {
      return this._error;
    }
  }
  return t.errorMap = /* @__PURE__ */ new Map(), t.DIV0 = new t("#DIV/0!"), t.NA = new t("#N/A"), t.NAME = new t("#NAME?"), t.NULL = new t("#NULL!"), t.NUM = new t("#NUM!"), t.REF = new t("#REF!"), t.VALUE = new t("#VALUE!"), t.NOT_IMPLEMENTED = (e) => new t("#NAME?", `Function ${e} is not implemented.`), t.TOO_MANY_ARGS = (e) => new t("#N/A", `Function ${e} has too many arguments.`), t.ARG_MISSING = (e) => {
    const { Types: n } = ge();
    return new t("#N/A", `Argument type ${e.map((r) => n[r]).join(", ")} is missing.`);
  }, t.ERROR = (e, n) => new t("#ERROR!", e, n), sr = t, sr;
}
let _e = class {
};
_e.version = "0.10.3";
function bt(t) {
  let e = "", n = t.length - 1;
  for (; n >= 0; )
    e += t.charAt(n--);
  return e;
}
function ke(t, e) {
  let n = "";
  for (; n.length < e; )
    n += t;
  return n;
}
function ze(t, e) {
  let n = "" + t;
  return n.length >= e ? n : ke("0", e - n.length) + n;
}
function ar(t, e) {
  let n = "" + t;
  return n.length >= e ? n : ke(" ", e - n.length) + n;
}
function hn(t, e) {
  let n = "" + t;
  return n.length >= e ? n : n + ke(" ", e - n.length);
}
function va(t, e) {
  let n = "" + Math.round(t);
  return n.length >= e ? n : ke("0", e - n.length) + n;
}
function ga(t, e) {
  let n = "" + t;
  return n.length >= e ? n : ke("0", e - n.length) + n;
}
const ai = Math.pow(2, 32);
function Dt(t, e) {
  if (t > ai || t < -ai)
    return va(t, e);
  const n = Math.round(t);
  return ga(n, e);
}
function Ln(t, e) {
  return e = e || 0, t.length >= 7 + e && (t.charCodeAt(e) | 32) === 103 && (t.charCodeAt(e + 1) | 32) === 101 && (t.charCodeAt(e + 2) | 32) === 110 && (t.charCodeAt(e + 3) | 32) === 101 && (t.charCodeAt(e + 4) | 32) === 114 && (t.charCodeAt(e + 5) | 32) === 97 && (t.charCodeAt(e + 6) | 32) === 108;
}
const ci = [
  ["Sun", "Sunday"],
  ["Mon", "Monday"],
  ["Tue", "Tuesday"],
  ["Wed", "Wednesday"],
  ["Thu", "Thursday"],
  ["Fri", "Friday"],
  ["Sat", "Saturday"]
], cr = [
  ["J", "Jan", "January"],
  ["F", "Feb", "February"],
  ["M", "Mar", "March"],
  ["A", "Apr", "April"],
  ["M", "May", "May"],
  ["J", "Jun", "June"],
  ["J", "Jul", "July"],
  ["A", "Aug", "August"],
  ["S", "Sep", "September"],
  ["O", "Oct", "October"],
  ["N", "Nov", "November"],
  ["D", "Dec", "December"]
];
function Eo(t) {
  t[0] = "General", t[1] = "0", t[2] = "0.00", t[3] = "#,##0", t[4] = "#,##0.00", t[9] = "0%", t[10] = "0.00%", t[11] = "0.00E+00", t[12] = "# ?/?", t[13] = "# ??/??", t[14] = "m/d/yy", t[15] = "d-mmm-yy", t[16] = "d-mmm", t[17] = "mmm-yy", t[18] = "h:mm AM/PM", t[19] = "h:mm:ss AM/PM", t[20] = "h:mm", t[21] = "h:mm:ss", t[22] = "m/d/yy h:mm", t[37] = "#,##0 ;(#,##0)", t[38] = "#,##0 ;[Red](#,##0)", t[39] = "#,##0.00;(#,##0.00)", t[40] = "#,##0.00;[Red](#,##0.00)", t[45] = "mm:ss", t[46] = "[h]:mm:ss", t[47] = "mmss.0", t[48] = "##0.0E+0", t[49] = "@", t[56] = '"上午/下午 "hh"時"mm"分"ss"秒 "', t[65535] = "General";
}
const _t = {};
Eo(_t);
function pn(t, e, n) {
  const r = t < 0 ? -1 : 1;
  let i = t * r, a = 0, c = 1, h = 0, p = 1, u = 0, o = 0, s = Math.floor(i);
  for (; u < e && (s = Math.floor(i), h = s * c + a, o = s * u + p, !(i - s < 5e-8)); )
    i = 1 / (i - s), a = c, c = h, p = u, u = o;
  if (o > e && (u > e ? (o = p, h = a) : (o = u, h = c)), !n)
    return [0, r * h, o];
  const l = Math.floor(r * h / o);
  return [l, r * h - l * o, o];
}
function Zt(t, e, n) {
  if (t > 2958465 || t < 0)
    return null;
  let r = t | 0, i = Math.floor(86400 * (t - r)), a = 0, c = [];
  const h = { D: r, T: i, u: 86400 * (t - r) - i, y: 0, m: 0, d: 0, H: 0, M: 0, S: 0, q: 0 };
  if (Math.abs(h.u) < 1e-6 && (h.u = 0), e && e.date1904 && (r += 1462), h.u > 0.9999 && (h.u = 0, ++i === 86400 && (h.T = i = 0, ++r, ++h.D)), r === 60)
    c = n ? [1317, 10, 29] : [1900, 2, 29], a = 3;
  else if (r === 0)
    c = n ? [1317, 8, 29] : [1900, 1, 0], a = 6;
  else {
    r > 60 && --r;
    const p = new Date(1900, 0, 1);
    p.setDate(p.getDate() + r - 1), c = [p.getFullYear(), p.getMonth() + 1, p.getDate()], a = p.getDay(), r < 60 && (a = (a + 6) % 7), n && (a = Ra());
  }
  return h.y = c[0], h.m = c[1], h.d = c[2], h.S = i % 60, i = Math.floor(i / 60), h.M = i % 60, i = Math.floor(i / 60), h.H = i, h.q = a, h;
}
_e.parse_date_code = Zt;
const mo = new Date(1899, 11, 31, 0, 0, 0), Ea = mo.getTime(), ma = new Date(1900, 2, 1, 0, 0, 0);
function Ro(t, e) {
  let n = t.getTime();
  return e ? n -= 1461 * 24 * 60 * 60 * 1e3 : t >= ma && (n += 24 * 60 * 60 * 1e3), (n - (Ea + (t.getTimezoneOffset() - mo.getTimezoneOffset()) * 6e4)) / (24 * 60 * 60 * 1e3);
}
function No(t) {
  return t.toString(10);
}
_e._general_int = No;
const Ao = function() {
  const e = /\.(\d*[1-9])0+$/, n = /\.0*$/, r = /\.(\d*[1-9])0+/, i = /\.0*[Ee]/, a = /(E[+-])(\d)$/;
  function c(o) {
    const s = o < 0 ? 12 : 11;
    let l = u(o.toFixed(12));
    return l.length <= s || (l = o.toPrecision(10), l.length <= s) ? l : o.toExponential(5);
  }
  function h(o) {
    let s = o.toFixed(11).replace(e, ".$1");
    return s.length > (o < 0 ? 12 : 11) && (s = o.toPrecision(6)), s;
  }
  function p(o) {
    for (let s = 0; s !== o.length; ++s)
      if ((o.charCodeAt(s) | 32) === 101)
        return o.replace(r, ".$1").replace(i, "E").replace("e", "E").replace(a, "$10$2");
    return o;
  }
  function u(o) {
    return o.indexOf(".") > -1 ? o.replace(n, "").replace(e, ".$1") : o;
  }
  return function(s) {
    let l = Math.floor(Math.log(Math.abs(s)) * Math.LOG10E), f;
    return l >= -4 && l <= -1 ? f = s.toPrecision(10 + l) : Math.abs(l) <= 9 ? f = c(s) : l === 10 ? f = s.toFixed(10).substr(0, 12) : f = h(s), u(p(f));
  };
}();
_e._general_num = Ao;
function _n(t, e) {
  switch (typeof t) {
    case "string":
      return t;
    case "boolean":
      return t ? "TRUE" : "FALSE";
    case "number":
      return (t | 0) === t ? No(t) : Ao(t);
    case "undefined":
      return "";
    case "object":
      if (t == null)
        return "";
      if (t instanceof Date)
        return Io(14, Ro(t, e && e.date1904), e);
  }
  throw new Error("unsupported value in General format: " + t);
}
_e._general = _n;
function Ra() {
  return 0;
}
function Na(t, e, n, r) {
  let i = "", a = 0, c = 0, h = n.y, p, u = 0;
  switch (t) {
    case 98:
      h = n.y + 543;
    case 121:
      switch (e.length) {
        case 1:
        case 2:
          p = h % 100, u = 2;
          break;
        default:
          p = h % 1e4, u = 4;
          break;
      }
      break;
    case 109:
      switch (e.length) {
        case 1:
        case 2:
          p = n.m, u = e.length;
          break;
        case 3:
          return cr[n.m - 1][1];
        case 5:
          return cr[n.m - 1][0];
        default:
          return cr[n.m - 1][2];
      }
      break;
    case 100:
      switch (e.length) {
        case 1:
        case 2:
          p = n.d, u = e.length;
          break;
        case 3:
          return ci[n.q][0];
        default:
          return ci[n.q][1];
      }
      break;
    case 104:
      switch (e.length) {
        case 1:
        case 2:
          p = 1 + (n.H + 11) % 12, u = e.length;
          break;
        default:
          throw "bad hour format: " + e;
      }
      break;
    case 72:
      switch (e.length) {
        case 1:
        case 2:
          p = n.H, u = e.length;
          break;
        default:
          throw "bad hour format: " + e;
      }
      break;
    case 77:
      switch (e.length) {
        case 1:
        case 2:
          p = n.M, u = e.length;
          break;
        default:
          throw "bad minute format: " + e;
      }
      break;
    case 115:
      if (e !== "s" && e !== "ss" && e !== ".0" && e !== ".00" && e !== ".000")
        throw "bad second format: " + e;
      return n.u === 0 && (e === "s" || e === "ss") ? ze(n.S, e.length) : (r >= 2 ? c = r === 3 ? 1e3 : 100 : c = r === 1 ? 10 : 1, a = Math.round(c * (n.S + n.u)), a >= 60 * c && (a = 0), e === "s" ? a === 0 ? "0" : "" + a / c : (i = ze(a, 2 + r), e === "ss" ? i.substr(0, 2) : "." + i.substr(2, e.length - 1)));
    case 90:
      switch (e) {
        case "[h]":
        case "[hh]":
          p = n.D * 24 + n.H;
          break;
        case "[m]":
        case "[mm]":
          p = (n.D * 24 + n.H) * 60 + n.M;
          break;
        case "[s]":
        case "[ss]":
          p = ((n.D * 24 + n.H) * 60 + n.M) * 60 + Math.round(n.S + n.u);
          break;
        default:
          throw "bad abstime format: " + e;
      }
      u = e.length === 3 ? 1 : 2;
      break;
    case 101:
      p = h, u = 1;
  }
  return u > 0 ? ze(p, u) : "";
}
function Rt(t) {
  if (t.length <= 3)
    return t;
  let n = t.length % 3, r = t.substr(0, n);
  for (; n !== t.length; n += 3)
    r += (r.length > 0 ? "," : "") + t.substr(n, 3);
  return r;
}
const ft = function() {
  const e = /%/g;
  function n(y, R, T) {
    const w = R.replace(e, ""), C = R.length - w.length;
    return ft(y, w, T * Math.pow(10, 2 * C)) + ke("%", C);
  }
  function r(y, R, T) {
    let w = R.length - 1;
    for (; R.charCodeAt(w - 1) === 44; )
      --w;
    return ft(y, R.substr(0, w), T / Math.pow(10, 3 * (R.length - w)));
  }
  function i(y, R) {
    let T, w = y.indexOf("E") - y.indexOf(".") - 1;
    if (y.match(/^#+0.0E\+0$/)) {
      if (R === 0)
        return "0.0E+0";
      if (R < 0)
        return "-" + i(y, -R);
      let C = y.indexOf(".");
      C === -1 && (C = y.indexOf("E"));
      let M = Math.floor(Math.log(R) * Math.LOG10E) % C;
      if (M < 0 && (M += C), T = (R / Math.pow(10, M)).toPrecision(w + 1 + (C + M) % C), T.indexOf("e") === -1) {
        const _ = Math.floor(Math.log(R) * Math.LOG10E);
        for (T.indexOf(".") === -1 ? T = T.charAt(0) + "." + T.substr(1) + "E+" + (_ - T.length + M) : T += "E+" + (_ - M); T.substr(0, 2) === "0."; )
          T = T.charAt(0) + T.substr(2, C) + "." + T.substr(2 + C), T = T.replace(/^0+([1-9])/, "$1").replace(/^0+\./, "0.");
        T = T.replace(/\+-/, "-");
      }
      T = T.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function(_, W, F, S) {
        return W + F + S.substr(0, (C + M) % C) + "." + S.substr(M) + "E";
      });
    } else
      T = R.toExponential(w);
    return y.match(/E\+00$/) && T.match(/e[+-]\d$/) && (T = T.substr(0, T.length - 1) + "0" + T.charAt(T.length - 1)), y.match(/E\-/) && T.match(/e\+/) && (T = T.replace(/e\+/, "e")), T.replace("e", "E");
  }
  const a = /# (\?+)( ?)\/( ?)(\d+)/;
  function c(y, R, T) {
    const w = parseInt(y[4], 10), C = Math.round(R * w), M = Math.floor(C / w);
    let _ = C - M * w, W = w;
    return T + (M === 0 ? "" : "" + M) + " " + (_ === 0 ? ke(" ", y[1].length + 1 + y[4].length) : ar(_, y[1].length) + y[2] + "/" + y[3] + ze(W, y[4].length));
  }
  function h(y, R, T) {
    return T + (R === 0 ? "" : "" + R) + ke(" ", y[1].length + 2 + y[4].length);
  }
  const p = /^#*0*\.([0#]+)/, u = /\).*[0#]/, o = /\(###\) ###\\?-####/;
  function s(y) {
    let R = "", T;
    for (let w = 0; w !== y.length; ++w)
      switch (T = y.charCodeAt(w)) {
        case 35:
          break;
        case 63:
          R += " ";
          break;
        case 48:
          R += "0";
          break;
        default:
          R += String.fromCharCode(T);
      }
    return R;
  }
  function l(y, R) {
    const T = Math.pow(10, R);
    return "" + Math.round(y * T) / T;
  }
  function f(y, R) {
    return R < ("" + Math.round((y - Math.floor(y)) * Math.pow(10, R))).length ? 0 : Math.round((y - Math.floor(y)) * Math.pow(10, R));
  }
  function v(y, R) {
    return R < ("" + Math.round((y - Math.floor(y)) * Math.pow(10, R))).length ? 1 : 0;
  }
  function d(y) {
    return y < 2147483647 && y > -2147483648 ? "" + (y >= 0 ? y | 0 : y - 1 | 0) : "" + Math.floor(y);
  }
  function g(y, R, T) {
    if (y.charCodeAt(0) === 40 && !R.match(u)) {
      const G = R.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
      return T >= 0 ? g("n", G, T) : "(" + g("n", G, -T) + ")";
    }
    if (R.charCodeAt(R.length - 1) === 44)
      return r(y, R, T);
    if (R.indexOf("%") !== -1)
      return n(y, R, T);
    if (R.indexOf("E") !== -1)
      return i(R, T);
    if (R.charCodeAt(0) === 36)
      return "$" + g(y, R.substr(R.charAt(1) == " " ? 2 : 1), T);
    let w, C, M, _, W = Math.abs(T), F = T < 0 ? "-" : "";
    if (R.match(/^00+$/))
      return F + Dt(W, R.length);
    if (R.match(/^[#?]+$/))
      return w = Dt(T, 0), w === "0" && (w = ""), w.length > R.length ? w : s(R.substr(0, R.length - w.length)) + w;
    if (C = R.match(a))
      return c(C, W, F);
    if (R.match(/^#+0+$/))
      return F + Dt(W, R.length - R.indexOf("0"));
    if (C = R.match(p))
      return w = l(T, C[1].length).replace(/^([^\.]+)$/, "$1." + s(C[1])).replace(/\.$/, "." + s(C[1])).replace(/\.(\d*)$/, function(G, J) {
        return "." + J + ke("0", s(C[1]).length - J.length);
      }), R.indexOf("0.") !== -1 ? w : w.replace(/^0\./, ".");
    if (R = R.replace(/^#+([0.])/, "$1"), C = R.match(/^(0*)\.(#*)$/))
      return F + l(W, C[2].length).replace(/\.(\d*[1-9])0*$/, ".$1").replace(/^(-?\d*)$/, "$1.").replace(/^0\./, C[1].length ? "0." : ".");
    if (C = R.match(/^#{1,3},##0(\.?)$/))
      return F + Rt(Dt(W, 0));
    if (C = R.match(/^#,##0\.([#0]*0)$/))
      return T < 0 ? "-" + g(y, R, -T) : Rt("" + (Math.floor(T) + v(T, C[1].length))) + "." + ze(f(T, C[1].length), C[1].length);
    if (C = R.match(/^#,#*,#0/))
      return g(y, R.replace(/^#,#*,/, ""), T);
    if (C = R.match(/^([0#]+)(\\?-([0#]+))+$/))
      return w = bt(g(y, R.replace(/[\\-]/g, ""), T)), M = 0, bt(bt(R.replace(/\\/g, "")).replace(/[0#]/g, function(G) {
        return M < w.length ? w.charAt(M++) : G === "0" ? "0" : "";
      }));
    if (R.match(o))
      return w = g(y, "##########", T), "(" + w.substr(0, 3) + ") " + w.substr(3, 3) + "-" + w.substr(6);
    let S = "";
    if (C = R.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/))
      return M = Math.min(C[4].length, 7), _ = pn(W, Math.pow(10, M) - 1, !1), w = "" + F, S = ft("n", C[1], _[1]), S.charAt(S.length - 1) === " " && (S = S.substr(0, S.length - 1) + "0"), w += S + C[2] + "/" + C[3], S = hn(_[2], M), S.length < C[4].length && (S = s(C[4].substr(C[4].length - S.length)) + S), w += S, w;
    if (C = R.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/))
      return M = Math.min(Math.max(C[1].length, C[4].length), 7), _ = pn(W, Math.pow(10, M) - 1, !0), F + (_[0] || (_[1] ? "" : "0")) + " " + (_[1] ? ar(_[1], M) + C[2] + "/" + C[3] + hn(_[2], M) : ke(" ", 2 * M + 1 + C[2].length + C[3].length));
    if (C = R.match(/^[#0?]+$/))
      return w = Dt(T, 0), R.length <= w.length ? w : s(R.substr(0, R.length - w.length)) + w;
    if (C = R.match(/^([#0?]+)\.([#0]+)$/)) {
      w = "" + T.toFixed(Math.min(C[2].length, 10)).replace(/([^0])0+$/, "$1"), M = w.indexOf(".");
      const G = R.indexOf(".") - M, J = R.length - w.length - G;
      return s(R.substr(0, G) + w + R.substr(R.length - J));
    }
    if (C = R.match(/^00,000\.([#0]*0)$/))
      return M = f(T, C[1].length), T < 0 ? "-" + g(y, R, -T) : Rt(d(T)).replace(/^\d,\d{3}$/, "0$&").replace(/^\d*$/, function(G) {
        return "00," + (G.length < 3 ? ze(0, 3 - G.length) : "") + G;
      }) + "." + ze(M, C[1].length);
    switch (R) {
      case "###,##0.00":
        return g(y, "#,##0.00", T);
      case "###,###":
      case "##,###":
      case "#,###":
        const G = Rt(Dt(W, 0));
        return G !== "0" ? F + G : "";
      case "###,###.00":
        return g(y, "###,##0.00", T).replace(/^0\./, ".");
      case "#,###.00":
        return g(y, "#,##0.00", T).replace(/^0\./, ".");
    }
    throw new Error("unsupported format |" + R + "|");
  }
  function E(y, R, T) {
    let w = R.length - 1;
    for (; R.charCodeAt(w - 1) === 44; )
      --w;
    return ft(y, R.substr(0, w), T / Math.pow(10, 3 * (R.length - w)));
  }
  function A(y, R, T) {
    const w = R.replace(e, ""), C = R.length - w.length;
    return ft(y, w, T * Math.pow(10, 2 * C)) + ke("%", C);
  }
  function m(y, R) {
    let T, w = y.indexOf("E") - y.indexOf(".") - 1;
    if (y.match(/^#+0.0E\+0$/)) {
      if (R === 0)
        return "0.0E+0";
      if (R < 0)
        return "-" + m(y, -R);
      let C = y.indexOf(".");
      C === -1 && (C = y.indexOf("E"));
      let M = Math.floor(Math.log(R) * Math.LOG10E) % C;
      if (M < 0 && (M += C), T = (R / Math.pow(10, M)).toPrecision(w + 1 + (C + M) % C), !T.match(/[Ee]/)) {
        const _ = Math.floor(Math.log(R) * Math.LOG10E);
        T.indexOf(".") === -1 ? T = T.charAt(0) + "." + T.substr(1) + "E+" + (_ - T.length + M) : T += "E+" + (_ - M), T = T.replace(/\+-/, "-");
      }
      T = T.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function(_, W, F, S) {
        return W + F + S.substr(0, (C + M) % C) + "." + S.substr(M) + "E";
      });
    } else
      T = R.toExponential(w);
    return y.match(/E\+00$/) && T.match(/e[+-]\d$/) && (T = T.substr(0, T.length - 1) + "0" + T.charAt(T.length - 1)), y.match(/E\-/) && T.match(/e\+/) && (T = T.replace(/e\+/, "e")), T.replace("e", "E");
  }
  function N(y, R, T) {
    if (y.charCodeAt(0) === 40 && !R.match(u)) {
      const G = R.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
      return T >= 0 ? N("n", G, T) : "(" + N("n", G, -T) + ")";
    }
    if (R.charCodeAt(R.length - 1) === 44)
      return E(y, R, T);
    if (R.indexOf("%") !== -1)
      return A(y, R, T);
    if (R.indexOf("E") !== -1)
      return m(R, T);
    if (R.charCodeAt(0) === 36)
      return "$" + N(y, R.substr(R.charAt(1) == " " ? 2 : 1), T);
    let w, C, M, _, W = Math.abs(T), F = T < 0 ? "-" : "";
    if (R.match(/^00+$/))
      return F + ze(W, R.length);
    if (R.match(/^[#?]+$/))
      return w = "" + T, T === 0 && (w = ""), w.length > R.length ? w : s(R.substr(0, R.length - w.length)) + w;
    if (C = R.match(a))
      return h(C, W, F);
    if (R.match(/^#+0+$/))
      return F + ze(W, R.length - R.indexOf("0"));
    if (C = R.match(p))
      return w = ("" + T).replace(/^([^\.]+)$/, "$1." + s(C[1])).replace(/\.$/, "." + s(C[1])), w = w.replace(/\.(\d*)$/, function(G, J) {
        return "." + J + ke("0", s(C[1]).length - J.length);
      }), R.indexOf("0.") !== -1 ? w : w.replace(/^0\./, ".");
    if (R = R.replace(/^#+([0.])/, "$1"), C = R.match(/^(0*)\.(#*)$/))
      return F + ("" + W).replace(/\.(\d*[1-9])0*$/, ".$1").replace(/^(-?\d*)$/, "$1.").replace(/^0\./, C[1].length ? "0." : ".");
    if (C = R.match(/^#{1,3},##0(\.?)$/))
      return F + Rt("" + W);
    if (C = R.match(/^#,##0\.([#0]*0)$/))
      return T < 0 ? "-" + N(y, R, -T) : Rt("" + T) + "." + ke("0", C[1].length);
    if (C = R.match(/^#,#*,#0/))
      return N(y, R.replace(/^#,#*,/, ""), T);
    if (C = R.match(/^([0#]+)(\\?-([0#]+))+$/))
      return w = bt(N(y, R.replace(/[\\-]/g, ""), T)), M = 0, bt(bt(R.replace(/\\/g, "")).replace(/[0#]/g, function(G) {
        return M < w.length ? w.charAt(M++) : G === "0" ? "0" : "";
      }));
    if (R.match(o))
      return w = N(y, "##########", T), "(" + w.substr(0, 3) + ") " + w.substr(3, 3) + "-" + w.substr(6);
    let S = "";
    if (C = R.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/))
      return M = Math.min(C[4].length, 7), _ = pn(W, Math.pow(10, M) - 1, !1), w = "" + F, S = ft("n", C[1], _[1]), S.charAt(S.length - 1) == " " && (S = S.substr(0, S.length - 1) + "0"), w += S + C[2] + "/" + C[3], S = hn(_[2], M), S.length < C[4].length && (S = s(C[4].substr(C[4].length - S.length)) + S), w += S, w;
    if (C = R.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/))
      return M = Math.min(Math.max(C[1].length, C[4].length), 7), _ = pn(W, Math.pow(10, M) - 1, !0), F + (_[0] || (_[1] ? "" : "0")) + " " + (_[1] ? ar(_[1], M) + C[2] + "/" + C[3] + hn(_[2], M) : ke(" ", 2 * M + 1 + C[2].length + C[3].length));
    if (C = R.match(/^[#0?]+$/))
      return w = "" + T, R.length <= w.length ? w : s(R.substr(0, R.length - w.length)) + w;
    if (C = R.match(/^([#0]+)\.([#0]+)$/)) {
      w = "" + T.toFixed(Math.min(C[2].length, 10)).replace(/([^0])0+$/, "$1"), M = w.indexOf(".");
      let G = R.indexOf(".") - M, J = R.length - w.length - G;
      return s(R.substr(0, G) + w + R.substr(R.length - J));
    }
    if (C = R.match(/^00,000\.([#0]*0)$/))
      return T < 0 ? "-" + N(y, R, -T) : Rt("" + T).replace(/^\d,\d{3}$/, "0$&").replace(/^\d*$/, function(G) {
        return "00," + (G.length < 3 ? ze(0, 3 - G.length) : "") + G;
      }) + "." + ze(0, C[1].length);
    switch (R) {
      case "###,###":
      case "##,###":
      case "#,###":
        const G = Rt("" + W);
        return G !== "0" ? F + G : "";
      default:
        if (R.match(/\.[0#?]*$/))
          return N(y, R.slice(0, R.lastIndexOf(".")), T) + s(R.slice(R.lastIndexOf(".")));
    }
    throw new Error("unsupported format |" + R + "|");
  }
  return function(R, T, w) {
    return (w | 0) === w ? N(R, T, w) : g(R, T, w);
  };
}();
function yo(t) {
  const e = [];
  let n = !1, r = 0;
  for (let i = 0; i < t.length; ++i)
    switch (
      /*cc=*/
      t.charCodeAt(i)
    ) {
      case 34:
        n = !n;
        break;
      case 95:
      case 42:
      case 92:
        ++i;
        break;
      case 59:
        e[e.length] = t.substr(r, i - r), r = i + 1;
    }
  if (e[e.length] = t.substr(r), n === !0)
    throw new Error("Format |" + t + "| unterminated string ");
  return e;
}
_e._split = yo;
const To = /\[[HhMmSs]*\]/;
function wo(t) {
  let e = 0, n = "", r = "";
  for (; e < t.length; )
    switch (n = t.charAt(e)) {
      case "G":
        Ln(t, e) && (e += 6), e++;
        break;
      case '"':
        for (
          ;
          /*cc=*/
          t.charCodeAt(++e) !== 34 && e < t.length;
        )
          ++e;
        ++e;
        break;
      case "\\":
        e += 2;
        break;
      case "_":
        e += 2;
        break;
      case "@":
        ++e;
        break;
      case "B":
      case "b":
        if (t.charAt(e + 1) === "1" || t.charAt(e + 1) === "2")
          return !0;
      case "M":
      case "D":
      case "Y":
      case "H":
      case "S":
      case "E":
      case "m":
      case "d":
      case "y":
      case "h":
      case "s":
      case "e":
      case "g":
        return !0;
      case "A":
      case "a":
        if (t.substr(e, 3).toUpperCase() === "A/P" || t.substr(e, 5).toUpperCase() === "AM/PM")
          return !0;
        ++e;
        break;
      case "[":
        for (r = n; t.charAt(e++) !== "]" && e < t.length; )
          r += t.charAt(e);
        if (r.match(To))
          return !0;
        break;
      case ".":
      case "0":
      case "#":
        for (; e < t.length && ("0#?.,E+-%".indexOf(n = t.charAt(++e)) > -1 || n == "\\" && t.charAt(e + 1) == "-" && "0#".indexOf(t.charAt(e + 2)) > -1); )
          ;
        break;
      case "?":
        for (; t.charAt(++e) === n; )
          ;
        break;
      case "*":
        ++e, (t.charAt(e) === " " || t.charAt(e) === "*") && ++e;
        break;
      case "(":
      case ")":
        ++e;
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        for (; e < t.length && "0123456789".indexOf(t.charAt(++e)) > -1; )
          ;
        break;
      case " ":
        ++e;
        break;
      default:
        ++e;
        break;
    }
  return !1;
}
_e.is_date = wo;
function Co(t, e, n, r) {
  let i = [], a = "", c = 0, h = "", p = "t", u, o, s, l = "H";
  for (; c < t.length; )
    switch (h = t.charAt(c)) {
      case "G":
        if (!Ln(t, c))
          throw new Error("unrecognized character " + h + " in " + t);
        i[i.length] = { t: "G", v: "General" }, c += 7;
        break;
      case '"':
        for (a = ""; (s = t.charCodeAt(++c)) !== 34 && c < t.length; )
          a += String.fromCharCode(s);
        i[i.length] = { t: "t", v: a }, ++c;
        break;
      case "\\":
        const R = t.charAt(++c), T = R === "(" || R === ")" ? R : "t";
        i[i.length] = { t: T, v: R }, ++c;
        break;
      case "_":
        i[i.length] = { t: "t", v: " " }, c += 2;
        break;
      case "@":
        i[i.length] = { t: "T", v: e }, ++c;
        break;
      case "B":
      case "b":
        if (t.charAt(c + 1) === "1" || t.charAt(c + 1) === "2") {
          if (u == null && (u = Zt(e, n, t.charAt(c + 1) === "2"), u == null))
            return "";
          i[i.length] = { t: "X", v: t.substr(c, 2) }, p = h, c += 2;
          break;
        }
      case "M":
      case "D":
      case "Y":
      case "H":
      case "S":
      case "E":
        h = h.toLowerCase();
      case "m":
      case "d":
      case "y":
      case "h":
      case "s":
      case "e":
      case "g":
        if (e < 0 || u == null && (u = Zt(e, n), u == null))
          return "";
        for (a = h; ++c < t.length && t.charAt(c).toLowerCase() === h; )
          a += h;
        h === "m" && p.toLowerCase() === "h" && (h = "M"), h === "h" && (h = l), i[i.length] = { t: h, v: a }, p = h;
        break;
      case "A":
      case "a":
        const w = { t: h, v: h };
        if (u == null && (u = Zt(e, n)), t.substr(c, 3).toUpperCase() === "A/P" ? (u != null && (w.v = u.H >= 12 ? "P" : "A"), w.t = "T", l = "h", c += 3) : t.substr(c, 5).toUpperCase() === "AM/PM" ? (u != null && (w.v = u.H >= 12 ? "PM" : "AM"), w.t = "T", c += 5, l = "h") : (w.t = "t", ++c), u == null && w.t === "T")
          return "";
        i[i.length] = w, p = h;
        break;
      case "[":
        for (a = h; t.charAt(c++) !== "]" && c < t.length; )
          a += t.charAt(c);
        if (a.slice(-1) !== "]")
          throw 'unterminated "[" block: |' + a + "|";
        if (a.match(To)) {
          if (u == null && (u = Zt(e, n), u == null))
            return "";
          i[i.length] = { t: "Z", v: a.toLowerCase() }, p = a.charAt(1);
        } else
          a.indexOf("$") > -1 && (a = (a.match(/\$([^-\[\]]*)/) || [])[1] || "$", wo(t) || (i[i.length] = { t: "t", v: a }));
        break;
      case ".":
        if (u != null) {
          for (a = h; ++c < t.length && (h = t.charAt(c)) === "0"; )
            a += h;
          i[i.length] = { t: "s", v: a };
          break;
        }
      case "0":
      case "#":
        for (a = h; ++c < t.length && "0#?.,E+-%".indexOf(h = t.charAt(c)) > -1 || h == "\\" && t.charAt(c + 1) == "-" && c < t.length - 2 && "0#".indexOf(t.charAt(c + 2)) > -1; )
          a += h;
        i[i.length] = { t: "n", v: a };
        break;
      case "?":
        for (a = h; t.charAt(++c) === h; )
          a += h;
        i[i.length] = { t: h, v: a }, p = h;
        break;
      case "*":
        ++c, (t.charAt(c) === " " || t.charAt(c) === "*") && ++c;
        break;
      case "(":
      case ")":
        i[i.length] = { t: r === 1 || typeof e == "number" && e < 0 ? "t" : h, v: h }, ++c;
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        for (a = h; c < t.length && "0123456789".indexOf(t.charAt(++c)) > -1; )
          a += t.charAt(c);
        i[i.length] = { t: "D", v: a };
        break;
      case " ":
        i[i.length] = { t: h, v: h }, ++c;
        break;
      default:
        if (",$-+/():!^&'~{}<>=€acfijklopqrtuvwxzP".indexOf(h) === -1)
          throw new Error("unrecognized character " + h + " in " + t);
        i[i.length] = { t: "t", v: h }, ++c;
        break;
    }
  let f = 0, v = 0, d;
  for (c = i.length - 1, p = "t"; c >= 0; --c)
    switch (i[c].t) {
      case "h":
      case "H":
        i[c].t = l, p = "h", f < 1 && (f = 1);
        break;
      case "s":
        (d = i[c].v.match(/\.0+$/)) && (v = Math.max(v, d[0].length - 1)), f < 3 && (f = 3);
      case "d":
      case "y":
      case "M":
      case "e":
        p = i[c].t;
        break;
      case "m":
        p === "s" && (i[c].t = "M", f < 2 && (f = 2));
        break;
      case "X":
        break;
      case "Z":
        f < 1 && i[c].v.match(/[Hh]/) && (f = 1), f < 2 && i[c].v.match(/[Mm]/) && (f = 2), f < 3 && i[c].v.match(/[Ss]/) && (f = 3);
    }
  switch (f) {
    case 0:
      break;
    case 1:
      u.u >= 0.5 && (u.u = 0, ++u.S), u.S >= 60 && (u.S = 0, ++u.M), u.M >= 60 && (u.M = 0, ++u.H);
      break;
    case 2:
      u.u >= 0.5 && (u.u = 0, ++u.S), u.S >= 60 && (u.S = 0, ++u.M);
      break;
  }
  let g = "", E;
  for (c = 0; c < i.length; ++c)
    switch (i[c].t) {
      case "t":
      case "T":
      case " ":
      case "D":
        break;
      case "X":
        i[c].v = "", i[c].t = ";";
        break;
      case "d":
      case "m":
      case "y":
      case "h":
      case "H":
      case "M":
      case "s":
      case "e":
      case "b":
      case "Z":
        i[c].v = Na(i[c].t.charCodeAt(0), i[c].v, u, v), i[c].t = "t";
        break;
      case "n":
      case "(":
      case "?":
        for (E = c + 1; i[E] != null && ((h = i[E].t) === "?" || h === "D" || (h === " " || h === "t") && i[E + 1] != null && (i[E + 1].t === "?" || i[E + 1].t === "t" && i[E + 1].v === "/") || i[c].t === "(" && (h === " " || h === "n" || h === ")") || h === "t" && (i[E].v === "/" || i[E].v === " " && i[E + 1] != null && i[E + 1].t === "?")); )
          i[c].v += i[E].v, i[E] = { v: "", t: ";" }, ++E;
        g += i[c].v, c = E - 1;
        break;
      case "G":
        i[c].t = "t", i[c].v = _n(e, n);
        break;
    }
  let A = "", m, N;
  if (g.length > 0) {
    g.charCodeAt(0) === 40 ? (m = e < 0 && g.charCodeAt(0) === 45 ? -e : e, N = ft("(", g, m)) : (m = e < 0 && r > 1 ? -e : e, N = ft("n", g, m), m < 0 && i[0] && i[0].t === "t" && (N = N.substr(1), i[0].v = "-" + i[0].v)), E = N.length - 1;
    let R = i.length;
    for (c = 0; c < i.length; ++c)
      if (i[c] != null && i[c].t !== "t" && i[c].v.indexOf(".") > -1) {
        R = c;
        break;
      }
    let T = i.length;
    if (R === i.length && N.indexOf("E") === -1) {
      for (c = i.length - 1; c >= 0; --c)
        i[c] == null || "n?(".indexOf(i[c].t) === -1 || (E >= i[c].v.length - 1 ? (E -= i[c].v.length, i[c].v = N.substr(E + 1, i[c].v.length)) : E < 0 ? i[c].v = "" : (i[c].v = N.substr(0, E + 1), E = -1), i[c].t = "t", T = c);
      E >= 0 && T < i.length && (i[T].v = N.substr(0, E + 1) + i[T].v);
    } else if (R !== i.length && N.indexOf("E") === -1) {
      for (E = N.indexOf(".") - 1, c = R; c >= 0; --c)
        if (!(i[c] == null || "n?(".indexOf(i[c].t) === -1)) {
          for (o = i[c].v.indexOf(".") > -1 && c === R ? i[c].v.indexOf(".") - 1 : i[c].v.length - 1, A = i[c].v.substr(o + 1); o >= 0; --o)
            E >= 0 && (i[c].v.charAt(o) === "0" || i[c].v.charAt(o) === "#") && (A = N.charAt(E--) + A);
          i[c].v = A, i[c].t = "t", T = c;
        }
      for (E >= 0 && T < i.length && (i[T].v = N.substr(0, E + 1) + i[T].v), E = N.indexOf(".") + 1, c = R; c < i.length; ++c)
        if (!(i[c] == null || "n?(".indexOf(i[c].t) === -1 && c !== R)) {
          for (o = i[c].v.indexOf(".") > -1 && c === R ? i[c].v.indexOf(".") + 1 : 0, A = i[c].v.substr(0, o); o < i[c].v.length; ++o)
            E < N.length && (A += N.charAt(E++));
          i[c].v = A, i[c].t = "t", T = c;
        }
    }
  }
  for (c = 0; c < i.length; ++c)
    i[c] != null && "n(?".indexOf(i[c].t) > -1 && (m = r > 1 && e < 0 && c > 0 && i[c - 1].v === "-" ? -e : e, i[c].v = ft(i[c].t, i[c].v, m), i[c].t = "t");
  let y = "";
  for (c = 0; c !== i.length; ++c)
    i[c] != null && (y += i[c].v);
  return y;
}
_e._eval = Co;
const li = /\[[=<>]/, ui = /\[([=<>]*)(-?\d+\.?\d*)\]/;
function fi(t, e) {
  if (e == null)
    return !1;
  const n = parseFloat(e[2]);
  switch (e[1]) {
    case "=":
      if (t === n)
        return !0;
      break;
    case ">":
      if (t > n)
        return !0;
      break;
    case "<":
      if (t < n)
        return !0;
      break;
    case "<>":
      if (t !== n)
        return !0;
      break;
    case ">=":
      if (t >= n)
        return !0;
      break;
    case "<=":
      if (t <= n)
        return !0;
      break;
  }
  return !1;
}
function Aa(t, e) {
  let n = yo(t), r = n.length, i = n[r - 1].indexOf("@");
  if (r < 4 && i > -1 && --r, n.length > 4)
    throw new Error("cannot find right format for |" + n.join("|") + "|");
  if (typeof e != "number")
    return [4, n.length === 4 || i > -1 ? n[n.length - 1] : "@"];
  switch (n.length) {
    case 1:
      n = i > -1 ? ["General", "General", "General", n[0]] : [n[0], n[0], n[0], "@"];
      break;
    case 2:
      n = i > -1 ? [n[0], n[0], n[0], n[1]] : [n[0], n[1], n[0], "@"];
      break;
    case 3:
      n = i > -1 ? [n[0], n[1], n[0], n[2]] : [n[0], n[1], n[2], "@"];
      break;
  }
  const a = e > 0 ? n[0] : e < 0 ? n[1] : n[2];
  if (n[0].indexOf("[") === -1 && n[1].indexOf("[") === -1)
    return [r, a];
  if (n[0].match(li) != null || n[1].match(li) != null) {
    const c = n[0].match(ui), h = n[1].match(ui);
    return fi(e, c) ? [r, n[0]] : fi(e, h) ? [r, n[1]] : [r, n[c != null && h != null ? 2 : 1]];
  }
  return [r, a];
}
function Io(t, e, n) {
  n == null && (n = {});
  let r = "";
  switch (typeof t) {
    case "string":
      t === "m/d/yy" && n.dateNF ? r = n.dateNF : r = t;
      break;
    case "number":
      t === 14 && n.dateNF ? r = n.dateNF : r = (n.table != null ? n.table : _t)[t];
      break;
  }
  if (Ln(r, 0))
    return _n(e, n);
  e instanceof Date && (e = Ro(e, n.date1904));
  const i = Aa(r, e);
  if (Ln(i[1]))
    return _n(e, n);
  if (e === !0)
    e = "TRUE";
  else if (e === !1)
    e = "FALSE";
  else if (e === "" || e == null)
    return "";
  return Co(i[1], e, n, i[0]);
}
function Oo(t, e) {
  if (typeof e != "number") {
    e = +e || -1;
    for (let n = 0; n < 392; ++n) {
      if (_t[n] === void 0) {
        e < 0 && (e = n);
        continue;
      }
      if (_t[n] === t) {
        e = n;
        break;
      }
    }
    e < 0 && (e = 391);
  }
  return _t[e] = t, e;
}
_e.load = Oo;
_e._table = _t;
_e.get_table = function() {
  return _t;
};
_e.load_table = function(e) {
  for (let n = 0; n !== 392; ++n)
    e[n] !== void 0 && Oo(e[n], n);
};
_e.init_table = Eo;
_e.format = Io;
var Mo = _e, Uo = { exports: {} };
(function(t) {
  const e = "ศูนย์บาทถ้วน", n = [
    "",
    "หนึ่ง",
    "สอง",
    "สาม",
    "สี่",
    "ห้า",
    "หก",
    "เจ็ด",
    "แปด",
    "เก้า"
  ], r = [
    "",
    "สิบ",
    "ร้อย",
    "พัน",
    "หมื่น",
    "แสน",
    "ล้าน"
  ];
  function i(p) {
    let u = "";
    const o = p.length, s = 7;
    if (o > s) {
      const l = o - s + 1, f = p.slice(0, l), v = p.slice(l);
      return i(f) + "ล้าน" + i(v);
    } else
      for (let l = 0; l < o; l++) {
        const f = p[l];
        f > 0 && (u += n[f] + r[o - l - 1]);
      }
    return u;
  }
  function a(p) {
    let u = p;
    u = u.replace("หนึ่งสิบ", "สิบ"), u = u.replace("สองสิบ", "ยี่สิบ");
    const o = 5;
    return u.length > o && u.length - u.lastIndexOf("หนึ่ง") === o && (u = u.substr(0, u.length - o) + "เอ็ด"), u;
  }
  function c(p, u) {
    let o = "";
    return p === "" && u === "" ? o = e : p !== "" && u === "" ? o = p + "บาทถ้วน" : p === "" && u !== "" ? o = u + "สตางค์" : o = p + "บาท" + u + "สตางค์", o;
  }
  function h(p) {
    let u = e;
    if (isNaN(p) || p >= Number.MAX_SAFE_INTEGER)
      return u;
    const o = Math.floor(p).toString(), s = Math.round(p % 1 * 100).toString(), l = Array.from(o).map(Number), f = Array.from(s).map(Number);
    let v = i(l), d = i(f);
    return v = a(v), d = a(d), u = c(v, d), u;
  }
  t.exports != null && (t.exports = h);
})(Uo);
var ya = Uo.exports;
const Ce = he(), { FormulaHelpers: Ta, Types: Y, WildCard: hi } = ge(), q = Ta, lr = Mo, wa = ya, pi = {
  latin: { halfRE: /[!-~]/g, fullRE: /[！-～]/g, delta: 65248 },
  hangul1: { halfRE: /[ﾡ-ﾾ]/g, fullRE: /[ᆨ-ᇂ]/g, delta: -60921 },
  hangul2: { halfRE: /[ￂ-ￜ]/g, fullRE: /[ᅡ-ᅵ]/g, delta: -61025 },
  kana: {
    delta: 0,
    half: "｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ",
    full: "。「」、・ヲァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン゛゜"
  },
  extras: {
    delta: 0,
    half: "¢£¬¯¦¥₩ |←↑→↓■°",
    full: "￠￡￢￣￤￥￦　￨￩￪￫￬￭￮"
  }
}, Ca = (t) => (e) => t.delta ? String.fromCharCode(e.charCodeAt(0) + t.delta) : [...t.full][[...t.half].indexOf(e)], Ia = (t) => (e) => t.delta ? String.fromCharCode(e.charCodeAt(0) - t.delta) : [...t.half][[...t.full].indexOf(e)], Lo = (t, e) => t[e + "RE"] || new RegExp("[" + t[e] + "]", "g"), _o = Object.keys(pi).map((t) => pi[t]), Oa = (t) => _o.reduce((e, n) => e.replace(Lo(n, "half"), Ca(n)), t), Ma = (t) => _o.reduce((e, n) => e.replace(Lo(n, "full"), Ia(n)), t), ut = {
  ASC: (t) => (t = q.accept(t, Y.STRING), Ma(t)),
  BAHTTEXT: (t) => {
    t = q.accept(t, Y.NUMBER);
    try {
      return wa(t);
    } catch (e) {
      throw Error(`Error in https://github.com/jojoee/bahttext 
${e.toString()}`);
    }
  },
  CHAR: (t) => {
    if (t = q.accept(t, Y.NUMBER), t > 255 || t < 1)
      throw Ce.VALUE;
    return String.fromCharCode(t);
  },
  CLEAN: (t) => (t = q.accept(t, Y.STRING), t.replace(/[\x00-\x1F]/g, "")),
  CODE: (t) => {
    if (t = q.accept(t, Y.STRING), t.length === 0)
      throw Ce.VALUE;
    return t.charCodeAt(0);
  },
  CONCAT: (...t) => {
    let e = "";
    return q.flattenParams(t, Y.STRING, !1, (n) => {
      n = q.accept(n, Y.STRING), e += n;
    }), e;
  },
  CONCATENATE: (...t) => {
    let e = "";
    if (t.length === 0)
      throw Error("CONCATENATE need at least one argument.");
    return t.forEach((n) => {
      n = q.accept(n, Y.STRING), e += n;
    }), e;
  },
  DBCS: (t) => (t = q.accept(t, Y.STRING), Oa(t)),
  DOLLAR: (t, e) => {
    t = q.accept(t, Y.NUMBER), e = q.accept(e, Y.NUMBER, 2);
    const n = Array(e).fill("0").join("");
    return lr.format(`$#,##0.${n}_);($#,##0.${n})`, t).trim();
  },
  EXACT: (t, e) => (t = q.accept(t, [Y.STRING]), e = q.accept(e, [Y.STRING]), t === e),
  FIND: (t, e, n) => {
    if (t = q.accept(t, Y.STRING), e = q.accept(e, Y.STRING), n = q.accept(n, Y.NUMBER, 1), n < 1 || n > e.length)
      throw Ce.VALUE;
    const r = e.indexOf(t, n - 1);
    if (r === -1)
      throw Ce.VALUE;
    return r + 1;
  },
  FINDB: (...t) => ut.FIND(...t),
  FIXED: (t, e, n) => {
    t = q.accept(t, Y.NUMBER), e = q.accept(e, Y.NUMBER, 2), n = q.accept(n, Y.BOOLEAN, !1);
    const r = Array(e).fill("0").join(""), i = n ? "" : "#,";
    return lr.format(`${i}##0.${r}_);(${i}##0.${r})`, t).trim();
  },
  LEFT: (t, e) => {
    if (t = q.accept(t, Y.STRING), e = q.accept(e, Y.NUMBER, 1), e < 0)
      throw Ce.VALUE;
    return e > t.length ? t : t.slice(0, e);
  },
  LEFTB: (...t) => ut.LEFT(...t),
  LEN: (t) => (t = q.accept(t, Y.STRING), t.length),
  LENB: (...t) => ut.LEN(...t),
  LOWER: (t) => (t = q.accept(t, Y.STRING), t.toLowerCase()),
  MID: (t, e, n) => {
    if (t = q.accept(t, Y.STRING), e = q.accept(e, Y.NUMBER), n = q.accept(n, Y.NUMBER), e > t.length)
      return "";
    if (e < 1 || n < 1)
      throw Ce.VALUE;
    return t.slice(e - 1, e + n - 1);
  },
  MIDB: (...t) => ut.MID(...t),
  NUMBERVALUE: (t, e, n) => {
    if (t = q.accept(t, Y.STRING), e = q.accept(e, Y.STRING, "."), n = q.accept(n, Y.STRING, ","), t.length === 0)
      return 0;
    if (e.length === 0 || n.length === 0 || (e = e[0], n = n[0], e === n || t.indexOf(e) < t.lastIndexOf(n)))
      throw Ce.VALUE;
    const r = t.replace(n, "").replace(e, ".").replace(/[^\-0-9.%()]/g, "").match(/([(-]*)([0-9]*[.]*[0-9]+)([)]?)([%]*)/);
    if (!r)
      throw Ce.VALUE;
    const i = r[1].length, a = r[3].length, c = r[4].length;
    let h = Number(r[2]);
    if (i > 1 || i && !a || !i && a || isNaN(h))
      throw Ce.VALUE;
    return h = h / 100 ** c, i ? -h : h;
  },
  PHONETIC: () => {
  },
  PROPER: (t) => (t = q.accept(t, [Y.STRING]), t = t.toLowerCase(), t = t.charAt(0).toUpperCase() + t.slice(1), t.replace(
    /(?:[^a-zA-Z])([a-zA-Z])/g,
    (e) => e.toUpperCase()
  )),
  REPLACE: (t, e, n, r) => {
    t = q.accept(t, [Y.STRING]), e = q.accept(e, [Y.NUMBER]), n = q.accept(n, [Y.NUMBER]), r = q.accept(r, [Y.STRING]);
    let i = t.split("");
    return i.splice(e - 1, n, r), i.join("");
  },
  REPLACEB: (...t) => ut.REPLACE(...t),
  REPT: (t, e) => {
    t = q.accept(t, Y.STRING), e = q.accept(e, Y.NUMBER);
    let n = "";
    for (let r = 0; r < e; r++)
      n += t;
    return n;
  },
  RIGHT: (t, e) => {
    if (t = q.accept(t, Y.STRING), e = q.accept(e, Y.NUMBER, 1), e < 0)
      throw Ce.VALUE;
    const n = t.length;
    return e > n ? t : t.slice(n - e);
  },
  RIGHTB: (...t) => ut.RIGHT(...t),
  SEARCH: (t, e, n) => {
    if (t = q.accept(t, Y.STRING), e = q.accept(e, Y.STRING), n = q.accept(n, Y.NUMBER, 1), n < 1 || n > e.length)
      throw Ce.VALUE;
    let r = hi.isWildCard(t) ? hi.toRegex(t, "i") : t;
    const i = e.slice(n - 1).search(r);
    if (i === -1)
      throw Ce.VALUE;
    return i + n;
  },
  SEARCHB: (...t) => ut.SEARCH(...t),
  SUBSTITUTE: (...t) => {
  },
  T: (t) => (t = q.accept(t), typeof t == "string" ? t : ""),
  TEXT: (t, e) => {
    t = q.accept(t, Y.NUMBER), e = q.accept(e, Y.STRING);
    try {
      return lr.format(e, t);
    } catch (n) {
      throw console.error(n), Ce.VALUE;
    }
  },
  TEXTJOIN: (...t) => {
  },
  TRIM: (t) => (t = q.accept(t, [Y.STRING]), t.replace(/^\s+|\s+$/g, "")),
  UNICHAR: (t) => {
    if (t = q.accept(t, [Y.NUMBER]), t <= 0)
      throw Ce.VALUE;
    return String.fromCharCode(t);
  },
  UNICODE: (t) => ut.CODE(t)
};
var Po = ut;
const tn = he(), { FormulaHelpers: Pn } = ge(), Ua = {
  unaryOp: (t, e, n) => {
    let r = 1;
    if (t.forEach((i) => {
      if (i !== "+")
        if (i === "-")
          r = -r;
        else
          throw new Error(`Unrecognized prefix: ${i}`);
    }), e == null && (e = 0), r === 1)
      return e;
    try {
      e = Pn.acceptNumber(e, n);
    } catch (i) {
      if (i instanceof tn)
        Array.isArray(e) && (e = e[0][0]);
      else
        throw i;
    }
    return typeof e == "number" && isNaN(e) ? tn.VALUE : -e;
  }
}, La = {
  percentOp: (t, e, n) => {
    try {
      t = Pn.acceptNumber(t, n);
    } catch (r) {
      if (r instanceof tn)
        return r;
      throw r;
    }
    if (e === "%")
      return t / 100;
    throw new Error(`Unrecognized postfix: ${e}`);
  }
}, Nt = { boolean: 3, string: 2, number: 1 }, _a = {
  compareOp: (t, e, n, r, i) => {
    t == null && (t = 0), n == null && (n = 0), r && (t = t[0][0]), i && (n = n[0][0]);
    const a = typeof t, c = typeof n;
    if (a === c)
      switch (e) {
        case "=":
          return t === n;
        case ">":
          return t > n;
        case "<":
          return t < n;
        case "<>":
          return t !== n;
        case "<=":
          return t <= n;
        case ">=":
          return t >= n;
      }
    else
      switch (e) {
        case "=":
          return !1;
        case ">":
          return Nt[a] > Nt[c];
        case "<":
          return Nt[a] < Nt[c];
        case "<>":
          return !0;
        case "<=":
          return Nt[a] <= Nt[c];
        case ">=":
          return Nt[a] >= Nt[c];
      }
    throw Error("Infix.compareOp: Should not reach here.");
  },
  concatOp: (t, e, n, r, i) => {
    t == null && (t = ""), n == null && (n = ""), r && (t = t[0][0]), i && (n = n[0][0]);
    const a = typeof t, c = typeof n;
    return a === "boolean" && (t = t ? "TRUE" : "FALSE"), c === "boolean" && (n = n ? "TRUE" : "FALSE"), "" + t + n;
  },
  mathOp: (t, e, n, r, i) => {
    t == null && (t = 0), n == null && (n = 0);
    try {
      t = Pn.acceptNumber(t, r), n = Pn.acceptNumber(n, i);
    } catch (a) {
      if (a instanceof tn)
        return a;
      throw a;
    }
    switch (e) {
      case "+":
        return t + n;
      case "-":
        return t - n;
      case "*":
        return t * n;
      case "/":
        return n === 0 ? tn.DIV0 : t / n;
      case "^":
        return t ** n;
    }
    throw Error("Infix.mathOp: Should not reach here.");
  }
};
var br = {
  Prefix: Ua,
  Postfix: La,
  Infix: _a,
  Operators: {
    compareOp: ["<", ">", "=", "<>", "<=", ">="],
    concatOp: ["&"],
    mathOp: ["+", "-", "*", "/", "^"]
  }
};
const Q = he(), { FormulaHelpers: Pa, Types: P, Factorials: ko, Criteria: ka } = ge(), { Infix: xa } = br, L = Pa, ur = [], fr = [];
function Cn(t) {
  return t <= 100 ? ko[t] : ur[t] > 0 ? ur[t] : ur[t] = Cn(t - 1) * t;
}
function xo(t) {
  return t === 1 || t === 0 ? 1 : t === 2 ? 2 : fr[t] > 0 ? fr[t] : fr[t] = xo(t - 2) * t;
}
const Pe = {
  ABS: (t) => (t = L.accept(t, P.NUMBER), Math.abs(t)),
  AGGREGATE: (t, e, n, ...r) => {
  },
  ARABIC: (t) => {
    if (t = L.accept(t, P.STRING).toUpperCase(), !/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(t))
      throw new Q("#VALUE!", "Invalid roman numeral in ARABIC evaluation.");
    let e = 0;
    return t.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g, function(n) {
      e += {
        M: 1e3,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
      }[n];
    }), e;
  },
  BASE: (t, e, n) => {
    if (t = L.accept(t, P.NUMBER), t < 0 || t >= 2 ** 53 || (e = L.accept(e, P.NUMBER), e < 2 || e > 36) || (n = L.accept(n, P.NUMBER, 0), n < 0))
      throw Q.NUM;
    const r = t.toString(e).toUpperCase();
    return new Array(Math.max(n + 1 - r.length, 0)).join("0") + r;
  },
  CEILING: (t, e) => {
    if (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER), e === 0)
      return 0;
    if (t / e % 1 === 0)
      return t;
    const n = Math.abs(e), r = Math.floor(Math.abs(t) / n);
    return t < 0 ? e < 0 ? -n * (r + 1) : -n * r : (r + 1) * n;
  },
  "CEILING.MATH": (t, e, n) => {
    if (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER, t > 0 ? 1 : -1), n = L.accept(n, P.NUMBER, 0), t >= 0)
      return Pe.CEILING(t, e);
    const r = n ? e : 0;
    return Pe.CEILING(t, e) - r;
  },
  "CEILING.PRECISE": (t, e) => (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER, 1), Pe.CEILING(t, Math.abs(e))),
  COMBIN: (t, e) => {
    if (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER), t < 0 || e < 0 || t < e)
      throw Q.NUM;
    const n = Pe.FACT(t), r = Pe.FACT(e);
    return n / r / Pe.FACT(t - e);
  },
  COMBINA: (t, e) => {
    if (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER), (t === 0 || t === 1) && e === 0)
      return 1;
    if (t < 0 || e < 0)
      throw Q.NUM;
    return Pe.COMBIN(t + e - 1, t - 1);
  },
  DECIMAL: (t, e) => {
    if (t = L.accept(t, P.STRING), e = L.accept(e, P.NUMBER), e = Math.trunc(e), e < 2 || e > 36)
      throw Q.NUM;
    const n = parseInt(t, e);
    if (isNaN(n))
      throw Q.NUM;
    return n;
  },
  DEGREES: (t) => (t = L.accept(t, P.NUMBER), t * (180 / Math.PI)),
  EVEN: (t) => Pe.CEILING(t, -2),
  EXP: (t) => (t = L.accept(t, P.NUMBER), Math.exp(t)),
  FACT: (t) => {
    if (t = L.accept(t, P.NUMBER), t = Math.trunc(t), t > 170 || t < 0)
      throw Q.NUM;
    return t <= 100 ? ko[t] : Cn(t);
  },
  FACTDOUBLE: (t) => {
    if (t = L.accept(t, P.NUMBER), t = Math.trunc(t), t < -1)
      throw Q.NUM;
    return t === -1 ? 1 : xo(t);
  },
  FLOOR: (t, e) => {
    if (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER), e === 0)
      return 0;
    if (t > 0 && e < 0)
      throw Q.NUM;
    if (t / e % 1 === 0)
      return t;
    const n = Math.abs(e), r = Math.floor(Math.abs(t) / n);
    return t < 0 ? e < 0 ? -n * r : -n * (r + 1) : r * n;
  },
  "FLOOR.MATH": (t, e, n) => (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER, t > 0 ? 1 : -1), n = L.accept(n, P.NUMBER, 0), n === 0 || t >= 0 ? Pe.FLOOR(t, Math.abs(e)) : Pe.FLOOR(t, e) + e),
  "FLOOR.PRECISE": (t, e) => (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER, 1), Pe.FLOOR(t, Math.abs(e))),
  GCD: (...t) => {
    const e = [];
    L.flattenParams(
      t,
      null,
      !1,
      (c) => {
        if (c = typeof c == "boolean" ? NaN : Number(c), isNaN(c))
          throw Q.VALUE;
        if (c < 0 || c > 9007199254740990)
          throw Q.NUM;
        e.push(Math.trunc(c));
      },
      0
    );
    let n, r, i = t.length, a = Math.abs(e[0]);
    for (n = 1; n < i; n++) {
      for (r = Math.abs(e[n]); a && r; )
        a > r ? a %= r : r %= a;
      a += r;
    }
    return a;
  },
  INT: (t) => (t = L.accept(t, P.NUMBER), Math.floor(t)),
  "ISO.CEILING": (...t) => Pe["CEILING.PRECISE"](...t),
  LCM: (...t) => {
    const e = [];
    L.flattenParams(
      t,
      null,
      !1,
      (i) => {
        if (i = typeof i == "boolean" ? NaN : Number(i), isNaN(i))
          throw Q.VALUE;
        if (i < 0 || i > 9007199254740990)
          throw Q.NUM;
        e.push(Math.trunc(i));
      },
      1
    );
    let n = e.length, r = Math.abs(e[0]);
    for (let i = 1; i < n; i++) {
      let a = Math.abs(e[i]), c = r;
      for (; r && a; )
        r > a ? r %= a : a %= r;
      r = Math.abs(c * e[i]) / (r + a);
    }
    return r;
  },
  LN: (t) => (t = L.accept(t, P.NUMBER), Math.log(t)),
  LOG: (t, e) => (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER, 10), Math.log(t) / Math.log(e)),
  LOG10: (t) => (t = L.accept(t, P.NUMBER), Math.log10(t)),
  MDETERM: (t) => {
    if (t = L.accept(t, P.ARRAY, void 0, !1, !0), t[0].length !== t.length)
      throw Q.VALUE;
    const e = t.length, n = t[0].length;
    let r = 0, i, a;
    if (e === 1)
      return t[0][0];
    if (e === 2)
      return t[0][0] * t[1][1] - t[0][1] * t[1][0];
    for (let c = 0; c < n; c++) {
      i = t[0][c], a = t[0][c];
      for (let h = 1; h < e; h++)
        a *= t[h][((c + h) % n + n) % n], i *= t[h][((c - h) % n + n) % n];
      r += a - i;
    }
    return r;
  },
  MINVERSE: (t) => {
  },
  MMULT: (t, e) => {
    t = L.accept(t, P.ARRAY, void 0, !1, !0), e = L.accept(e, P.ARRAY, void 0, !1, !0);
    const n = t.length, r = t[0].length, i = e.length, a = e[0].length, c = new Array(n);
    if (r !== i)
      throw Q.VALUE;
    for (let h = 0; h < n; h++) {
      c[h] = new Array(a);
      for (let p = 0; p < a; p++) {
        c[h][p] = 0;
        for (let u = 0; u < r; u++) {
          const o = t[h][u], s = e[u][p];
          if (typeof o != "number" || typeof s != "number")
            throw Q.VALUE;
          c[h][p] += t[h][u] * e[u][p];
        }
      }
    }
    return c;
  },
  MOD: (t, e) => {
    if (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER), e === 0)
      throw Q.DIV0;
    return t - e * Pe.INT(t / e);
  },
  MROUND: (t, e) => {
    if (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER), e === 0)
      return 0;
    if (t > 0 && e < 0 || t < 0 && e > 0)
      throw Q.NUM;
    return t / e % 1 === 0 ? t : Math.round(t / e) * e;
  },
  MULTINOMIAL: (...t) => {
    let e = 0, n = 1;
    return L.flattenParams(t, P.NUMBER, !1, (r) => {
      if (r < 0)
        throw Q.NUM;
      e += r, n *= Cn(r);
    }), Cn(e) / n;
  },
  MUNIT: (t) => {
    t = L.accept(t, P.NUMBER);
    const e = [];
    for (let n = 0; n < t; n++) {
      const r = [];
      for (let i = 0; i < t; i++)
        n === i ? r.push(1) : r.push(0);
      e.push(r);
    }
    return e;
  },
  ODD: (t) => {
    if (t = L.accept(t, P.NUMBER), t === 0)
      return 1;
    let e = Math.ceil(Math.abs(t));
    return e = e & 1 ? e : e + 1, t > 0 ? e : -e;
  },
  PI: () => Math.PI,
  POWER: (t, e) => (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER), t ** e),
  PRODUCT: (...t) => {
    let e = 1;
    return L.flattenParams(t, null, !0, (n, r) => {
      const i = Number(n);
      r.isLiteral && !isNaN(i) ? e *= i : typeof n == "number" && (e *= n);
    }, 1), e;
  },
  QUOTIENT: (t, e) => (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER), Math.trunc(t / e)),
  RADIANS: (t) => (t = L.accept(t, P.NUMBER), t / 180 * Math.PI),
  RAND: () => Math.random(),
  RANDBETWEEN: (t, e) => (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER), Math.floor(Math.random() * (e - t + 1) + t)),
  ROMAN: (t, e) => {
    if (t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER, 0), e !== 0)
      throw Error("ROMAN: only allows form=0 (classic form).");
    const n = String(t).split(""), r = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM", "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
    let i = "", a = 3;
    for (; a--; )
      i = (r[+n.pop() + a * 10] || "") + i;
    return new Array(+n.join("") + 1).join("M") + i;
  },
  ROUND: (t, e) => {
    t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER);
    const n = Math.pow(10, Math.abs(e)), r = t > 0 ? 1 : -1;
    return e > 0 ? r * Math.round(Math.abs(t) * n) / n : e === 0 ? r * Math.round(Math.abs(t)) : r * Math.round(Math.abs(t) / n) * n;
  },
  ROUNDDOWN: (t, e) => {
    t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER);
    const n = Math.pow(10, Math.abs(e)), r = t > 0 ? 1 : -1;
    if (e > 0) {
      const i = 1 / n * 0.5;
      return r * Math.round((Math.abs(t) - i) * n) / n;
    } else {
      if (e === 0)
        return r * Math.round(Math.abs(t) - 0.5);
      {
        const i = n * 0.5;
        return r * Math.round((Math.abs(t) - i) / n) * n;
      }
    }
  },
  ROUNDUP: (t, e) => {
    t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER);
    const n = Math.pow(10, Math.abs(e)), r = t > 0 ? 1 : -1;
    if (e > 0) {
      const i = 1 / n * 0.5;
      return r * Math.round((Math.abs(t) + i) * n) / n;
    } else {
      if (e === 0)
        return r * Math.round(Math.abs(t) + 0.5);
      {
        const i = n * 0.5;
        return r * Math.round((Math.abs(t) + i) / n) * n;
      }
    }
  },
  SERIESSUM: (t, e, n, r) => {
    t = L.accept(t, P.NUMBER), e = L.accept(e, P.NUMBER), n = L.accept(n, P.NUMBER);
    let i = 0, a;
    return L.flattenParams([r], P.NUMBER, !1, (c) => {
      if (typeof c != "number")
        throw Q.VALUE;
      i === 0 ? a = c * Math.pow(t, e) : a += c * Math.pow(t, e + i * n), i++;
    }), a;
  },
  SIGN: (t) => (t = L.accept(t, P.NUMBER), t > 0 ? 1 : t === 0 ? 0 : -1),
  SQRT: (t) => {
    if (t = L.accept(t, P.NUMBER), t < 0)
      throw Q.NUM;
    return Math.sqrt(t);
  },
  SQRTPI: (t) => {
    if (t = L.accept(t, P.NUMBER), t < 0)
      throw Q.NUM;
    return Math.sqrt(t * Math.PI);
  },
  SUBTOTAL: () => {
  },
  SUM: (...t) => {
    let e = 0;
    return L.flattenParams(
      t,
      P.NUMBER,
      !0,
      (n, r) => {
        (r.isLiteral || typeof n == "number") && (e += n);
      }
    ), e;
  },
  /**
   * This functions requires instance of {@link FormulaParser}.
   */
  SUMIF: (t, e, n, r) => {
    const i = L.retrieveRanges(t, e, r);
    e = i[0], r = i[1], n = L.retrieveArg(t, n);
    const a = n.isArray;
    n = ka.parse(L.accept(n));
    let c = 0;
    return e.forEach((h, p) => {
      h.forEach((u, o) => {
        const s = r[p][o];
        typeof s == "number" && (n.op === "wc" ? n.match === n.value.test(u) && (c += s) : xa.compareOp(u, n.op, n.value, Array.isArray(u), a) && (c += s));
      });
    }), c;
  },
  SUMIFS: () => {
  },
  SUMPRODUCT: (t, ...e) => {
    t = L.accept(t, P.ARRAY, void 0, !1, !0), e.forEach((r) => {
      if (r = L.accept(r, P.ARRAY, void 0, !1, !0), t[0].length !== r[0].length || t.length !== r.length)
        throw Q.VALUE;
      for (let i = 0; i < t.length; i++)
        for (let a = 0; a < t[0].length; a++)
          typeof t[i][a] != "number" && (t[i][a] = 0), typeof r[i][a] != "number" && (r[i][a] = 0), t[i][a] *= r[i][a];
    });
    let n = 0;
    return t.forEach((r) => {
      r.forEach((i) => {
        n += i;
      });
    }), n;
  },
  SUMSQ: (...t) => {
    let e = 0;
    return L.flattenParams(
      t,
      P.NUMBER,
      !0,
      (n, r) => {
        (r.isLiteral || typeof n == "number") && (e += n ** 2);
      }
    ), e;
  },
  SUMX2MY2: (t, e) => {
    const n = [], r = [];
    let i = 0;
    if (L.flattenParams([t], null, !1, (a, c) => {
      n.push(a);
    }), L.flattenParams([e], null, !1, (a, c) => {
      r.push(a);
    }), n.length !== r.length)
      throw Q.NA;
    for (let a = 0; a < n.length; a++)
      typeof n[a] == "number" && typeof r[a] == "number" && (i += n[a] ** 2 - r[a] ** 2);
    return i;
  },
  SUMX2PY2: (t, e) => {
    const n = [], r = [];
    let i = 0;
    if (L.flattenParams([t], null, !1, (a, c) => {
      n.push(a);
    }), L.flattenParams([e], null, !1, (a, c) => {
      r.push(a);
    }), n.length !== r.length)
      throw Q.NA;
    for (let a = 0; a < n.length; a++)
      typeof n[a] == "number" && typeof r[a] == "number" && (i += n[a] ** 2 + r[a] ** 2);
    return i;
  },
  SUMXMY2: (t, e) => {
    const n = [], r = [];
    let i = 0;
    if (L.flattenParams([t], null, !1, (a, c) => {
      n.push(a);
    }), L.flattenParams([e], null, !1, (a, c) => {
      r.push(a);
    }), n.length !== r.length)
      throw Q.NA;
    for (let a = 0; a < n.length; a++)
      typeof n[a] == "number" && typeof r[a] == "number" && (i += (n[a] - r[a]) ** 2);
    return i;
  },
  TRUNC: (t) => (t = L.accept(t, P.NUMBER), Math.trunc(t))
};
var So = Pe;
const Ie = he(), { FormulaHelpers: Sa, Types: ie } = ge(), oe = Sa, Vt = 2 ** 27 - 1, Ba = {
  ACOS: (t) => {
    if (t = oe.accept(t, ie.NUMBER), t > 1 || t < -1)
      throw Ie.NUM;
    return Math.acos(t);
  },
  ACOSH: (t) => {
    if (t = oe.accept(t, ie.NUMBER), t < 1)
      throw Ie.NUM;
    return Math.acosh(t);
  },
  ACOT: (t) => (t = oe.accept(t, ie.NUMBER), Math.PI / 2 - Math.atan(t)),
  ACOTH: (t) => {
    if (t = oe.accept(t, ie.NUMBER), Math.abs(t) <= 1)
      throw Ie.NUM;
    return Math.atanh(1 / t);
  },
  ASIN: (t) => {
    if (t = oe.accept(t, ie.NUMBER), t > 1 || t < -1)
      throw Ie.NUM;
    return Math.asin(t);
  },
  ASINH: (t) => (t = oe.accept(t, ie.NUMBER), Math.asinh(t)),
  ATAN: (t) => (t = oe.accept(t, ie.NUMBER), Math.atan(t)),
  ATAN2: (t, e) => {
    if (t = oe.accept(t, ie.NUMBER), e = oe.accept(e, ie.NUMBER), e === 0 && t === 0)
      throw Ie.DIV0;
    return Math.atan2(e, t);
  },
  ATANH: (t) => {
    if (t = oe.accept(t, ie.NUMBER), Math.abs(t) > 1)
      throw Ie.NUM;
    return Math.atanh(t);
  },
  COS: (t) => {
    if (t = oe.accept(t, ie.NUMBER), Math.abs(t) > Vt)
      throw Ie.NUM;
    return Math.cos(t);
  },
  COSH: (t) => (t = oe.accept(t, ie.NUMBER), Math.cosh(t)),
  COT: (t) => {
    if (t = oe.accept(t, ie.NUMBER), Math.abs(t) > Vt)
      throw Ie.NUM;
    if (t === 0)
      throw Ie.DIV0;
    return 1 / Math.tan(t);
  },
  COTH: (t) => {
    if (t = oe.accept(t, ie.NUMBER), t === 0)
      throw Ie.DIV0;
    return 1 / Math.tanh(t);
  },
  CSC: (t) => {
    if (t = oe.accept(t, ie.NUMBER), Math.abs(t) > Vt)
      throw Ie.NUM;
    return 1 / Math.sin(t);
  },
  CSCH: (t) => {
    if (t = oe.accept(t, ie.NUMBER), t === 0)
      throw Ie.DIV0;
    return 1 / Math.sinh(t);
  },
  SEC: (t) => {
    if (t = oe.accept(t, ie.NUMBER), Math.abs(t) > Vt)
      throw Ie.NUM;
    return 1 / Math.cos(t);
  },
  SECH: (t) => (t = oe.accept(t, ie.NUMBER), 1 / Math.cosh(t)),
  SIN: (t) => {
    if (t = oe.accept(t, ie.NUMBER), Math.abs(t) > Vt)
      throw Ie.NUM;
    return Math.sin(t);
  },
  SINH: (t) => (t = oe.accept(t, ie.NUMBER), Math.sinh(t)),
  TAN: (t) => {
    if (t = oe.accept(t, ie.NUMBER), Math.abs(t) > Vt)
      throw Ie.NUM;
    return Math.tan(t);
  },
  TANH: (t) => (t = oe.accept(t, ie.NUMBER), Math.tanh(t))
};
var Fa = Ba;
const At = he(), { FormulaHelpers: ba, Types: hr } = ge(), Ke = ba;
function pr(t) {
  let e = 0, n = 0;
  return Ke.flattenParams(t, null, !0, (r) => {
    const i = typeof r;
    i === "string" ? r === "TRUE" ? r = !0 : r === "FALSE" && (r = !1) : i === "number" && (r = !!r), typeof r == "boolean" && (r === !0 ? e++ : n++);
  }), [e, n];
}
const Da = {
  AND: (...t) => {
    const [e, n] = pr(t);
    return e === 0 && n === 0 ? At.VALUE : e > 0 && n === 0;
  },
  FALSE: () => !1,
  // Special
  IF: (t, e, n, r) => (e = Ke.accept(e, hr.BOOLEAN), n = Ke.accept(n), r = Ke.accept(r, null, !1), e ? n : r),
  IFERROR: (t, e) => t.value instanceof At ? Ke.accept(e) : Ke.accept(t),
  IFNA: function(t, e) {
    if (arguments.length > 2)
      throw At.TOO_MANY_ARGS("IFNA");
    return At.NA.equals(t.value) ? Ke.accept(e) : Ke.accept(t);
  },
  IFS: (...t) => {
    if (t.length % 2 !== 0)
      return new At("#N/A", "IFS expects all arguments after position 0 to be in pairs.");
    for (let e = 0; e < t.length / 2; e++) {
      const n = Ke.accept(t[e * 2], hr.BOOLEAN), r = Ke.accept(t[e * 2 + 1]);
      if (n)
        return r;
    }
    return At.NA;
  },
  NOT: (t) => (t = Ke.accept(t, hr.BOOLEAN), !t),
  OR: (...t) => {
    const [e, n] = pr(t);
    return e === 0 && n === 0 ? At.VALUE : e > 0;
  },
  SWITCH: (...t) => {
  },
  TRUE: () => !0,
  XOR: (...t) => {
    const [e, n] = pr(t);
    return e === 0 && n === 0 ? At.VALUE : e % 2 === 1;
  }
};
var Va = Da, Bo = {};
(function(t) {
  (function(e) {
    e(typeof DO_NOT_EXPORT_BESSEL > "u" ? t : {});
  })(function(e) {
    e.version = "1.0.2";
    var n = Math;
    function r(o, s) {
      for (var l = 0, f = 0; l < o.length; ++l)
        f = s * f + o[l];
      return f;
    }
    function i(o, s, l, f, v) {
      if (s === 0)
        return l;
      if (s === 1)
        return f;
      for (var d = 2 / o, g = f, E = 1; E < s; ++E)
        g = f * E * d + v * l, l = f, f = g;
      return g;
    }
    function a(o, s, l, f, v) {
      return function(g, E) {
        if (f) {
          if (g === 0)
            return f == 1 ? -1 / 0 : 1 / 0;
          if (g < 0)
            return NaN;
        }
        if (E === 0)
          return o(g);
        if (E === 1)
          return s(g);
        if (E < 0)
          return NaN;
        E |= 0;
        var A = o(g), m = s(g);
        return i(g, E, A, m, v);
      };
    }
    var c = function() {
      var o = 0.636619772, s = [57568490574, -13362590354, 6516196407e-1, -1121442418e-2, 77392.33017, -184.9052456].reverse(), l = [57568490411, 1029532985, 9494680718e-3, 59272.64853, 267.8532712, 1].reverse(), f = [1, -0.001098628627, 2734510407e-14, -2073370639e-15, 2093887211e-16].reverse(), v = [-0.01562499995, 1430488765e-13, -6911147651e-15, 7621095161e-16, -934935152e-16].reverse();
      function d(y) {
        var R = 0, T = 0, w = 0, C = y * y;
        if (y < 8)
          T = r(s, C), w = r(l, C), R = T / w;
        else {
          var M = y - 0.785398164;
          C = 64 / C, T = r(f, C), w = r(v, C), R = n.sqrt(o / y) * (n.cos(M) * T - n.sin(M) * w * 8 / y);
        }
        return R;
      }
      var g = [72362614232, -7895059235, 2423968531e-1, -2972611439e-3, 15704.4826, -30.16036606].reverse(), E = [144725228442, 2300535178, 1858330474e-2, 99447.43394, 376.9991397, 1].reverse(), A = [1, 183105e-8, -3516396496e-14, 2457520174e-15, -240337019e-15].reverse(), m = [0.04687499995, -2002690873e-13, 8449199096e-15, -88228987e-14, 105787412e-15].reverse();
      function N(y) {
        var R = 0, T = 0, w = 0, C = y * y, M = n.abs(y) - 2.356194491;
        return Math.abs(y) < 8 ? (T = y * r(g, C), w = r(E, C), R = T / w) : (C = 64 / C, T = r(A, C), w = r(m, C), R = n.sqrt(o / n.abs(y)) * (n.cos(M) * T - n.sin(M) * w * 8 / n.abs(y)), y < 0 && (R = -R)), R;
      }
      return function y(R, T) {
        if (T = Math.round(T), !isFinite(R))
          return isNaN(R) ? R : 0;
        if (T < 0)
          return (T % 2 ? -1 : 1) * y(R, -T);
        if (R < 0)
          return (T % 2 ? -1 : 1) * y(-R, T);
        if (T === 0)
          return d(R);
        if (T === 1)
          return N(R);
        if (R === 0)
          return 0;
        var w = 0;
        if (R > T)
          w = i(R, T, d(R), N(R), -1);
        else {
          for (var C = 2 * n.floor((T + n.floor(n.sqrt(40 * T))) / 2), M = !1, _ = 0, W = 0, F = 1, S = 0, G = 2 / R, J = C; J > 0; J--)
            S = J * G * F - _, _ = F, F = S, n.abs(F) > 1e10 && (F *= 1e-10, _ *= 1e-10, w *= 1e-10, W *= 1e-10), M && (W += F), M = !M, J == T && (w = _);
          W = 2 * W - F, w /= W;
        }
        return w;
      };
    }(), h = function() {
      var o = 0.636619772, s = [-2957821389, 7062834065, -5123598036e-1, 1087988129e-2, -86327.92757, 228.4622733].reverse(), l = [40076544269, 7452499648e-1, 7189466438e-3, 47447.2647, 226.1030244, 1].reverse(), f = [1, -0.001098628627, 2734510407e-14, -2073370639e-15, 2093887211e-16].reverse(), v = [-0.01562499995, 1430488765e-13, -6911147651e-15, 7621095161e-16, -934945152e-16].reverse();
      function d(y) {
        var R = 0, T = 0, w = 0, C = y * y, M = y - 0.785398164;
        return y < 8 ? (T = r(s, C), w = r(l, C), R = T / w + o * c(y, 0) * n.log(y)) : (C = 64 / C, T = r(f, C), w = r(v, C), R = n.sqrt(o / y) * (n.sin(M) * T + n.cos(M) * w * 8 / y)), R;
      }
      var g = [-4900604943e3, 127527439e4, -51534381390, 7349264551e-1, -4237922726e-3, 8511.937935].reverse(), E = [249958057e5, 424441966400, 3733650367, 2245904002e-2, 102042.605, 354.9632885, 1].reverse(), A = [1, 183105e-8, -3516396496e-14, 2457520174e-15, -240337019e-15].reverse(), m = [0.04687499995, -2002690873e-13, 8449199096e-15, -88228987e-14, 105787412e-15].reverse();
      function N(y) {
        var R = 0, T = 0, w = 0, C = y * y, M = y - 2.356194491;
        return y < 8 ? (T = y * r(g, C), w = r(E, C), R = T / w + o * (c(y, 1) * n.log(y) - 1 / y)) : (C = 64 / C, T = r(A, C), w = r(m, C), R = n.sqrt(o / y) * (n.sin(M) * T + n.cos(M) * w * 8 / y)), R;
      }
      return a(d, N, "BESSELY", 1, -1);
    }(), p = function() {
      var o = [1, 3.5156229, 3.0899424, 1.2067492, 0.2659732, 0.0360768, 45813e-7].reverse(), s = [0.39894228, 0.01328592, 225319e-8, -157565e-8, 916281e-8, -0.02057706, 0.02635537, -0.01647633, 392377e-8].reverse();
      function l(g) {
        return g <= 3.75 ? r(o, g * g / (3.75 * 3.75)) : n.exp(n.abs(g)) / n.sqrt(n.abs(g)) * r(s, 3.75 / n.abs(g));
      }
      var f = [0.5, 0.87890594, 0.51498869, 0.15084934, 0.02658733, 301532e-8, 32411e-8].reverse(), v = [0.39894228, -0.03988024, -362018e-8, 163801e-8, -0.01031555, 0.02282967, -0.02895312, 0.01787654, -420059e-8].reverse();
      function d(g) {
        return g < 3.75 ? g * r(f, g * g / (3.75 * 3.75)) : (g < 0 ? -1 : 1) * n.exp(n.abs(g)) / n.sqrt(n.abs(g)) * r(v, 3.75 / n.abs(g));
      }
      return function g(E, A) {
        if (A = Math.round(A), A === 0)
          return l(E);
        if (A === 1)
          return d(E);
        if (A < 0)
          return NaN;
        if (n.abs(E) === 0)
          return 0;
        if (E == 1 / 0)
          return 1 / 0;
        var m = 0, N, y = 2 / n.abs(E), R = 0, T = 1, w = 0, C = 2 * n.round((A + n.round(n.sqrt(40 * A))) / 2);
        for (N = C; N > 0; N--)
          w = N * y * T + R, R = T, T = w, n.abs(T) > 1e10 && (T *= 1e-10, R *= 1e-10, m *= 1e-10), N == A && (m = R);
        return m *= g(E, 0) / T, E < 0 && A % 2 ? -m : m;
      };
    }(), u = function() {
      var o = [-0.57721566, 0.4227842, 0.23069756, 0.0348859, 262698e-8, 1075e-7, 74e-7].reverse(), s = [1.25331414, -0.07832358, 0.02189568, -0.01062446, 587872e-8, -25154e-7, 53208e-8].reverse();
      function l(g) {
        return g <= 2 ? -n.log(g / 2) * p(g, 0) + r(o, g * g / 4) : n.exp(-g) / n.sqrt(g) * r(s, 2 / g);
      }
      var f = [1, 0.15443144, -0.67278579, -0.18156897, -0.01919402, -110404e-8, -4686e-8].reverse(), v = [1.25331414, 0.23498619, -0.0365562, 0.01504268, -780353e-8, 325614e-8, -68245e-8].reverse();
      function d(g) {
        return g <= 2 ? n.log(g / 2) * p(g, 1) + 1 / g * r(f, g * g / 4) : n.exp(-g) / n.sqrt(g) * r(v, 2 / g);
      }
      return a(l, d, "BESSELK", 2, 1);
    }();
    e.besselj = c, e.bessely = h, e.besseli = p, e.besselk = u;
  });
})(Bo);
var Fo = { exports: {} };
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(go, function() {
    var n = function(r, i) {
      var a = Array.prototype.concat, c = Array.prototype.slice, h = Object.prototype.toString;
      function p(A, m) {
        var N = A > m ? A : m;
        return r.pow(
          10,
          17 - ~~(r.log(N > 0 ? N : -N) * r.LOG10E)
        );
      }
      var u = Array.isArray || function(m) {
        return h.call(m) === "[object Array]";
      };
      function o(A) {
        return h.call(A) === "[object Function]";
      }
      function s(A) {
        return typeof A == "number" ? A - A === 0 : !1;
      }
      function l(A) {
        return a.apply([], A);
      }
      function f() {
        return new f._init(arguments);
      }
      f.fn = f.prototype, f._init = function(m) {
        if (u(m[0]))
          if (u(m[0][0])) {
            o(m[1]) && (m[0] = f.map(m[0], m[1]));
            for (var N = 0; N < m[0].length; N++)
              this[N] = m[0][N];
            this.length = m[0].length;
          } else
            this[0] = o(m[1]) ? f.map(m[0], m[1]) : m[0], this.length = 1;
        else if (s(m[0]))
          this[0] = f.seq.apply(null, m), this.length = 1;
        else {
          if (m[0] instanceof f)
            return f(m[0].toArray());
          this[0] = [], this.length = 1;
        }
        return this;
      }, f._init.prototype = f.prototype, f._init.constructor = f, f.utils = {
        calcRdx: p,
        isArray: u,
        isFunction: o,
        isNumber: s,
        toVector: l
      }, f._random_fn = r.random, f.setRandom = function(m) {
        if (typeof m != "function")
          throw new TypeError("fn is not a function");
        f._random_fn = m;
      }, f.extend = function(m) {
        var N, y;
        if (arguments.length === 1) {
          for (y in m)
            f[y] = m[y];
          return this;
        }
        for (N = 1; N < arguments.length; N++)
          for (y in arguments[N])
            m[y] = arguments[N][y];
        return m;
      }, f.rows = function(m) {
        return m.length || 1;
      }, f.cols = function(m) {
        return m[0].length || 1;
      }, f.dimensions = function(m) {
        return {
          rows: f.rows(m),
          cols: f.cols(m)
        };
      }, f.row = function(m, N) {
        return u(N) ? N.map(function(y) {
          return f.row(m, y);
        }) : m[N];
      }, f.rowa = function(m, N) {
        return f.row(m, N);
      }, f.col = function(m, N) {
        if (u(N)) {
          var y = f.arange(m.length).map(function() {
            return new Array(N.length);
          });
          return N.forEach(function(w, C) {
            f.arange(m.length).forEach(function(M) {
              y[M][C] = m[M][w];
            });
          }), y;
        }
        for (var R = new Array(m.length), T = 0; T < m.length; T++)
          R[T] = [m[T][N]];
        return R;
      }, f.cola = function(m, N) {
        return f.col(m, N).map(function(y) {
          return y[0];
        });
      }, f.diag = function(m) {
        for (var N = f.rows(m), y = new Array(N), R = 0; R < N; R++)
          y[R] = [m[R][R]];
        return y;
      }, f.antidiag = function(m) {
        for (var N = f.rows(m) - 1, y = new Array(N), R = 0; N >= 0; N--, R++)
          y[R] = [m[R][N]];
        return y;
      }, f.transpose = function(m) {
        var N = [], y, R, T, w, C;
        for (u(m[0]) || (m = [m]), R = m.length, T = m[0].length, C = 0; C < T; C++) {
          for (y = new Array(R), w = 0; w < R; w++)
            y[w] = m[w][C];
          N.push(y);
        }
        return N.length === 1 ? N[0] : N;
      }, f.map = function(m, N, y) {
        var R, T, w, C, M;
        for (u(m[0]) || (m = [m]), T = m.length, w = m[0].length, C = y ? m : new Array(T), R = 0; R < T; R++)
          for (C[R] || (C[R] = new Array(w)), M = 0; M < w; M++)
            C[R][M] = N(m[R][M], R, M);
        return C.length === 1 ? C[0] : C;
      }, f.cumreduce = function(m, N, y) {
        var R, T, w, C, M;
        for (u(m[0]) || (m = [m]), T = m.length, w = m[0].length, C = y ? m : new Array(T), R = 0; R < T; R++)
          for (C[R] || (C[R] = new Array(w)), w > 0 && (C[R][0] = m[R][0]), M = 1; M < w; M++)
            C[R][M] = N(C[R][M - 1], m[R][M]);
        return C.length === 1 ? C[0] : C;
      }, f.alter = function(m, N) {
        return f.map(m, N, !0);
      }, f.create = function(m, N, y) {
        var R = new Array(m), T, w;
        for (o(N) && (y = N, N = m), T = 0; T < m; T++)
          for (R[T] = new Array(N), w = 0; w < N; w++)
            R[T][w] = y(T, w);
        return R;
      };
      function v() {
        return 0;
      }
      f.zeros = function(m, N) {
        return s(N) || (N = m), f.create(m, N, v);
      };
      function d() {
        return 1;
      }
      f.ones = function(m, N) {
        return s(N) || (N = m), f.create(m, N, d);
      }, f.rand = function(m, N) {
        return s(N) || (N = m), f.create(m, N, f._random_fn);
      };
      function g(A, m) {
        return A === m ? 1 : 0;
      }
      f.identity = function(m, N) {
        return s(N) || (N = m), f.create(m, N, g);
      }, f.symmetric = function(m) {
        var N = m.length, y, R;
        if (m.length !== m[0].length)
          return !1;
        for (y = 0; y < N; y++)
          for (R = 0; R < N; R++)
            if (m[R][y] !== m[y][R])
              return !1;
        return !0;
      }, f.clear = function(m) {
        return f.alter(m, v);
      }, f.seq = function(m, N, y, R) {
        o(R) || (R = !1);
        var T = [], w = p(m, N), C = (N * w - m * w) / ((y - 1) * w), M = m, _;
        for (_ = 0; M <= N && _ < y; _++, M = (m * w + C * w * _) / w)
          T.push(R ? R(M, _) : M);
        return T;
      }, f.arange = function(m, N, y) {
        var R = [], T;
        if (y = y || 1, N === i && (N = m, m = 0), m === N || y === 0)
          return [];
        if (m < N && y < 0)
          return [];
        if (m > N && y > 0)
          return [];
        if (y > 0)
          for (T = m; T < N; T += y)
            R.push(T);
        else
          for (T = m; T > N; T += y)
            R.push(T);
        return R;
      }, f.slice = function() {
        function A(N, y, R, T) {
          var w, C = [], M = N.length;
          if (y === i && R === i && T === i)
            return f.copy(N);
          if (y = y || 0, R = R || N.length, y = y >= 0 ? y : M + y, R = R >= 0 ? R : M + R, T = T || 1, y === R || T === 0)
            return [];
          if (y < R && T < 0)
            return [];
          if (y > R && T > 0)
            return [];
          if (T > 0)
            for (w = y; w < R; w += T)
              C.push(N[w]);
          else
            for (w = y; w > R; w += T)
              C.push(N[w]);
          return C;
        }
        function m(N, y) {
          var R, T;
          if (y = y || {}, s(y.row)) {
            if (s(y.col))
              return N[y.row][y.col];
            var w = f.rowa(N, y.row);
            return R = y.col || {}, A(w, R.start, R.end, R.step);
          }
          if (s(y.col)) {
            var C = f.cola(N, y.col);
            return T = y.row || {}, A(C, T.start, T.end, T.step);
          }
          T = y.row || {}, R = y.col || {};
          var M = A(N, T.start, T.end, T.step);
          return M.map(function(_) {
            return A(_, R.start, R.end, R.step);
          });
        }
        return m;
      }(), f.sliceAssign = function(m, N, y) {
        var R, T;
        if (s(N.row)) {
          if (s(N.col))
            return m[N.row][N.col] = y;
          N.col = N.col || {}, N.col.start = N.col.start || 0, N.col.end = N.col.end || m[0].length, N.col.step = N.col.step || 1, R = f.arange(
            N.col.start,
            r.min(m.length, N.col.end),
            N.col.step
          );
          var w = N.row;
          return R.forEach(function(M, _) {
            m[w][M] = y[_];
          }), m;
        }
        if (s(N.col)) {
          N.row = N.row || {}, N.row.start = N.row.start || 0, N.row.end = N.row.end || m.length, N.row.step = N.row.step || 1, T = f.arange(
            N.row.start,
            r.min(m[0].length, N.row.end),
            N.row.step
          );
          var C = N.col;
          return T.forEach(function(M, _) {
            m[M][C] = y[_];
          }), m;
        }
        return y[0].length === i && (y = [y]), N.row.start = N.row.start || 0, N.row.end = N.row.end || m.length, N.row.step = N.row.step || 1, N.col.start = N.col.start || 0, N.col.end = N.col.end || m[0].length, N.col.step = N.col.step || 1, T = f.arange(
          N.row.start,
          r.min(m.length, N.row.end),
          N.row.step
        ), R = f.arange(
          N.col.start,
          r.min(m[0].length, N.col.end),
          N.col.step
        ), T.forEach(function(M, _) {
          R.forEach(function(W, F) {
            m[M][W] = y[_][F];
          });
        }), m;
      }, f.diagonal = function(m) {
        var N = f.zeros(m.length, m.length);
        return m.forEach(function(y, R) {
          N[R][R] = y;
        }), N;
      }, f.copy = function(m) {
        return m.map(function(N) {
          return s(N) ? N : N.map(function(y) {
            return y;
          });
        });
      };
      var E = f.prototype;
      return E.length = 0, E.push = Array.prototype.push, E.sort = Array.prototype.sort, E.splice = Array.prototype.splice, E.slice = Array.prototype.slice, E.toArray = function() {
        return this.length > 1 ? c.call(this) : c.call(this)[0];
      }, E.map = function(m, N) {
        return f(f.map(this, m, N));
      }, E.cumreduce = function(m, N) {
        return f(f.cumreduce(this, m, N));
      }, E.alter = function(m) {
        return f.alter(this, m), this;
      }, function(A) {
        for (var m = 0; m < A.length; m++)
          (function(N) {
            E[N] = function(y) {
              var R = this, T;
              return y ? (setTimeout(function() {
                y.call(R, E[N].call(R));
              }), this) : (T = f[N](this), u(T) ? f(T) : T);
            };
          })(A[m]);
      }("transpose clear symmetric rows cols dimensions diag antidiag".split(" ")), function(A) {
        for (var m = 0; m < A.length; m++)
          (function(N) {
            E[N] = function(y, R) {
              var T = this;
              return R ? (setTimeout(function() {
                R.call(T, E[N].call(T, y));
              }), this) : f(f[N](this, y));
            };
          })(A[m]);
      }("row col".split(" ")), function(A) {
        for (var m = 0; m < A.length; m++)
          (function(N) {
            E[N] = function() {
              return f(f[N].apply(null, arguments));
            };
          })(A[m]);
      }("create zeros ones rand identity".split(" ")), f;
    }(Math);
    return function(r, i) {
      var a = r.utils.isFunction;
      function c(u, o) {
        return u - o;
      }
      function h(u, o, s) {
        return i.max(o, i.min(u, s));
      }
      r.sum = function(o) {
        for (var s = 0, l = o.length; --l >= 0; )
          s += o[l];
        return s;
      }, r.sumsqrd = function(o) {
        for (var s = 0, l = o.length; --l >= 0; )
          s += o[l] * o[l];
        return s;
      }, r.sumsqerr = function(o) {
        for (var s = r.mean(o), l = 0, f = o.length, v; --f >= 0; )
          v = o[f] - s, l += v * v;
        return l;
      }, r.sumrow = function(o) {
        for (var s = 0, l = o.length; --l >= 0; )
          s += o[l];
        return s;
      }, r.product = function(o) {
        for (var s = 1, l = o.length; --l >= 0; )
          s *= o[l];
        return s;
      }, r.min = function(o) {
        for (var s = o[0], l = 0; ++l < o.length; )
          o[l] < s && (s = o[l]);
        return s;
      }, r.max = function(o) {
        for (var s = o[0], l = 0; ++l < o.length; )
          o[l] > s && (s = o[l]);
        return s;
      }, r.unique = function(o) {
        for (var s = {}, l = [], f = 0; f < o.length; f++)
          s[o[f]] || (s[o[f]] = !0, l.push(o[f]));
        return l;
      }, r.mean = function(o) {
        return r.sum(o) / o.length;
      }, r.meansqerr = function(o) {
        return r.sumsqerr(o) / o.length;
      }, r.geomean = function(o) {
        var s = o.map(i.log), l = r.mean(s);
        return i.exp(l);
      }, r.median = function(o) {
        var s = o.length, l = o.slice().sort(c);
        return s & 1 ? l[s / 2 | 0] : (l[s / 2 - 1] + l[s / 2]) / 2;
      }, r.cumsum = function(o) {
        return r.cumreduce(o, function(s, l) {
          return s + l;
        });
      }, r.cumprod = function(o) {
        return r.cumreduce(o, function(s, l) {
          return s * l;
        });
      }, r.diff = function(o) {
        var s = [], l = o.length, f;
        for (f = 1; f < l; f++)
          s.push(o[f] - o[f - 1]);
        return s;
      }, r.rank = function(u) {
        var o, s = [], l = {};
        for (o = 0; o < u.length; o++) {
          var f = u[o];
          l[f] ? l[f]++ : (l[f] = 1, s.push(f));
        }
        var v = s.sort(c), d = {}, g = 1;
        for (o = 0; o < v.length; o++) {
          var f = v[o], E = l[f], A = g, m = g + E - 1, N = (A + m) / 2;
          d[f] = N, g += E;
        }
        return u.map(function(y) {
          return d[y];
        });
      }, r.mode = function(o) {
        var s = o.length, l = o.slice().sort(c), f = 1, v = 0, d = 0, g = [], E;
        for (E = 0; E < s; E++)
          l[E] === l[E + 1] ? f++ : (f > v ? (g = [l[E]], v = f, d = 0) : f === v && (g.push(l[E]), d++), f = 1);
        return d === 0 ? g[0] : g;
      }, r.range = function(o) {
        return r.max(o) - r.min(o);
      }, r.variance = function(o, s) {
        return r.sumsqerr(o) / (o.length - (s ? 1 : 0));
      }, r.pooledvariance = function(o) {
        var s = o.reduce(function(f, v) {
          return f + r.sumsqerr(v);
        }, 0), l = o.reduce(function(f, v) {
          return f + v.length;
        }, 0);
        return s / (l - o.length);
      }, r.deviation = function(u) {
        for (var o = r.mean(u), s = u.length, l = new Array(s), f = 0; f < s; f++)
          l[f] = u[f] - o;
        return l;
      }, r.stdev = function(o, s) {
        return i.sqrt(r.variance(o, s));
      }, r.pooledstdev = function(o) {
        return i.sqrt(r.pooledvariance(o));
      }, r.meandev = function(o) {
        for (var s = r.mean(o), l = [], f = o.length - 1; f >= 0; f--)
          l.push(i.abs(o[f] - s));
        return r.mean(l);
      }, r.meddev = function(o) {
        for (var s = r.median(o), l = [], f = o.length - 1; f >= 0; f--)
          l.push(i.abs(o[f] - s));
        return r.median(l);
      }, r.coeffvar = function(o) {
        return r.stdev(o) / r.mean(o);
      }, r.quartiles = function(o) {
        var s = o.length, l = o.slice().sort(c);
        return [
          l[i.round(s / 4) - 1],
          l[i.round(s / 2) - 1],
          l[i.round(s * 3 / 4) - 1]
        ];
      }, r.quantiles = function(o, s, l, f) {
        var v = o.slice().sort(c), d = [s.length], g = o.length, E, A, m, N, y, R;
        for (typeof l > "u" && (l = 3 / 8), typeof f > "u" && (f = 3 / 8), E = 0; E < s.length; E++)
          A = s[E], m = l + A * (1 - l - f), N = g * A + m, y = i.floor(h(N, 1, g - 1)), R = h(N - y, 0, 1), d[E] = (1 - R) * v[y - 1] + R * v[y];
        return d;
      }, r.percentile = function(o, s, l) {
        var f = o.slice().sort(c), v = s * (f.length + (l ? 1 : -1)) + (l ? 0 : 1), d = parseInt(v), g = v - d;
        return d + 1 < f.length ? f[d - 1] + g * (f[d] - f[d - 1]) : f[d - 1];
      }, r.percentileOfScore = function(o, s, l) {
        var f = 0, v = o.length, d = !1, g, E;
        for (l === "strict" && (d = !0), E = 0; E < v; E++)
          g = o[E], (d && g < s || !d && g <= s) && f++;
        return f / v;
      }, r.histogram = function(o, s) {
        s = s || 4;
        var l = r.min(o), f = (r.max(o) - l) / s, v = o.length, d = [], g;
        for (g = 0; g < s; g++)
          d[g] = 0;
        for (g = 0; g < v; g++)
          d[i.min(i.floor((o[g] - l) / f), s - 1)] += 1;
        return d;
      }, r.covariance = function(o, s) {
        var l = r.mean(o), f = r.mean(s), v = o.length, d = new Array(v), g;
        for (g = 0; g < v; g++)
          d[g] = (o[g] - l) * (s[g] - f);
        return r.sum(d) / (v - 1);
      }, r.corrcoeff = function(o, s) {
        return r.covariance(o, s) / r.stdev(o, 1) / r.stdev(s, 1);
      }, r.spearmancoeff = function(u, o) {
        return u = r.rank(u), o = r.rank(o), r.corrcoeff(u, o);
      }, r.stanMoment = function(o, s) {
        for (var l = r.mean(o), f = r.stdev(o), v = o.length, d = 0, g = 0; g < v; g++)
          d += i.pow((o[g] - l) / f, s);
        return d / o.length;
      }, r.skewness = function(o) {
        return r.stanMoment(o, 3);
      }, r.kurtosis = function(o) {
        return r.stanMoment(o, 4) - 3;
      };
      var p = r.prototype;
      (function(u) {
        for (var o = 0; o < u.length; o++)
          (function(s) {
            p[s] = function(l, f) {
              var v = [], d = 0, g = this;
              if (a(l) && (f = l, l = !1), f)
                return setTimeout(function() {
                  f.call(g, p[s].call(g, l));
                }), this;
              if (this.length > 1) {
                for (g = l === !0 ? this : this.transpose(); d < g.length; d++)
                  v[d] = r[s](g[d]);
                return v;
              }
              return r[s](this[0], l);
            };
          })(u[o]);
      })("cumsum cumprod".split(" ")), function(u) {
        for (var o = 0; o < u.length; o++)
          (function(s) {
            p[s] = function(l, f) {
              var v = [], d = 0, g = this;
              if (a(l) && (f = l, l = !1), f)
                return setTimeout(function() {
                  f.call(g, p[s].call(g, l));
                }), this;
              if (this.length > 1) {
                for (s !== "sumrow" && (g = l === !0 ? this : this.transpose()); d < g.length; d++)
                  v[d] = r[s](g[d]);
                return l === !0 ? r[s](r.utils.toVector(v)) : v;
              }
              return r[s](this[0], l);
            };
          })(u[o]);
      }("sum sumsqrd sumsqerr sumrow product min max unique mean meansqerr geomean median diff rank mode range variance deviation stdev meandev meddev coeffvar quartiles histogram skewness kurtosis".split(" ")), function(u) {
        for (var o = 0; o < u.length; o++)
          (function(s) {
            p[s] = function() {
              var l = [], f = 0, v = this, d = Array.prototype.slice.call(arguments), g;
              if (a(d[d.length - 1])) {
                g = d[d.length - 1];
                var E = d.slice(0, d.length - 1);
                return setTimeout(function() {
                  g.call(
                    v,
                    p[s].apply(v, E)
                  );
                }), this;
              } else {
                g = void 0;
                var A = function(N) {
                  return r[s].apply(v, [N].concat(d));
                };
              }
              if (this.length > 1) {
                for (v = v.transpose(); f < v.length; f++)
                  l[f] = A(v[f]);
                return l;
              }
              return A(this[0]);
            };
          })(u[o]);
      }("quantiles percentileOfScore".split(" "));
    }(n, Math), function(r, i) {
      r.gammaln = function(c) {
        var h = 0, p = [
          76.18009172947146,
          -86.50532032941678,
          24.01409824083091,
          -1.231739572450155,
          0.001208650973866179,
          -5395239384953e-18
        ], u = 1.000000000190015, o, s, l;
        for (l = (s = o = c) + 5.5, l -= (o + 0.5) * i.log(l); h < 6; h++)
          u += p[h] / ++s;
        return i.log(2.5066282746310007 * u / o) - l;
      }, r.loggam = function(c) {
        var h, p, u, o, s, l, f, v = [
          0.08333333333333333,
          -0.002777777777777778,
          7936507936507937e-19,
          -5952380952380952e-19,
          8417508417508418e-19,
          -0.001917526917526918,
          0.00641025641025641,
          -0.02955065359477124,
          0.1796443723688307,
          -1.3924322169059
        ];
        if (h = c, f = 0, c == 1 || c == 2)
          return 0;
        for (c <= 7 && (f = i.floor(7 - c), h = c + f), p = 1 / (h * h), u = 2 * i.PI, s = v[9], l = 8; l >= 0; l--)
          s *= p, s += v[l];
        if (o = s / h + 0.5 * i.log(u) + (h - 0.5) * i.log(h) - h, c <= 7)
          for (l = 1; l <= f; l++)
            o -= i.log(h - 1), h -= 1;
        return o;
      }, r.gammafn = function(c) {
        var h = [
          -1.716185138865495,
          24.76565080557592,
          -379.80425647094563,
          629.3311553128184,
          866.9662027904133,
          -31451.272968848367,
          -36144.413418691176,
          66456.14382024054
        ], p = [
          -30.8402300119739,
          315.35062697960416,
          -1015.1563674902192,
          -3107.771671572311,
          22538.11842098015,
          4755.846277527881,
          -134659.9598649693,
          -115132.2596755535
        ], u = !1, o = 0, s = 0, l = 0, f = c, v, d, g, E;
        if (c > 171.6243769536076)
          return 1 / 0;
        if (f <= 0)
          if (E = f % 1 + 36e-17, E)
            u = (f & 1 ? -1 : 1) * i.PI / i.sin(i.PI * E), f = 1 - f;
          else
            return 1 / 0;
        for (g = f, f < 1 ? d = f++ : d = (f -= o = (f | 0) - 1) - 1, v = 0; v < 8; ++v)
          l = (l + h[v]) * d, s = s * d + p[v];
        if (E = l / s + 1, g < f)
          E /= g;
        else if (g > f)
          for (v = 0; v < o; ++v)
            E *= f, f++;
        return u && (E = u / E), E;
      }, r.gammap = function(c, h) {
        return r.lowRegGamma(c, h) * r.gammafn(c);
      }, r.lowRegGamma = function(c, h) {
        var p = r.gammaln(c), u = c, o = 1 / c, s = o, l = h + 1 - c, f = 1 / 1e-30, v = 1 / l, d = v, g = 1, E = -~(i.log(c >= 1 ? c : 1 / c) * 8.5 + c * 0.4 + 17), A;
        if (h < 0 || c <= 0)
          return NaN;
        if (h < c + 1) {
          for (; g <= E; g++)
            o += s *= h / ++u;
          return o * i.exp(-h + c * i.log(h) - p);
        }
        for (; g <= E; g++)
          A = -g * (g - c), l += 2, v = A * v + l, f = l + A / f, v = 1 / v, d *= v * f;
        return 1 - d * i.exp(-h + c * i.log(h) - p);
      }, r.factorialln = function(c) {
        return c < 0 ? NaN : r.gammaln(c + 1);
      }, r.factorial = function(c) {
        return c < 0 ? NaN : r.gammafn(c + 1);
      }, r.combination = function(c, h) {
        return c > 170 || h > 170 ? i.exp(r.combinationln(c, h)) : r.factorial(c) / r.factorial(h) / r.factorial(c - h);
      }, r.combinationln = function(c, h) {
        return r.factorialln(c) - r.factorialln(h) - r.factorialln(c - h);
      }, r.permutation = function(c, h) {
        return r.factorial(c) / r.factorial(c - h);
      }, r.betafn = function(c, h) {
        if (!(c <= 0 || h <= 0))
          return c + h > 170 ? i.exp(r.betaln(c, h)) : r.gammafn(c) * r.gammafn(h) / r.gammafn(c + h);
      }, r.betaln = function(c, h) {
        return r.gammaln(c) + r.gammaln(h) - r.gammaln(c + h);
      }, r.betacf = function(c, h, p) {
        var u = 1e-30, o = 1, s = h + p, l = h + 1, f = h - 1, v = 1, d = 1 - s * c / l, g, E, A, m;
        for (i.abs(d) < u && (d = u), d = 1 / d, m = d; o <= 100 && (g = 2 * o, E = o * (p - o) * c / ((f + g) * (h + g)), d = 1 + E * d, i.abs(d) < u && (d = u), v = 1 + E / v, i.abs(v) < u && (v = u), d = 1 / d, m *= d * v, E = -(h + o) * (s + o) * c / ((h + g) * (l + g)), d = 1 + E * d, i.abs(d) < u && (d = u), v = 1 + E / v, i.abs(v) < u && (v = u), d = 1 / d, A = d * v, m *= A, !(i.abs(A - 1) < 3e-7)); o++)
          ;
        return m;
      }, r.gammapinv = function(c, h) {
        var p = 0, u = h - 1, o = 1e-8, s = r.gammaln(h), l, f, v, d, g, E, A;
        if (c >= 1)
          return i.max(100, h + 100 * i.sqrt(h));
        if (c <= 0)
          return 0;
        for (h > 1 ? (E = i.log(u), A = i.exp(u * (E - 1) - s), g = c < 0.5 ? c : 1 - c, v = i.sqrt(-2 * i.log(g)), l = (2.30753 + v * 0.27061) / (1 + v * (0.99229 + v * 0.04481)) - v, c < 0.5 && (l = -l), l = i.max(
          1e-3,
          h * i.pow(1 - 1 / (9 * h) - l / (3 * i.sqrt(h)), 3)
        )) : (v = 1 - h * (0.253 + h * 0.12), c < v ? l = i.pow(c / v, 1 / h) : l = 1 - i.log(1 - (c - v) / (1 - v))); p < 12; p++) {
          if (l <= 0)
            return 0;
          if (f = r.lowRegGamma(h, l) - c, h > 1 ? v = A * i.exp(-(l - u) + u * (i.log(l) - E)) : v = i.exp(-l + u * i.log(l) - s), d = f / v, l -= v = d / (1 - 0.5 * i.min(1, d * ((h - 1) / l - 1))), l <= 0 && (l = 0.5 * (l + v)), i.abs(v) < o * l)
            break;
        }
        return l;
      }, r.erf = function(c) {
        var h = [
          -1.3026537197817094,
          0.6419697923564902,
          0.019476473204185836,
          -0.00956151478680863,
          -946595344482036e-18,
          366839497852761e-18,
          42523324806907e-18,
          -20278578112534e-18,
          -1624290004647e-18,
          130365583558e-17,
          15626441722e-18,
          -85238095915e-18,
          6529054439e-18,
          5059343495e-18,
          -991364156e-18,
          -227365122e-18,
          96467911e-18,
          2394038e-18,
          -6886027e-18,
          894487e-18,
          313092e-18,
          -112708e-18,
          381e-18,
          7106e-18,
          -1523e-18,
          -94e-18,
          121e-18,
          -28e-18
        ], p = h.length - 1, u = !1, o = 0, s = 0, l, f, v, d;
        for (c < 0 && (c = -c, u = !0), l = 2 / (2 + c), f = 4 * l - 2; p > 0; p--)
          v = o, o = f * o - s + h[p], s = v;
        return d = l * i.exp(-c * c + 0.5 * (h[0] + f * o) - s), u ? d - 1 : 1 - d;
      }, r.erfc = function(c) {
        return 1 - r.erf(c);
      }, r.erfcinv = function(c) {
        var h = 0, p, u, o, s;
        if (c >= 2)
          return -100;
        if (c <= 0)
          return 100;
        for (s = c < 1 ? c : 2 - c, o = i.sqrt(-2 * i.log(s / 2)), p = -0.70711 * ((2.30753 + o * 0.27061) / (1 + o * (0.99229 + o * 0.04481)) - o); h < 2; h++)
          u = r.erfc(p) - s, p += u / (1.1283791670955126 * i.exp(-p * p) - p * u);
        return c < 1 ? p : -p;
      }, r.ibetainv = function(c, h, p) {
        var u = 1e-8, o = h - 1, s = p - 1, l = 0, f, v, d, g, E, A, m, N, y, R, T;
        if (c <= 0)
          return 0;
        if (c >= 1)
          return 1;
        for (h >= 1 && p >= 1 ? (d = c < 0.5 ? c : 1 - c, g = i.sqrt(-2 * i.log(d)), m = (2.30753 + g * 0.27061) / (1 + g * (0.99229 + g * 0.04481)) - g, c < 0.5 && (m = -m), N = (m * m - 3) / 6, y = 2 / (1 / (2 * h - 1) + 1 / (2 * p - 1)), R = m * i.sqrt(N + y) / y - (1 / (2 * p - 1) - 1 / (2 * h - 1)) * (N + 5 / 6 - 2 / (3 * y)), m = h / (h + p * i.exp(2 * R))) : (f = i.log(h / (h + p)), v = i.log(p / (h + p)), g = i.exp(h * f) / h, E = i.exp(p * v) / p, R = g + E, c < g / R ? m = i.pow(h * R * c, 1 / h) : m = 1 - i.pow(p * R * (1 - c), 1 / p)), T = -r.gammaln(h) - r.gammaln(p) + r.gammaln(h + p); l < 10; l++) {
          if (m === 0 || m === 1)
            return m;
          if (A = r.ibeta(m, h, p) - c, g = i.exp(o * i.log(m) + s * i.log(1 - m) + T), E = A / g, m -= g = E / (1 - 0.5 * i.min(1, E * (o / m - s / (1 - m)))), m <= 0 && (m = 0.5 * (m + g)), m >= 1 && (m = 0.5 * (m + g + 1)), i.abs(g) < u * m && l > 0)
            break;
        }
        return m;
      }, r.ibeta = function(c, h, p) {
        var u = c === 0 || c === 1 ? 0 : i.exp(r.gammaln(h + p) - r.gammaln(h) - r.gammaln(p) + h * i.log(c) + p * i.log(1 - c));
        return c < 0 || c > 1 ? !1 : c < (h + 1) / (h + p + 2) ? u * r.betacf(c, h, p) / h : 1 - u * r.betacf(1 - c, p, h) / p;
      }, r.randn = function(c, h) {
        var p, u, o, s, l;
        if (h || (h = c), c)
          return r.create(c, h, function() {
            return r.randn();
          });
        do
          p = r._random_fn(), u = 1.7156 * (r._random_fn() - 0.5), o = p - 0.449871, s = i.abs(u) + 0.386595, l = o * o + s * (0.196 * s - 0.25472 * o);
        while (l > 0.27597 && (l > 0.27846 || u * u > -4 * i.log(p) * p * p));
        return u / p;
      }, r.randg = function(c, h, p) {
        var u = c, o, s, l, f, v, d;
        if (p || (p = h), c || (c = 1), h)
          return d = r.zeros(h, p), d.alter(function() {
            return r.randg(c);
          }), d;
        c < 1 && (c += 1), o = c - 1 / 3, s = 1 / i.sqrt(9 * o);
        do {
          do
            v = r.randn(), f = 1 + s * v;
          while (f <= 0);
          f = f * f * f, l = r._random_fn();
        } while (l > 1 - 0.331 * i.pow(v, 4) && i.log(l) > 0.5 * v * v + o * (1 - f + i.log(f)));
        if (c == u)
          return o * f;
        do
          l = r._random_fn();
        while (l === 0);
        return i.pow(l, 1 / u) * o * f;
      }, function(a) {
        for (var c = 0; c < a.length; c++)
          (function(h) {
            r.fn[h] = function() {
              return r(
                r.map(this, function(p) {
                  return r[h](p);
                })
              );
            };
          })(a[c]);
      }("gammaln gammafn factorial factorialln".split(" ")), function(a) {
        for (var c = 0; c < a.length; c++)
          (function(h) {
            r.fn[h] = function() {
              return r(r[h].apply(null, arguments));
            };
          })(a[c]);
      }("randn".split(" "));
    }(n, Math), function(r, i) {
      (function(u) {
        for (var o = 0; o < u.length; o++)
          (function(s) {
            r[s] = function l(f, v, d) {
              return this instanceof l ? (this._a = f, this._b = v, this._c = d, this) : new l(f, v, d);
            }, r.fn[s] = function(l, f, v) {
              var d = r[s](l, f, v);
              return d.data = this, d;
            }, r[s].prototype.sample = function(l) {
              var f = this._a, v = this._b, d = this._c;
              return l ? r.alter(l, function() {
                return r[s].sample(f, v, d);
              }) : r[s].sample(f, v, d);
            }, function(l) {
              for (var f = 0; f < l.length; f++)
                (function(v) {
                  r[s].prototype[v] = function(d) {
                    var g = this._a, E = this._b, A = this._c;
                    return !d && d !== 0 && (d = this.data), typeof d != "number" ? r.fn.map.call(d, function(m) {
                      return r[s][v](m, g, E, A);
                    }) : r[s][v](d, g, E, A);
                  };
                })(l[f]);
            }("pdf cdf inv".split(" ")), function(l) {
              for (var f = 0; f < l.length; f++)
                (function(v) {
                  r[s].prototype[v] = function() {
                    return r[s][v](this._a, this._b, this._c);
                  };
                })(l[f]);
            }("mean median mode variance".split(" "));
          })(u[o]);
      })("beta centralF cauchy chisquare exponential gamma invgamma kumaraswamy laplace lognormal noncentralt normal pareto studentt weibull uniform binomial negbin hypgeom poisson triangular tukey arcsine".split(" ")), r.extend(r.beta, {
        pdf: function(o, s, l) {
          return o > 1 || o < 0 ? 0 : s == 1 && l == 1 ? 1 : s < 512 && l < 512 ? i.pow(o, s - 1) * i.pow(1 - o, l - 1) / r.betafn(s, l) : i.exp((s - 1) * i.log(o) + (l - 1) * i.log(1 - o) - r.betaln(s, l));
        },
        cdf: function(o, s, l) {
          return o > 1 || o < 0 ? (o > 1) * 1 : r.ibeta(o, s, l);
        },
        inv: function(o, s, l) {
          return r.ibetainv(o, s, l);
        },
        mean: function(o, s) {
          return o / (o + s);
        },
        median: function(o, s) {
          return r.ibetainv(0.5, o, s);
        },
        mode: function(o, s) {
          return (o - 1) / (o + s - 2);
        },
        // return a random sample
        sample: function(o, s) {
          var l = r.randg(o);
          return l / (l + r.randg(s));
        },
        variance: function(o, s) {
          return o * s / (i.pow(o + s, 2) * (o + s + 1));
        }
      }), r.extend(r.centralF, {
        // This implementation of the pdf function avoids float overflow
        // See the way that R calculates this value:
        // https://svn.r-project.org/R/trunk/src/nmath/df.c
        pdf: function(o, s, l) {
          var f, v, d;
          return o < 0 ? 0 : s <= 2 ? o === 0 && s < 2 ? 1 / 0 : o === 0 && s === 2 ? 1 : 1 / r.betafn(s / 2, l / 2) * i.pow(s / l, s / 2) * i.pow(o, s / 2 - 1) * i.pow(1 + s / l * o, -(s + l) / 2) : (f = s * o / (l + o * s), v = l / (l + o * s), d = s * v / 2, d * r.binomial.pdf((s - 2) / 2, (s + l - 2) / 2, f));
        },
        cdf: function(o, s, l) {
          return o < 0 ? 0 : r.ibeta(s * o / (s * o + l), s / 2, l / 2);
        },
        inv: function(o, s, l) {
          return l / (s * (1 / r.ibetainv(o, s / 2, l / 2) - 1));
        },
        mean: function(o, s) {
          return s > 2 ? s / (s - 2) : void 0;
        },
        mode: function(o, s) {
          return o > 2 ? s * (o - 2) / (o * (s + 2)) : void 0;
        },
        // return a random sample
        sample: function(o, s) {
          var l = r.randg(o / 2) * 2, f = r.randg(s / 2) * 2;
          return l / o / (f / s);
        },
        variance: function(o, s) {
          if (!(s <= 4))
            return 2 * s * s * (o + s - 2) / (o * (s - 2) * (s - 2) * (s - 4));
        }
      }), r.extend(r.cauchy, {
        pdf: function(o, s, l) {
          return l < 0 ? 0 : l / (i.pow(o - s, 2) + i.pow(l, 2)) / i.PI;
        },
        cdf: function(o, s, l) {
          return i.atan((o - s) / l) / i.PI + 0.5;
        },
        inv: function(u, o, s) {
          return o + s * i.tan(i.PI * (u - 0.5));
        },
        median: function(o) {
          return o;
        },
        mode: function(o) {
          return o;
        },
        sample: function(o, s) {
          return r.randn() * i.sqrt(1 / (2 * r.randg(0.5))) * s + o;
        }
      }), r.extend(r.chisquare, {
        pdf: function(o, s) {
          return o < 0 ? 0 : o === 0 && s === 2 ? 0.5 : i.exp((s / 2 - 1) * i.log(o) - o / 2 - s / 2 * i.log(2) - r.gammaln(s / 2));
        },
        cdf: function(o, s) {
          return o < 0 ? 0 : r.lowRegGamma(s / 2, o / 2);
        },
        inv: function(u, o) {
          return 2 * r.gammapinv(u, 0.5 * o);
        },
        mean: function(u) {
          return u;
        },
        // TODO: this is an approximation (is there a better way?)
        median: function(o) {
          return o * i.pow(1 - 2 / (9 * o), 3);
        },
        mode: function(o) {
          return o - 2 > 0 ? o - 2 : 0;
        },
        sample: function(o) {
          return r.randg(o / 2) * 2;
        },
        variance: function(o) {
          return 2 * o;
        }
      }), r.extend(r.exponential, {
        pdf: function(o, s) {
          return o < 0 ? 0 : s * i.exp(-s * o);
        },
        cdf: function(o, s) {
          return o < 0 ? 0 : 1 - i.exp(-s * o);
        },
        inv: function(u, o) {
          return -i.log(1 - u) / o;
        },
        mean: function(u) {
          return 1 / u;
        },
        median: function(u) {
          return 1 / u * i.log(2);
        },
        mode: function() {
          return 0;
        },
        sample: function(o) {
          return -1 / o * i.log(r._random_fn());
        },
        variance: function(u) {
          return i.pow(u, -2);
        }
      }), r.extend(r.gamma, {
        pdf: function(o, s, l) {
          return o < 0 ? 0 : o === 0 && s === 1 ? 1 / l : i.exp((s - 1) * i.log(o) - o / l - r.gammaln(s) - s * i.log(l));
        },
        cdf: function(o, s, l) {
          return o < 0 ? 0 : r.lowRegGamma(s, o / l);
        },
        inv: function(u, o, s) {
          return r.gammapinv(u, o) * s;
        },
        mean: function(u, o) {
          return u * o;
        },
        mode: function(o, s) {
          if (o > 1)
            return (o - 1) * s;
        },
        sample: function(o, s) {
          return r.randg(o) * s;
        },
        variance: function(o, s) {
          return o * s * s;
        }
      }), r.extend(r.invgamma, {
        pdf: function(o, s, l) {
          return o <= 0 ? 0 : i.exp(-(s + 1) * i.log(o) - l / o - r.gammaln(s) + s * i.log(l));
        },
        cdf: function(o, s, l) {
          return o <= 0 ? 0 : 1 - r.lowRegGamma(s, l / o);
        },
        inv: function(u, o, s) {
          return s / r.gammapinv(1 - u, o);
        },
        mean: function(u, o) {
          return u > 1 ? o / (u - 1) : void 0;
        },
        mode: function(o, s) {
          return s / (o + 1);
        },
        sample: function(o, s) {
          return s / r.randg(o);
        },
        variance: function(o, s) {
          if (!(o <= 2))
            return s * s / ((o - 1) * (o - 1) * (o - 2));
        }
      }), r.extend(r.kumaraswamy, {
        pdf: function(o, s, l) {
          return o === 0 && s === 1 ? l : o === 1 && l === 1 ? s : i.exp(i.log(s) + i.log(l) + (s - 1) * i.log(o) + (l - 1) * i.log(1 - i.pow(o, s)));
        },
        cdf: function(o, s, l) {
          return o < 0 ? 0 : o > 1 ? 1 : 1 - i.pow(1 - i.pow(o, s), l);
        },
        inv: function(o, s, l) {
          return i.pow(1 - i.pow(1 - o, 1 / l), 1 / s);
        },
        mean: function(u, o) {
          return o * r.gammafn(1 + 1 / u) * r.gammafn(o) / r.gammafn(1 + 1 / u + o);
        },
        median: function(o, s) {
          return i.pow(1 - i.pow(2, -1 / s), 1 / o);
        },
        mode: function(o, s) {
          if (o >= 1 && s >= 1 && o !== 1 && s !== 1)
            return i.pow((o - 1) / (o * s - 1), 1 / o);
        },
        variance: function() {
          throw new Error("variance not yet implemented");
        }
      }), r.extend(r.lognormal, {
        pdf: function(o, s, l) {
          return o <= 0 ? 0 : i.exp(-i.log(o) - 0.5 * i.log(2 * i.PI) - i.log(l) - i.pow(i.log(o) - s, 2) / (2 * l * l));
        },
        cdf: function(o, s, l) {
          return o < 0 ? 0 : 0.5 + 0.5 * r.erf((i.log(o) - s) / i.sqrt(2 * l * l));
        },
        inv: function(u, o, s) {
          return i.exp(-1.4142135623730951 * s * r.erfcinv(2 * u) + o);
        },
        mean: function(o, s) {
          return i.exp(o + s * s / 2);
        },
        median: function(o) {
          return i.exp(o);
        },
        mode: function(o, s) {
          return i.exp(o - s * s);
        },
        sample: function(o, s) {
          return i.exp(r.randn() * s + o);
        },
        variance: function(o, s) {
          return (i.exp(s * s) - 1) * i.exp(2 * o + s * s);
        }
      }), r.extend(r.noncentralt, {
        pdf: function(o, s, l) {
          var f = 1e-14;
          return i.abs(l) < f ? r.studentt.pdf(o, s) : i.abs(o) < f ? i.exp(r.gammaln((s + 1) / 2) - l * l / 2 - 0.5 * i.log(i.PI * s) - r.gammaln(s / 2)) : s / o * (r.noncentralt.cdf(o * i.sqrt(1 + 2 / s), s + 2, l) - r.noncentralt.cdf(o, s, l));
        },
        cdf: function(o, s, l) {
          var f = 1e-14, v = 200;
          if (i.abs(l) < f)
            return r.studentt.cdf(o, s);
          var d = !1;
          o < 0 && (d = !0, l = -l);
          for (var g = r.normal.cdf(-l, 0, 1), E = f + 1, A = E, m = o * o / (o * o + s), N = 0, y = i.exp(-l * l / 2), R = i.exp(-l * l / 2 - 0.5 * i.log(2) - r.gammaln(3 / 2)) * l; N < v || A > f || E > f; )
            A = E, N > 0 && (y *= l * l / (2 * N), R *= l * l / (2 * (N + 1 / 2))), E = y * r.beta.cdf(m, N + 0.5, s / 2) + R * r.beta.cdf(m, N + 1, s / 2), g += 0.5 * E, N++;
          return d ? 1 - g : g;
        }
      }), r.extend(r.normal, {
        pdf: function(o, s, l) {
          return i.exp(-0.5 * i.log(2 * i.PI) - i.log(l) - i.pow(o - s, 2) / (2 * l * l));
        },
        cdf: function(o, s, l) {
          return 0.5 * (1 + r.erf((o - s) / i.sqrt(2 * l * l)));
        },
        inv: function(u, o, s) {
          return -1.4142135623730951 * s * r.erfcinv(2 * u) + o;
        },
        mean: function(u) {
          return u;
        },
        median: function(o) {
          return o;
        },
        mode: function(u) {
          return u;
        },
        sample: function(o, s) {
          return r.randn() * s + o;
        },
        variance: function(u, o) {
          return o * o;
        }
      }), r.extend(r.pareto, {
        pdf: function(o, s, l) {
          return o < s ? 0 : l * i.pow(s, l) / i.pow(o, l + 1);
        },
        cdf: function(o, s, l) {
          return o < s ? 0 : 1 - i.pow(s / o, l);
        },
        inv: function(o, s, l) {
          return s / i.pow(1 - o, 1 / l);
        },
        mean: function(o, s) {
          if (!(s <= 1))
            return s * i.pow(o, s) / (s - 1);
        },
        median: function(o, s) {
          return o * (s * i.SQRT2);
        },
        mode: function(o) {
          return o;
        },
        variance: function(u, o) {
          if (!(o <= 2))
            return u * u * o / (i.pow(o - 1, 2) * (o - 2));
        }
      }), r.extend(r.studentt, {
        pdf: function(o, s) {
          return s = s > 1e100 ? 1e100 : s, 1 / (i.sqrt(s) * r.betafn(0.5, s / 2)) * i.pow(1 + o * o / s, -((s + 1) / 2));
        },
        cdf: function(o, s) {
          var l = s / 2;
          return r.ibeta((o + i.sqrt(o * o + s)) / (2 * i.sqrt(o * o + s)), l, l);
        },
        inv: function(u, o) {
          var s = r.ibetainv(2 * i.min(u, 1 - u), 0.5 * o, 0.5);
          return s = i.sqrt(o * (1 - s) / s), u > 0.5 ? s : -s;
        },
        mean: function(o) {
          return o > 1 ? 0 : void 0;
        },
        median: function() {
          return 0;
        },
        mode: function() {
          return 0;
        },
        sample: function(o) {
          return r.randn() * i.sqrt(o / (2 * r.randg(o / 2)));
        },
        variance: function(o) {
          return o > 2 ? o / (o - 2) : o > 1 ? 1 / 0 : void 0;
        }
      }), r.extend(r.weibull, {
        pdf: function(o, s, l) {
          return o < 0 || s < 0 || l < 0 ? 0 : l / s * i.pow(o / s, l - 1) * i.exp(-i.pow(o / s, l));
        },
        cdf: function(o, s, l) {
          return o < 0 ? 0 : 1 - i.exp(-i.pow(o / s, l));
        },
        inv: function(u, o, s) {
          return o * i.pow(-i.log(1 - u), 1 / s);
        },
        mean: function(u, o) {
          return u * r.gammafn(1 + 1 / o);
        },
        median: function(o, s) {
          return o * i.pow(i.log(2), 1 / s);
        },
        mode: function(o, s) {
          return s <= 1 ? 0 : o * i.pow((s - 1) / s, 1 / s);
        },
        sample: function(o, s) {
          return o * i.pow(-i.log(r._random_fn()), 1 / s);
        },
        variance: function(o, s) {
          return o * o * r.gammafn(1 + 2 / s) - i.pow(r.weibull.mean(o, s), 2);
        }
      }), r.extend(r.uniform, {
        pdf: function(o, s, l) {
          return o < s || o > l ? 0 : 1 / (l - s);
        },
        cdf: function(o, s, l) {
          return o < s ? 0 : o < l ? (o - s) / (l - s) : 1;
        },
        inv: function(u, o, s) {
          return o + u * (s - o);
        },
        mean: function(o, s) {
          return 0.5 * (o + s);
        },
        median: function(o, s) {
          return r.mean(o, s);
        },
        mode: function() {
          throw new Error("mode is not yet implemented");
        },
        sample: function(o, s) {
          return o / 2 + s / 2 + (s / 2 - o / 2) * (2 * r._random_fn() - 1);
        },
        variance: function(o, s) {
          return i.pow(s - o, 2) / 12;
        }
      });
      function a(u, o, s, l) {
        for (var f = 0, v = 1, d = 1, g = 1, E = 0, A = 0, m; i.abs((d - A) / d) > l; )
          A = d, m = -(o + E) * (o + s + E) * u / (o + 2 * E) / (o + 2 * E + 1), f = d + m * f, v = g + m * v, E = E + 1, m = E * (s - E) * u / (o + 2 * E - 1) / (o + 2 * E), d = f + m * d, g = v + m * g, f = f / g, v = v / g, d = d / g, g = 1;
        return d / o;
      }
      r.extend(r.binomial, {
        pdf: function(o, s, l) {
          return l === 0 || l === 1 ? s * l === o ? 1 : 0 : r.combination(s, o) * i.pow(l, o) * i.pow(1 - l, s - o);
        },
        cdf: function(o, s, l) {
          var f, v = 1e-10;
          if (o < 0)
            return 0;
          if (o >= s)
            return 1;
          if (l < 0 || l > 1 || s <= 0)
            return NaN;
          o = i.floor(o);
          var d = l, g = o + 1, E = s - o, A = g + E, m = i.exp(r.gammaln(A) - r.gammaln(E) - r.gammaln(g) + g * i.log(d) + E * i.log(1 - d));
          return d < (g + 1) / (A + 2) ? f = m * a(d, g, E, v) : f = 1 - m * a(1 - d, E, g, v), i.round((1 - f) * (1 / v)) / (1 / v);
        }
      }), r.extend(r.negbin, {
        pdf: function(o, s, l) {
          return o !== o >>> 0 ? !1 : o < 0 ? 0 : r.combination(o + s - 1, s - 1) * i.pow(1 - l, o) * i.pow(l, s);
        },
        cdf: function(o, s, l) {
          var f = 0, v = 0;
          if (o < 0)
            return 0;
          for (; v <= o; v++)
            f += r.negbin.pdf(v, s, l);
          return f;
        }
      }), r.extend(r.hypgeom, {
        pdf: function(o, s, l, f) {
          if (o !== o | 0)
            return !1;
          if (o < 0 || o < l - (s - f))
            return 0;
          if (o > f || o > l)
            return 0;
          if (l * 2 > s)
            return f * 2 > s ? r.hypgeom.pdf(s - l - f + o, s, s - l, s - f) : r.hypgeom.pdf(f - o, s, s - l, f);
          if (f * 2 > s)
            return r.hypgeom.pdf(l - o, s, l, s - f);
          if (l < f)
            return r.hypgeom.pdf(o, s, f, l);
          for (var v = 1, d = 0, g = 0; g < o; g++) {
            for (; v > 1 && d < f; )
              v *= 1 - l / (s - d), d++;
            v *= (f - g) * (l - g) / ((g + 1) * (s - l - f + g + 1));
          }
          for (; d < f; d++)
            v *= 1 - l / (s - d);
          return i.min(1, i.max(0, v));
        },
        cdf: function(o, s, l, f) {
          if (o < 0 || o < l - (s - f))
            return 0;
          if (o >= f || o >= l)
            return 1;
          if (l * 2 > s)
            return f * 2 > s ? r.hypgeom.cdf(s - l - f + o, s, s - l, s - f) : 1 - r.hypgeom.cdf(f - o - 1, s, s - l, f);
          if (f * 2 > s)
            return 1 - r.hypgeom.cdf(l - o - 1, s, l, s - f);
          if (l < f)
            return r.hypgeom.cdf(o, s, f, l);
          for (var v = 1, d = 1, g = 0, E = 0; E < o; E++) {
            for (; v > 1 && g < f; ) {
              var A = 1 - l / (s - g);
              d *= A, v *= A, g++;
            }
            d *= (f - E) * (l - E) / ((E + 1) * (s - l - f + E + 1)), v += d;
          }
          for (; g < f; g++)
            v *= 1 - l / (s - g);
          return i.min(1, i.max(0, v));
        }
      }), r.extend(r.poisson, {
        pdf: function(o, s) {
          return s < 0 || o % 1 !== 0 || o < 0 ? 0 : i.pow(s, o) * i.exp(-s) / r.factorial(o);
        },
        cdf: function(o, s) {
          var l = [], f = 0;
          if (o < 0)
            return 0;
          for (; f <= o; f++)
            l.push(r.poisson.pdf(f, s));
          return r.sum(l);
        },
        mean: function(u) {
          return u;
        },
        variance: function(u) {
          return u;
        },
        sampleSmall: function(o) {
          var s = 1, l = 0, f = i.exp(-o);
          do
            l++, s *= r._random_fn();
          while (s > f);
          return l - 1;
        },
        sampleLarge: function(o) {
          var s = o, l, f, v, d, g, E, A, m, N, y;
          for (d = i.sqrt(s), g = i.log(s), A = 0.931 + 2.53 * d, E = -0.059 + 0.02483 * A, m = 1.1239 + 1.1328 / (A - 3.4), N = 0.9277 - 3.6224 / (A - 2); ; ) {
            if (f = i.random() - 0.5, v = i.random(), y = 0.5 - i.abs(f), l = i.floor((2 * E / y + A) * f + s + 0.43), y >= 0.07 && v <= N)
              return l;
            if (!(l < 0 || y < 0.013 && v > y) && i.log(v) + i.log(m) - i.log(E / (y * y) + A) <= -s + l * g - r.loggam(l + 1))
              return l;
          }
        },
        sample: function(o) {
          return o < 10 ? this.sampleSmall(o) : this.sampleLarge(o);
        }
      }), r.extend(r.triangular, {
        pdf: function(o, s, l, f) {
          return l <= s || f < s || f > l ? NaN : o < s || o > l ? 0 : o < f ? 2 * (o - s) / ((l - s) * (f - s)) : o === f ? 2 / (l - s) : 2 * (l - o) / ((l - s) * (l - f));
        },
        cdf: function(o, s, l, f) {
          return l <= s || f < s || f > l ? NaN : o <= s ? 0 : o >= l ? 1 : o <= f ? i.pow(o - s, 2) / ((l - s) * (f - s)) : 1 - i.pow(l - o, 2) / ((l - s) * (l - f));
        },
        inv: function(o, s, l, f) {
          return l <= s || f < s || f > l ? NaN : o <= (f - s) / (l - s) ? s + (l - s) * i.sqrt(o * ((f - s) / (l - s))) : s + (l - s) * (1 - i.sqrt((1 - o) * (1 - (f - s) / (l - s))));
        },
        mean: function(o, s, l) {
          return (o + s + l) / 3;
        },
        median: function(o, s, l) {
          if (l <= (o + s) / 2)
            return s - i.sqrt((s - o) * (s - l)) / i.sqrt(2);
          if (l > (o + s) / 2)
            return o + i.sqrt((s - o) * (l - o)) / i.sqrt(2);
        },
        mode: function(o, s, l) {
          return l;
        },
        sample: function(o, s, l) {
          var f = r._random_fn();
          return f < (l - o) / (s - o) ? o + i.sqrt(f * (s - o) * (l - o)) : s - i.sqrt((1 - f) * (s - o) * (s - l));
        },
        variance: function(o, s, l) {
          return (o * o + s * s + l * l - o * s - o * l - s * l) / 18;
        }
      }), r.extend(r.arcsine, {
        pdf: function(o, s, l) {
          return l <= s ? NaN : o <= s || o >= l ? 0 : 2 / i.PI * i.pow(i.pow(l - s, 2) - i.pow(2 * o - s - l, 2), -0.5);
        },
        cdf: function(o, s, l) {
          return o < s ? 0 : o < l ? 2 / i.PI * i.asin(i.sqrt((o - s) / (l - s))) : 1;
        },
        inv: function(u, o, s) {
          return o + (0.5 - 0.5 * i.cos(i.PI * u)) * (s - o);
        },
        mean: function(o, s) {
          return s <= o ? NaN : (o + s) / 2;
        },
        median: function(o, s) {
          return s <= o ? NaN : (o + s) / 2;
        },
        mode: function() {
          throw new Error("mode is not yet implemented");
        },
        sample: function(o, s) {
          return (o + s) / 2 + (s - o) / 2 * i.sin(2 * i.PI * r.uniform.sample(0, 1));
        },
        variance: function(o, s) {
          return s <= o ? NaN : i.pow(s - o, 2) / 8;
        }
      });
      function c(u) {
        return u / i.abs(u);
      }
      r.extend(r.laplace, {
        pdf: function(o, s, l) {
          return l <= 0 ? 0 : i.exp(-i.abs(o - s) / l) / (2 * l);
        },
        cdf: function(o, s, l) {
          return l <= 0 ? 0 : o < s ? 0.5 * i.exp((o - s) / l) : 1 - 0.5 * i.exp(-(o - s) / l);
        },
        mean: function(u) {
          return u;
        },
        median: function(u) {
          return u;
        },
        mode: function(u) {
          return u;
        },
        variance: function(u, o) {
          return 2 * o * o;
        },
        sample: function(o, s) {
          var l = r._random_fn() - 0.5;
          return o - s * c(l) * i.log(1 - 2 * i.abs(l));
        }
      });
      function h(u, o, s) {
        var l = 12, f = 6, v = -30, d = -50, g = 60, E = 8, A = 3, m = 2, N = 3, y = [
          0.9815606342467192,
          0.9041172563704749,
          0.7699026741943047,
          0.5873179542866175,
          0.3678314989981802,
          0.1252334085114689
        ], R = [
          0.04717533638651183,
          0.10693932599531843,
          0.16007832854334622,
          0.20316742672306592,
          0.2334925365383548,
          0.24914704581340277
        ], T = u * 0.5;
        if (T >= E)
          return 1;
        var w = 2 * r.normal.cdf(T, 0, 1, 1, 0) - 1;
        w >= i.exp(d / s) ? w = i.pow(w, s) : w = 0;
        var C;
        u > A ? C = m : C = N;
        for (var M = T, _ = (E - T) / C, W = M + _, F = 0, S = s - 1, G = 1; G <= C; G++) {
          for (var J = 0, le = 0.5 * (W + M), tt = 0.5 * (W - M), Ae = 1; Ae <= l; Ae++) {
            var Be, Fe;
            f < Ae ? (Be = l - Ae + 1, Fe = y[Be - 1]) : (Be = Ae, Fe = -y[Be - 1]);
            var nt = tt * Fe, Ee = le + nt, ue = Ee * Ee;
            if (ue > g)
              break;
            var gt = 2 * r.normal.cdf(Ee, 0, 1, 1, 0), Bt = 2 * r.normal.cdf(Ee, u, 1, 1, 0), Et = gt * 0.5 - Bt * 0.5;
            Et >= i.exp(v / S) && (Et = R[Be - 1] * i.exp(-(0.5 * ue)) * i.pow(Et, S), J += Et);
          }
          J *= 2 * tt * s / i.sqrt(2 * i.PI), F += J, M = W, W += _;
        }
        return w += F, w <= i.exp(v / o) ? 0 : (w = i.pow(w, o), w >= 1 ? 1 : w);
      }
      function p(u, o, s) {
        var l = 0.322232421088, f = 0.099348462606, v = -1, d = 0.588581570495, g = -0.342242088547, E = 0.531103462366, A = -0.204231210125, m = 0.10353775285, N = -453642210148e-16, y = 0.0038560700634, R = 0.8832, T = 0.2368, w = 1.214, C = 1.208, M = 1.4142, _ = 120, W = 0.5 - 0.5 * u, F = i.sqrt(i.log(1 / (W * W))), S = F + ((((F * N + A) * F + g) * F + v) * F + l) / ((((F * y + m) * F + E) * F + d) * F + f);
        s < _ && (S += (S * S * S + S) / s / 4);
        var G = R - T * S;
        return s < _ && (G += -w / s + C * S / s), S * (G * i.log(o - 1) + M);
      }
      r.extend(r.tukey, {
        cdf: function(o, s, l) {
          var f = 1, v = s, d = 16, g = 8, E = -30, A = 1e-14, m = 100, N = 800, y = 5e3, R = 25e3, T = 1, w = 0.5, C = 0.25, M = 0.125, _ = [
            0.9894009349916499,
            0.9445750230732326,
            0.8656312023878318,
            0.755404408355003,
            0.6178762444026438,
            0.45801677765722737,
            0.2816035507792589,
            0.09501250983763744
          ], W = [
            0.027152459411754096,
            0.062253523938647894,
            0.09515851168249279,
            0.12462897125553388,
            0.14959598881657674,
            0.16915651939500254,
            0.18260341504492358,
            0.1894506104550685
          ];
          if (o <= 0)
            return 0;
          if (l < 2 || f < 1 || v < 2)
            return NaN;
          if (!Number.isFinite(o))
            return 1;
          if (l > R)
            return h(o, f, v);
          var F = l * 0.5, S = F * i.log(l) - l * i.log(2) - r.gammaln(F), G = F - 1, J = l * 0.25, le;
          l <= m ? le = T : l <= N ? le = w : l <= y ? le = C : le = M, S += i.log(le);
          for (var tt = 0, Ae = 1; Ae <= 50; Ae++) {
            for (var Be = 0, Fe = (2 * Ae - 1) * le, nt = 1; nt <= d; nt++) {
              var Ee, ue;
              g < nt ? (Ee = nt - g - 1, ue = S + G * i.log(Fe + _[Ee] * le) - (_[Ee] * le + Fe) * J) : (Ee = nt - 1, ue = S + G * i.log(Fe - _[Ee] * le) + (_[Ee] * le - Fe) * J);
              var gt;
              if (ue >= E) {
                g < nt ? gt = o * i.sqrt((_[Ee] * le + Fe) * 0.5) : gt = o * i.sqrt((-(_[Ee] * le) + Fe) * 0.5);
                var Bt = h(gt, f, v), Et = Bt * W[Ee] * i.exp(ue);
                Be += Et;
              }
            }
            if (Ae * le >= 1 && Be <= A)
              break;
            tt += Be;
          }
          if (Be > A)
            throw new Error("tukey.cdf failed to converge");
          return tt > 1 && (tt = 1), tt;
        },
        inv: function(u, o, s) {
          var l = 1, f = o, v = 1e-4, d = 50;
          if (s < 2 || l < 1 || f < 2)
            return NaN;
          if (u < 0 || u > 1)
            return NaN;
          if (u === 0)
            return 0;
          if (u === 1)
            return 1 / 0;
          var g = p(u, f, s), E = r.tukey.cdf(g, o, s) - u, A;
          E > 0 ? A = i.max(0, g - 1) : A = g + 1;
          for (var m = r.tukey.cdf(A, o, s) - u, N, y = 1; y < d; y++) {
            N = A - m * (A - g) / (m - E), E = m, g = A, N < 0 && (N = 0, m = -u), m = r.tukey.cdf(N, o, s) - u, A = N;
            var R = i.abs(A - g);
            if (R < v)
              return N;
          }
          throw new Error("tukey.inv failed to converge");
        }
      });
    }(n, Math), function(r, i) {
      var a = Array.prototype.push, c = r.utils.isArray;
      function h(p) {
        return c(p) || p instanceof r;
      }
      r.extend({
        // add a vector/matrix to a vector/matrix or scalar
        add: function(u, o) {
          return h(o) ? (h(o[0]) || (o = [o]), r.map(u, function(s, l, f) {
            return s + o[l][f];
          })) : r.map(u, function(s) {
            return s + o;
          });
        },
        // subtract a vector or scalar from the vector
        subtract: function(u, o) {
          return h(o) ? (h(o[0]) || (o = [o]), r.map(u, function(s, l, f) {
            return s - o[l][f] || 0;
          })) : r.map(u, function(s) {
            return s - o;
          });
        },
        // matrix division
        divide: function(u, o) {
          return h(o) ? (h(o[0]) || (o = [o]), r.multiply(u, r.inv(o))) : r.map(u, function(s) {
            return s / o;
          });
        },
        // matrix multiplication
        multiply: function(u, o) {
          var s, l, f, v, d, g, E, A;
          if (u.length === void 0 && o.length === void 0)
            return u * o;
          if (d = u.length, g = u[0].length, E = r.zeros(d, f = h(o) ? o[0].length : g), A = 0, h(o)) {
            for (; A < f; A++)
              for (s = 0; s < d; s++) {
                for (v = 0, l = 0; l < g; l++)
                  v += u[s][l] * o[l][A];
                E[s][A] = v;
              }
            return d === 1 && A === 1 ? E[0][0] : E;
          }
          return r.map(u, function(m) {
            return m * o;
          });
        },
        // outer([1,2,3],[4,5,6])
        // ===
        // [[1],[2],[3]] times [[4,5,6]]
        // ->
        // [[4,5,6],[8,10,12],[12,15,18]]
        outer: function(u, o) {
          return r.multiply(u.map(function(s) {
            return [s];
          }), [o]);
        },
        // Returns the dot product of two matricies
        dot: function(u, o) {
          h(u[0]) || (u = [u]), h(o[0]) || (o = [o]);
          for (var s = u[0].length === 1 && u.length !== 1 ? r.transpose(u) : u, l = o[0].length === 1 && o.length !== 1 ? r.transpose(o) : o, f = [], v = 0, d = s.length, g = s[0].length, E, A; v < d; v++) {
            for (f[v] = [], E = 0, A = 0; A < g; A++)
              E += s[v][A] * l[v][A];
            f[v] = E;
          }
          return f.length === 1 ? f[0] : f;
        },
        // raise every element by a scalar
        pow: function(u, o) {
          return r.map(u, function(s) {
            return i.pow(s, o);
          });
        },
        // exponentiate every element
        exp: function(u) {
          return r.map(u, function(o) {
            return i.exp(o);
          });
        },
        // generate the natural log of every element
        log: function(u) {
          return r.map(u, function(o) {
            return i.log(o);
          });
        },
        // generate the absolute values of the vector
        abs: function(u) {
          return r.map(u, function(o) {
            return i.abs(o);
          });
        },
        // computes the p-norm of the vector
        // In the case that a matrix is passed, uses the first row as the vector
        norm: function(u, o) {
          var s = 0, l = 0;
          for (isNaN(o) && (o = 2), h(u[0]) && (u = u[0]); l < u.length; l++)
            s += i.pow(i.abs(u[l]), o);
          return i.pow(s, 1 / o);
        },
        // computes the angle between two vectors in rads
        // In case a matrix is passed, this uses the first row as the vector
        angle: function(u, o) {
          return i.acos(r.dot(u, o) / (r.norm(u) * r.norm(o)));
        },
        // augment one matrix by another
        // Note: this function returns a matrix, not a jStat object
        aug: function(u, o) {
          var s = [], l;
          for (l = 0; l < u.length; l++)
            s.push(u[l].slice());
          for (l = 0; l < s.length; l++)
            a.apply(s[l], o[l]);
          return s;
        },
        // The inv() function calculates the inverse of a matrix
        // Create the inverse by augmenting the matrix by the identity matrix of the
        // appropriate size, and then use G-J elimination on the augmented matrix.
        inv: function(u) {
          for (var o = u.length, s = u[0].length, l = r.identity(o, s), f = r.gauss_jordan(u, l), v = [], d = 0, g; d < o; d++)
            for (v[d] = [], g = s; g < f[0].length; g++)
              v[d][g - s] = f[d][g];
          return v;
        },
        // calculate the determinant of a matrix
        det: function p(u) {
          if (u.length === 2)
            return u[0][0] * u[1][1] - u[0][1] * u[1][0];
          for (var o = 0, s = 0; s < u.length; s++) {
            for (var l = [], f = 1; f < u.length; f++) {
              l[f - 1] = [];
              for (var v = 0; v < u.length; v++)
                v < s ? l[f - 1][v] = u[f][v] : v > s && (l[f - 1][v - 1] = u[f][v]);
            }
            var d = s % 2 ? -1 : 1;
            o += p(l) * u[0][s] * d;
          }
          return o;
        },
        gauss_elimination: function(u, o) {
          var s = 0, l = 0, f = u.length, v = u[0].length, d = 1, g = 0, E = [], A, m, N, y;
          for (u = r.aug(u, o), A = u[0].length, s = 0; s < f; s++) {
            for (m = u[s][s], l = s, y = s + 1; y < v; y++)
              m < i.abs(u[y][s]) && (m = u[y][s], l = y);
            if (l != s)
              for (y = 0; y < A; y++)
                N = u[s][y], u[s][y] = u[l][y], u[l][y] = N;
            for (l = s + 1; l < f; l++)
              for (d = u[l][s] / u[s][s], y = s; y < A; y++)
                u[l][y] = u[l][y] - d * u[s][y];
          }
          for (s = f - 1; s >= 0; s--) {
            for (g = 0, l = s + 1; l <= f - 1; l++)
              g = g + E[l] * u[s][l];
            E[s] = (u[s][A - 1] - g) / u[s][s];
          }
          return E;
        },
        gauss_jordan: function(u, o) {
          var s = r.aug(u, o), l = s.length, f = s[0].length, v = 0, d, g, E;
          for (g = 0; g < l; g++) {
            var A = g;
            for (E = g + 1; E < l; E++)
              i.abs(s[E][g]) > i.abs(s[A][g]) && (A = E);
            var m = s[g];
            for (s[g] = s[A], s[A] = m, E = g + 1; E < l; E++)
              for (v = s[E][g] / s[g][g], d = g; d < f; d++)
                s[E][d] -= s[g][d] * v;
          }
          for (g = l - 1; g >= 0; g--) {
            for (v = s[g][g], E = 0; E < g; E++)
              for (d = f - 1; d > g - 1; d--)
                s[E][d] -= s[g][d] * s[E][g] / v;
            for (s[g][g] /= v, d = l; d < f; d++)
              s[g][d] /= v;
          }
          return s;
        },
        // solve equation
        // Ax=b
        // A is upper triangular matrix
        // A=[[1,2,3],[0,4,5],[0,6,7]]
        // b=[1,2,3]
        // triaUpSolve(A,b) // -> [2.666,0.1666,1.666]
        // if you use matrix style
        // A=[[1,2,3],[0,4,5],[0,6,7]]
        // b=[[1],[2],[3]]
        // will return [[2.666],[0.1666],[1.666]]
        triaUpSolve: function(u, o) {
          var s = u[0].length, l = r.zeros(1, s)[0], f, v = !1;
          return o[0].length != null && (o = o.map(function(d) {
            return d[0];
          }), v = !0), r.arange(s - 1, -1, -1).forEach(function(d) {
            f = r.arange(d + 1, s).map(function(g) {
              return l[g] * u[d][g];
            }), l[d] = (o[d] - r.sum(f)) / u[d][d];
          }), v ? l.map(function(d) {
            return [d];
          }) : l;
        },
        triaLowSolve: function(u, o) {
          var s = u[0].length, l = r.zeros(1, s)[0], f, v = !1;
          return o[0].length != null && (o = o.map(function(d) {
            return d[0];
          }), v = !0), r.arange(s).forEach(function(d) {
            f = r.arange(d).map(function(g) {
              return u[d][g] * l[g];
            }), l[d] = (o[d] - r.sum(f)) / u[d][d];
          }), v ? l.map(function(d) {
            return [d];
          }) : l;
        },
        // A -> [L,U]
        // A=LU
        // L is lower triangular matrix
        // U is upper triangular matrix
        lu: function(u) {
          var o = u.length, s = r.identity(o), l = r.zeros(u.length, u[0].length), f;
          return r.arange(o).forEach(function(v) {
            l[0][v] = u[0][v];
          }), r.arange(1, o).forEach(function(v) {
            r.arange(v).forEach(function(d) {
              f = r.arange(d).map(function(g) {
                return s[v][g] * l[g][d];
              }), s[v][d] = (u[v][d] - r.sum(f)) / l[d][d];
            }), r.arange(v, o).forEach(function(d) {
              f = r.arange(v).map(function(g) {
                return s[v][g] * l[g][d];
              }), l[v][d] = u[f.length][d] - r.sum(f);
            });
          }), [s, l];
        },
        // A -> T
        // A=TT'
        // T is lower triangular matrix
        cholesky: function(u) {
          var o = u.length, s = r.zeros(u.length, u[0].length), l;
          return r.arange(o).forEach(function(f) {
            l = r.arange(f).map(function(v) {
              return i.pow(s[f][v], 2);
            }), s[f][f] = i.sqrt(u[f][f] - r.sum(l)), r.arange(f + 1, o).forEach(function(v) {
              l = r.arange(f).map(function(d) {
                return s[f][d] * s[v][d];
              }), s[v][f] = (u[f][v] - r.sum(l)) / s[f][f];
            });
          }), s;
        },
        gauss_jacobi: function(u, o, s, l) {
          for (var f = 0, v = 0, d = u.length, g = [], E = [], A = [], m, N, y, R; f < d; f++)
            for (g[f] = [], E[f] = [], A[f] = [], v = 0; v < d; v++)
              f > v ? (g[f][v] = u[f][v], E[f][v] = A[f][v] = 0) : f < v ? (E[f][v] = u[f][v], g[f][v] = A[f][v] = 0) : (A[f][v] = u[f][v], g[f][v] = E[f][v] = 0);
          for (y = r.multiply(r.multiply(r.inv(A), r.add(g, E)), -1), N = r.multiply(r.inv(A), o), m = s, R = r.add(r.multiply(y, s), N), f = 2; i.abs(r.norm(r.subtract(R, m))) > l; )
            m = R, R = r.add(r.multiply(y, m), N), f++;
          return R;
        },
        gauss_seidel: function(u, o, s, l) {
          for (var f = 0, v = u.length, d = [], g = [], E = [], A, m, N, y, R; f < v; f++)
            for (d[f] = [], g[f] = [], E[f] = [], A = 0; A < v; A++)
              f > A ? (d[f][A] = u[f][A], g[f][A] = E[f][A] = 0) : f < A ? (g[f][A] = u[f][A], d[f][A] = E[f][A] = 0) : (E[f][A] = u[f][A], d[f][A] = g[f][A] = 0);
          for (y = r.multiply(r.multiply(r.inv(r.add(E, d)), g), -1), N = r.multiply(r.inv(r.add(E, d)), o), m = s, R = r.add(r.multiply(y, s), N), f = 2; i.abs(r.norm(r.subtract(R, m))) > l; )
            m = R, R = r.add(r.multiply(y, m), N), f = f + 1;
          return R;
        },
        SOR: function(u, o, s, l, f) {
          for (var v = 0, d = u.length, g = [], E = [], A = [], m, N, y, R, T; v < d; v++)
            for (g[v] = [], E[v] = [], A[v] = [], m = 0; m < d; m++)
              v > m ? (g[v][m] = u[v][m], E[v][m] = A[v][m] = 0) : v < m ? (E[v][m] = u[v][m], g[v][m] = A[v][m] = 0) : (A[v][m] = u[v][m], g[v][m] = E[v][m] = 0);
          for (R = r.multiply(
            r.inv(r.add(A, r.multiply(g, f))),
            r.subtract(
              r.multiply(A, 1 - f),
              r.multiply(E, f)
            )
          ), y = r.multiply(r.multiply(r.inv(r.add(
            A,
            r.multiply(g, f)
          )), o), f), N = s, T = r.add(r.multiply(R, s), y), v = 2; i.abs(r.norm(r.subtract(T, N))) > l; )
            N = T, T = r.add(r.multiply(R, N), y), v++;
          return T;
        },
        householder: function(u) {
          for (var o = u.length, s = u[0].length, l = 0, f = [], v = [], d, g, E, A, m; l < o - 1; l++) {
            for (d = 0, A = l + 1; A < s; A++)
              d += u[A][l] * u[A][l];
            for (m = u[l + 1][l] > 0 ? -1 : 1, d = m * i.sqrt(d), g = i.sqrt((d * d - u[l + 1][l] * d) / 2), f = r.zeros(o, 1), f[l + 1][0] = (u[l + 1][l] - d) / (2 * g), E = l + 2; E < o; E++)
              f[E][0] = u[E][l] / (2 * g);
            v = r.subtract(
              r.identity(o, s),
              r.multiply(r.multiply(f, r.transpose(f)), 2)
            ), u = r.multiply(v, r.multiply(u, v));
          }
          return u;
        },
        // A -> [Q,R]
        // Q is orthogonal matrix
        // R is upper triangular
        QR: function() {
          var p = r.sum, u = r.arange;
          function o(s) {
            var l = s.length, f = s[0].length, v = r.zeros(f, f);
            s = r.copy(s);
            var d, g, E;
            for (g = 0; g < f; g++) {
              for (v[g][g] = i.sqrt(p(u(l).map(function(A) {
                return s[A][g] * s[A][g];
              }))), d = 0; d < l; d++)
                s[d][g] = s[d][g] / v[g][g];
              for (E = g + 1; E < f; E++)
                for (v[g][E] = p(u(l).map(function(A) {
                  return s[A][g] * s[A][E];
                })), d = 0; d < l; d++)
                  s[d][E] = s[d][E] - s[d][g] * v[g][E];
            }
            return [s, v];
          }
          return o;
        }(),
        lstsq: function() {
          function p(o) {
            o = r.copy(o);
            var s = o.length, l = r.identity(s);
            return r.arange(s - 1, -1, -1).forEach(function(f) {
              r.sliceAssign(
                l,
                { row: f },
                r.divide(r.slice(l, { row: f }), o[f][f])
              ), r.sliceAssign(
                o,
                { row: f },
                r.divide(r.slice(o, { row: f }), o[f][f])
              ), r.arange(f).forEach(function(v) {
                var d = r.multiply(o[v][f], -1), g = r.slice(o, { row: v }), E = r.multiply(r.slice(o, { row: f }), d);
                r.sliceAssign(o, { row: v }, r.add(g, E));
                var A = r.slice(l, { row: v }), m = r.multiply(r.slice(l, { row: f }), d);
                r.sliceAssign(l, { row: v }, r.add(A, m));
              });
            }), l;
          }
          function u(o, s) {
            var l = !1;
            s[0].length === void 0 && (s = s.map(function(R) {
              return [R];
            }), l = !0);
            var f = r.QR(o), v = f[0], d = f[1], g = o[0].length, E = r.slice(v, { col: { end: g } }), A = r.slice(d, { row: { end: g } }), m = p(A), N = r.transpose(E);
            N[0].length === void 0 && (N = [N]);
            var y = r.multiply(r.multiply(m, N), s);
            return y.length === void 0 && (y = [[y]]), l ? y.map(function(R) {
              return R[0];
            }) : y;
          }
          return u;
        }(),
        jacobi: function(u) {
          for (var o = 1, s = u.length, l = r.identity(s, s), f = [], v, d, g, E, A, m, N, y; o === 1; ) {
            for (m = u[0][1], E = 0, A = 1, d = 0; d < s; d++)
              for (g = 0; g < s; g++)
                d != g && m < i.abs(u[d][g]) && (m = i.abs(u[d][g]), E = d, A = g);
            for (u[E][E] === u[A][A] ? N = u[E][A] > 0 ? i.PI / 4 : -i.PI / 4 : N = i.atan(2 * u[E][A] / (u[E][E] - u[A][A])) / 2, y = r.identity(s, s), y[E][E] = i.cos(N), y[E][A] = -i.sin(N), y[A][E] = i.sin(N), y[A][A] = i.cos(N), l = r.multiply(l, y), v = r.multiply(r.multiply(r.inv(y), u), y), u = v, o = 0, d = 1; d < s; d++)
              for (g = 1; g < s; g++)
                d != g && i.abs(u[d][g]) > 1e-3 && (o = 1);
          }
          for (d = 0; d < s; d++)
            f.push(u[d][d]);
          return [l, f];
        },
        rungekutta: function(u, o, s, l, f, v) {
          var d, g, E, A, m;
          if (v === 2)
            for (; l <= s; )
              d = o * u(l, f), g = o * u(l + o, f + d), E = f + (d + g) / 2, f = E, l = l + o;
          if (v === 4)
            for (; l <= s; )
              d = o * u(l, f), g = o * u(l + o / 2, f + d / 2), A = o * u(l + o / 2, f + g / 2), m = o * u(l + o, f + A), E = f + (d + 2 * g + 2 * A + m) / 6, f = E, l = l + o;
          return f;
        },
        romberg: function(u, o, s, l) {
          for (var f = 0, v = (s - o) / 2, d = [], g = [], E = [], A, m, N, y, R; f < l / 2; ) {
            for (R = u(o), N = o, y = 0; N <= s; N = N + v, y++)
              d[y] = N;
            for (A = d.length, N = 1; N < A - 1; N++)
              R += (N % 2 !== 0 ? 4 : 2) * u(d[N]);
            R = v / 3 * (R + u(s)), E[f] = R, v /= 2, f++;
          }
          for (m = E.length, A = 1; m !== 1; ) {
            for (N = 0; N < m - 1; N++)
              g[N] = (i.pow(4, A) * E[N + 1] - E[N]) / (i.pow(4, A) - 1);
            m = g.length, E = g, g = [], A++;
          }
          return E;
        },
        richardson: function(u, o, s, l) {
          function f(T, w) {
            for (var C = 0, M = T.length, _; C < M; C++)
              T[C] === w && (_ = C);
            return _;
          }
          for (var v = i.abs(s - u[f(u, s) + 1]), d = 0, g = [], E = [], A, m, N, y, R; l >= v; )
            A = f(u, s + l), m = f(u, s), g[d] = (o[A] - 2 * o[m] + o[2 * m - A]) / (l * l), l /= 2, d++;
          for (y = g.length, N = 1; y != 1; ) {
            for (R = 0; R < y - 1; R++)
              E[R] = (i.pow(4, N) * g[R + 1] - g[R]) / (i.pow(4, N) - 1);
            y = E.length, g = E, E = [], N++;
          }
          return g;
        },
        simpson: function(u, o, s, l) {
          for (var f = (s - o) / l, v = u(o), d = [], g = o, E = 0, A = 1, m; g <= s; g = g + f, E++)
            d[E] = g;
          for (m = d.length; A < m - 1; A++)
            v += (A % 2 !== 0 ? 4 : 2) * u(d[A]);
          return f / 3 * (v + u(s));
        },
        hermite: function(u, o, s, l) {
          for (var f = u.length, v = 0, d = 0, g = [], E = [], A = [], m = [], N; d < f; d++) {
            for (g[d] = 1, N = 0; N < f; N++)
              d != N && (g[d] *= (l - u[N]) / (u[d] - u[N]));
            for (E[d] = 0, N = 0; N < f; N++)
              d != N && (E[d] += 1 / (u[d] - u[N]));
            A[d] = (1 - 2 * (l - u[d]) * E[d]) * (g[d] * g[d]), m[d] = (l - u[d]) * (g[d] * g[d]), v += A[d] * o[d] + m[d] * s[d];
          }
          return v;
        },
        lagrange: function(u, o, s) {
          for (var l = 0, f = 0, v, d, g = u.length; f < g; f++) {
            for (d = o[f], v = 0; v < g; v++)
              f != v && (d *= (s - u[v]) / (u[f] - u[v]));
            l += d;
          }
          return l;
        },
        cubic_spline: function(u, o, s) {
          for (var l = u.length, f = 0, v, d = [], g = [], E = [], A = [], m = [], N = [], y = []; f < l - 1; f++)
            m[f] = u[f + 1] - u[f];
          for (E[0] = 0, f = 1; f < l - 1; f++)
            E[f] = 3 / m[f] * (o[f + 1] - o[f]) - 3 / m[f - 1] * (o[f] - o[f - 1]);
          for (f = 1; f < l - 1; f++)
            d[f] = [], g[f] = [], d[f][f - 1] = m[f - 1], d[f][f] = 2 * (m[f - 1] + m[f]), d[f][f + 1] = m[f], g[f][0] = E[f];
          for (A = r.multiply(r.inv(d), g), v = 0; v < l - 1; v++)
            N[v] = (o[v + 1] - o[v]) / m[v] - m[v] * (A[v + 1][0] + 2 * A[v][0]) / 3, y[v] = (A[v + 1][0] - A[v][0]) / (3 * m[v]);
          for (v = 0; v < l && !(u[v] > s); v++)
            ;
          return v -= 1, o[v] + (s - u[v]) * N[v] + r.sq(s - u[v]) * A[v] + (s - u[v]) * r.sq(s - u[v]) * y[v];
        },
        gauss_quadrature: function() {
          throw new Error("gauss_quadrature not yet implemented");
        },
        PCA: function(u) {
          var o = u.length, s = u[0].length, l = 0, f, v, d = [], g = [], E = [], A = [], m = [], N = [], y = [], R = [], T = [], w = [];
          for (l = 0; l < o; l++)
            d[l] = r.sum(u[l]) / s;
          for (l = 0; l < s; l++)
            for (y[l] = [], f = 0; f < o; f++)
              y[l][f] = u[f][l] - d[f];
          for (y = r.transpose(y), l = 0; l < o; l++)
            for (R[l] = [], f = 0; f < o; f++)
              R[l][f] = r.dot([y[l]], [y[f]]) / (s - 1);
          for (E = r.jacobi(R), T = E[0], g = E[1], w = r.transpose(T), l = 0; l < g.length; l++)
            for (f = l; f < g.length; f++)
              g[l] < g[f] && (v = g[l], g[l] = g[f], g[f] = v, A = w[l], w[l] = w[f], w[f] = A);
          for (N = r.transpose(y), l = 0; l < o; l++)
            for (m[l] = [], f = 0; f < N.length; f++)
              m[l][f] = r.dot([w[l]], [N[f]]);
          return [u, g, w, m];
        }
      }), function(p) {
        for (var u = 0; u < p.length; u++)
          (function(o) {
            r.fn[o] = function(s, l) {
              var f = this;
              return l ? (setTimeout(function() {
                l.call(f, r.fn[o].call(f, s));
              }, 15), this) : typeof r[o](this, s) == "number" ? r[o](this, s) : r(r[o](this, s));
            };
          })(p[u]);
      }("add divide multiply subtract dot pow exp log abs norm angle".split(" "));
    }(n, Math), function(r, i) {
      var a = [].slice, c = r.utils.isNumber, h = r.utils.isArray;
      r.extend({
        // 2 different parameter lists:
        // (value, mean, sd)
        // (value, array, flag)
        zscore: function() {
          var o = a.call(arguments);
          return c(o[1]) ? (o[0] - o[1]) / o[2] : (o[0] - r.mean(o[1])) / r.stdev(o[1], o[2]);
        },
        // 3 different paramter lists:
        // (value, mean, sd, sides)
        // (zscore, sides)
        // (value, array, sides, flag)
        ztest: function() {
          var o = a.call(arguments), s;
          return h(o[1]) ? (s = r.zscore(o[0], o[1], o[3]), o[2] === 1 ? r.normal.cdf(-i.abs(s), 0, 1) : r.normal.cdf(-i.abs(s), 0, 1) * 2) : o.length > 2 ? (s = r.zscore(o[0], o[1], o[2]), o[3] === 1 ? r.normal.cdf(-i.abs(s), 0, 1) : r.normal.cdf(-i.abs(s), 0, 1) * 2) : (s = o[0], o[1] === 1 ? r.normal.cdf(-i.abs(s), 0, 1) : r.normal.cdf(-i.abs(s), 0, 1) * 2);
        }
      }), r.extend(r.fn, {
        zscore: function(o, s) {
          return (o - this.mean()) / this.stdev(s);
        },
        ztest: function(o, s, l) {
          var f = i.abs(this.zscore(o, l));
          return s === 1 ? r.normal.cdf(-f, 0, 1) : r.normal.cdf(-f, 0, 1) * 2;
        }
      }), r.extend({
        // 2 parameter lists
        // (value, mean, sd, n)
        // (value, array)
        tscore: function() {
          var o = a.call(arguments);
          return o.length === 4 ? (o[0] - o[1]) / (o[2] / i.sqrt(o[3])) : (o[0] - r.mean(o[1])) / (r.stdev(o[1], !0) / i.sqrt(o[1].length));
        },
        // 3 different paramter lists:
        // (value, mean, sd, n, sides)
        // (tscore, n, sides)
        // (value, array, sides)
        ttest: function() {
          var o = a.call(arguments), s;
          return o.length === 5 ? (s = i.abs(r.tscore(o[0], o[1], o[2], o[3])), o[4] === 1 ? r.studentt.cdf(-s, o[3] - 1) : r.studentt.cdf(-s, o[3] - 1) * 2) : c(o[1]) ? (s = i.abs(o[0]), o[2] == 1 ? r.studentt.cdf(-s, o[1] - 1) : r.studentt.cdf(-s, o[1] - 1) * 2) : (s = i.abs(r.tscore(o[0], o[1])), o[2] == 1 ? r.studentt.cdf(-s, o[1].length - 1) : r.studentt.cdf(-s, o[1].length - 1) * 2);
        }
      }), r.extend(r.fn, {
        tscore: function(o) {
          return (o - this.mean()) / (this.stdev(!0) / i.sqrt(this.cols()));
        },
        ttest: function(o, s) {
          return s === 1 ? 1 - r.studentt.cdf(i.abs(this.tscore(o)), this.cols() - 1) : r.studentt.cdf(-i.abs(this.tscore(o)), this.cols() - 1) * 2;
        }
      }), r.extend({
        // Paramter list is as follows:
        // (array1, array2, array3, ...)
        // or it is an array of arrays
        // array of arrays conversion
        anovafscore: function() {
          var o = a.call(arguments), s, l, f, v, d, g, E, A;
          if (o.length === 1) {
            for (d = new Array(o[0].length), E = 0; E < o[0].length; E++)
              d[E] = o[0][E];
            o = d;
          }
          for (l = new Array(), E = 0; E < o.length; E++)
            l = l.concat(o[E]);
          for (f = r.mean(l), s = 0, E = 0; E < o.length; E++)
            s = s + o[E].length * i.pow(r.mean(o[E]) - f, 2);
          for (s /= o.length - 1, g = 0, E = 0; E < o.length; E++)
            for (v = r.mean(o[E]), A = 0; A < o[E].length; A++)
              g += i.pow(o[E][A] - v, 2);
          return g /= l.length - o.length, s / g;
        },
        // 2 different paramter setups
        // (array1, array2, array3, ...)
        // (anovafscore, df1, df2)
        anovaftest: function() {
          var o = a.call(arguments), s, l, f, v;
          if (c(o[0]))
            return 1 - r.centralF.cdf(o[0], o[1], o[2]);
          var d = r.anovafscore(o);
          for (s = o.length - 1, f = 0, v = 0; v < o.length; v++)
            f = f + o[v].length;
          return l = f - s - 1, 1 - r.centralF.cdf(d, s, l);
        },
        ftest: function(o, s, l) {
          return 1 - r.centralF.cdf(o, s, l);
        }
      }), r.extend(r.fn, {
        anovafscore: function() {
          return r.anovafscore(this.toArray());
        },
        anovaftes: function() {
          var o = 0, s;
          for (s = 0; s < this.length; s++)
            o = o + this[s].length;
          return r.ftest(this.anovafscore(), this.length - 1, o - this.length);
        }
      }), r.extend({
        // 2 parameter lists
        // (mean1, mean2, n1, n2, sd)
        // (array1, array2, sd)
        qscore: function() {
          var o = a.call(arguments), s, l, f, v, d;
          return c(o[0]) ? (s = o[0], l = o[1], f = o[2], v = o[3], d = o[4]) : (s = r.mean(o[0]), l = r.mean(o[1]), f = o[0].length, v = o[1].length, d = o[2]), i.abs(s - l) / (d * i.sqrt((1 / f + 1 / v) / 2));
        },
        // 3 different parameter lists:
        // (qscore, n, k)
        // (mean1, mean2, n1, n2, sd, n, k)
        // (array1, array2, sd, n, k)
        qtest: function() {
          var o = a.call(arguments), s;
          o.length === 3 ? (s = o[0], o = o.slice(1)) : o.length === 7 ? (s = r.qscore(o[0], o[1], o[2], o[3], o[4]), o = o.slice(5)) : (s = r.qscore(o[0], o[1], o[2]), o = o.slice(3));
          var l = o[0], f = o[1];
          return 1 - r.tukey.cdf(s, f, l - f);
        },
        tukeyhsd: function(o) {
          for (var s = r.pooledstdev(o), l = o.map(function(A) {
            return r.mean(A);
          }), f = o.reduce(function(A, m) {
            return A + m.length;
          }, 0), v = [], d = 0; d < o.length; ++d)
            for (var g = d + 1; g < o.length; ++g) {
              var E = r.qtest(l[d], l[g], o[d].length, o[g].length, s, f, o.length);
              v.push([[d, g], E]);
            }
          return v;
        }
      }), r.extend({
        // 2 different parameter setups
        // (value, alpha, sd, n)
        // (value, alpha, array)
        normalci: function() {
          var o = a.call(arguments), s = new Array(2), l;
          return o.length === 4 ? l = i.abs(r.normal.inv(o[1] / 2, 0, 1) * o[2] / i.sqrt(o[3])) : l = i.abs(r.normal.inv(o[1] / 2, 0, 1) * r.stdev(o[2]) / i.sqrt(o[2].length)), s[0] = o[0] - l, s[1] = o[0] + l, s;
        },
        // 2 different parameter setups
        // (value, alpha, sd, n)
        // (value, alpha, array)
        tci: function() {
          var o = a.call(arguments), s = new Array(2), l;
          return o.length === 4 ? l = i.abs(r.studentt.inv(o[1] / 2, o[3] - 1) * o[2] / i.sqrt(o[3])) : l = i.abs(r.studentt.inv(o[1] / 2, o[2].length - 1) * r.stdev(o[2], !0) / i.sqrt(o[2].length)), s[0] = o[0] - l, s[1] = o[0] + l, s;
        },
        significant: function(o, s) {
          return o < s;
        }
      }), r.extend(r.fn, {
        normalci: function(o, s) {
          return r.normalci(o, s, this.toArray());
        },
        tci: function(o, s) {
          return r.tci(o, s, this.toArray());
        }
      });
      function p(u, o, s, l) {
        if (u > 1 || s > 1 || u <= 0 || s <= 0)
          throw new Error("Proportions should be greater than 0 and less than 1");
        var f = (u * o + s * l) / (o + l), v = i.sqrt(f * (1 - f) * (1 / o + 1 / l));
        return (u - s) / v;
      }
      r.extend(r.fn, {
        oneSidedDifferenceOfProportions: function(o, s, l, f) {
          var v = p(o, s, l, f);
          return r.ztest(v, 1);
        },
        twoSidedDifferenceOfProportions: function(o, s, l, f) {
          var v = p(o, s, l, f);
          return r.ztest(v, 2);
        }
      });
    }(n, Math), n.models = function() {
      function r(p) {
        var u = p[0].length, o = n.arange(u).map(function(s) {
          var l = n.arange(u).filter(function(f) {
            return f !== s;
          });
          return i(
            n.col(p, s).map(function(f) {
              return f[0];
            }),
            n.col(p, l)
          );
        });
        return o;
      }
      function i(p, u) {
        var o = p.length, s = u[0].length - 1, l = o - s - 1, f = n.lstsq(u, p), v = n.multiply(u, f.map(function(y) {
          return [y];
        })).map(function(y) {
          return y[0];
        }), d = n.subtract(p, v), g = n.mean(p), E = n.sum(v.map(function(y) {
          return Math.pow(y - g, 2);
        })), A = n.sum(p.map(function(y, R) {
          return Math.pow(y - v[R], 2);
        })), m = E + A, N = E / m;
        return {
          exog: u,
          endog: p,
          nobs: o,
          df_model: s,
          df_resid: l,
          coef: f,
          predict: v,
          resid: d,
          ybar: g,
          SST: m,
          SSE: E,
          SSR: A,
          R2: N
        };
      }
      function a(p) {
        var u = r(p.exog), o = Math.sqrt(p.SSR / p.df_resid), s = u.map(function(g) {
          var E = g.SST, A = g.R2;
          return o / Math.sqrt(E * (1 - A));
        }), l = p.coef.map(function(g, E) {
          return (g - 0) / s[E];
        }), f = l.map(function(g) {
          var E = n.studentt.cdf(g, p.df_resid);
          return (E > 0.5 ? 1 - E : E) * 2;
        }), v = n.studentt.inv(0.975, p.df_resid), d = p.coef.map(function(g, E) {
          var A = v * s[E];
          return [g - A, g + A];
        });
        return {
          se: s,
          t: l,
          p: f,
          sigmaHat: o,
          interval95: d
        };
      }
      function c(p) {
        var u = p.R2 / p.df_model / ((1 - p.R2) / p.df_resid), o = function(l, f, v) {
          return n.beta.cdf(l / (v / f + l), f / 2, v / 2);
        }, s = 1 - o(u, p.df_model, p.df_resid);
        return { F_statistic: u, pvalue: s };
      }
      function h(p, u) {
        var o = i(p, u), s = a(o), l = c(o), f = 1 - (1 - o.R2) * ((o.nobs - 1) / o.df_resid);
        return o.t = s, o.f = l, o.adjust_R2 = f, o;
      }
      return { ols: h };
    }(), n.extend({
      buildxmatrix: function() {
        for (var i = new Array(arguments.length), a = 0; a < arguments.length; a++) {
          var c = [1];
          i[a] = c.concat(arguments[a]);
        }
        return n(i);
      },
      builddxmatrix: function() {
        for (var i = new Array(arguments[0].length), a = 0; a < arguments[0].length; a++) {
          var c = [1];
          i[a] = c.concat(arguments[0][a]);
        }
        return n(i);
      },
      buildjxmatrix: function(i) {
        for (var a = new Array(i.length), c = 0; c < i.length; c++)
          a[c] = i[c];
        return n.builddxmatrix(a);
      },
      buildymatrix: function(i) {
        return n(i).transpose();
      },
      buildjymatrix: function(i) {
        return i.transpose();
      },
      matrixmult: function(i, a) {
        var c, h, p, u, o;
        if (i.cols() == a.rows()) {
          if (a.rows() > 1) {
            for (u = [], c = 0; c < i.rows(); c++)
              for (u[c] = [], h = 0; h < a.cols(); h++) {
                for (o = 0, p = 0; p < i.cols(); p++)
                  o += i.toArray()[c][p] * a.toArray()[p][h];
                u[c][h] = o;
              }
            return n(u);
          }
          for (u = [], c = 0; c < i.rows(); c++)
            for (u[c] = [], h = 0; h < a.cols(); h++) {
              for (o = 0, p = 0; p < i.cols(); p++)
                o += i.toArray()[c][p] * a.toArray()[h];
              u[c][h] = o;
            }
          return n(u);
        }
      },
      //regress and regresst to be fixed
      regress: function(i, a) {
        var c = n.xtranspxinv(i), h = i.transpose(), p = n.matrixmult(n(c), h);
        return n.matrixmult(p, a);
      },
      regresst: function(i, a, c) {
        var h = n.regress(i, a), p = {};
        p.anova = {};
        var u = n.jMatYBar(i, h);
        p.yBar = u;
        var o = a.mean();
        p.anova.residuals = n.residuals(a, u), p.anova.ssr = n.ssr(u, o), p.anova.msr = p.anova.ssr / (i[0].length - 1), p.anova.sse = n.sse(a, u), p.anova.mse = p.anova.sse / (a.length - (i[0].length - 1) - 1), p.anova.sst = n.sst(a, o), p.anova.mst = p.anova.sst / (a.length - 1), p.anova.r2 = 1 - p.anova.sse / p.anova.sst, p.anova.r2 < 0 && (p.anova.r2 = 0), p.anova.fratio = p.anova.msr / p.anova.mse, p.anova.pvalue = n.anovaftest(
          p.anova.fratio,
          i[0].length - 1,
          a.length - (i[0].length - 1) - 1
        ), p.anova.rmse = Math.sqrt(p.anova.mse), p.anova.r2adj = 1 - p.anova.mse / p.anova.mst, p.anova.r2adj < 0 && (p.anova.r2adj = 0), p.stats = new Array(i[0].length);
        for (var s = n.xtranspxinv(i), l, f, v, d = 0; d < h.length; d++)
          l = Math.sqrt(p.anova.mse * Math.abs(s[d][d])), f = Math.abs(h[d] / l), v = n.ttest(f, a.length - i[0].length - 1, c), p.stats[d] = [h[d], l, f, v];
        return p.regress = h, p;
      },
      xtranspx: function(i) {
        return n.matrixmult(i.transpose(), i);
      },
      xtranspxinv: function(i) {
        var a = n.matrixmult(i.transpose(), i), c = n.inv(a);
        return c;
      },
      jMatYBar: function(i, a) {
        var c = n.matrixmult(i, a);
        return new n(c);
      },
      residuals: function(i, a) {
        return n.matrixsubtract(i, a);
      },
      ssr: function(i, a) {
        for (var c = 0, h = 0; h < i.length; h++)
          c += Math.pow(i[h] - a, 2);
        return c;
      },
      sse: function(i, a) {
        for (var c = 0, h = 0; h < i.length; h++)
          c += Math.pow(i[h] - a[h], 2);
        return c;
      },
      sst: function(i, a) {
        for (var c = 0, h = 0; h < i.length; h++)
          c += Math.pow(i[h] - a, 2);
        return c;
      },
      matrixsubtract: function(i, a) {
        for (var c = new Array(i.length), h = 0; h < i.length; h++) {
          c[h] = new Array(i[h].length);
          for (var p = 0; p < i[h].length; p++)
            c[h][p] = i[h][p] - a[h][p];
        }
        return n(c);
      }
    }), n.jStat = n, n;
  });
})(Fo);
var bo = Fo.exports;
const D = he(), Ye = Po, { FormulaHelpers: Ga, Types: H } = ge(), b = Ga, dn = Bo, di = bo, $a = 536870911, Ha = -536870912, dr = 511, vn = -512, Wa = /^\s?[+-]?\s?[0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?\s?$/, qa = /^\s?([+-]?\s?([0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?)?)\s?[ij]\s?$/, Ya = /^\s?([+-]?\s?[0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?)\s?([+-]?\s?([0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?)?)\s?[ij]\s?$/;
function re(t) {
  t = b.accept(t);
  let e = 0, n = 0, r = "i";
  if (typeof t == "number")
    return { real: t, im: n, unit: r };
  if (typeof t == "boolean")
    throw D.VALUE;
  let i = t.match(Wa);
  if (i)
    return e = Number(i[0]), { real: e, im: n, unit: r };
  if (i = t.match(qa), i)
    return n = Number(/^\s?[+-]?\s?$/.test(i[1]) ? i[1] + "1" : i[1]), r = i[0].slice(-1), { real: e, im: n, unit: r };
  if (i = t.match(Ya), i)
    return e = Number(i[1]), n = Number(/^\s?[+-]?\s?$/.test(i[3]) ? i[3] + "1" : i[3]), r = i[0].slice(-1), { real: e, im: n, unit: r };
  throw D.NUM;
}
const K = {
  BESSELI: (t, e) => {
    if (t = b.accept(t, H.NUMBER_NO_BOOLEAN), e = b.accept(e, H.NUMBER_NO_BOOLEAN), e = Math.trunc(e), e < 0)
      throw D.NUM;
    return dn.besseli(t, e);
  },
  BESSELJ: (t, e) => {
    if (t = b.accept(t, H.NUMBER_NO_BOOLEAN), e = b.accept(e, H.NUMBER_NO_BOOLEAN), e = Math.trunc(e), e < 0)
      throw D.NUM;
    return dn.besselj(t, e);
  },
  BESSELK: (t, e) => {
    if (t = b.accept(t, H.NUMBER_NO_BOOLEAN), e = b.accept(e, H.NUMBER_NO_BOOLEAN), e = Math.trunc(e), e < 0)
      throw D.NUM;
    return dn.besselk(t, e);
  },
  BESSELY: (t, e) => {
    if (t = b.accept(t, H.NUMBER_NO_BOOLEAN), e = b.accept(e, H.NUMBER_NO_BOOLEAN), e = Math.trunc(e), e < 0)
      throw D.NUM;
    return dn.bessely(t, e);
  },
  BIN2DEC: (t) => {
    t = b.accept(t, H.NUMBER_NO_BOOLEAN);
    let e = t.toString();
    if (e.length > 10)
      throw D.NUM;
    return e.length === 10 && e.substring(0, 1) === "1" ? parseInt(e.substring(1), 2) + vn : parseInt(e, 2);
  },
  BIN2HEX: (t, e) => {
    t = b.accept(t, H.NUMBER_NO_BOOLEAN), e = b.accept(e, H.NUMBER_NO_BOOLEAN, null);
    const n = t.toString();
    if (n.length > 10)
      throw D.NUM;
    if (n.length === 10 && n.substring(0, 1) === "1")
      return (parseInt(n.substring(1), 2) + 1099511627264).toString(16).toUpperCase();
    const r = parseInt(t, 2).toString(16);
    if (e == null)
      return r.toUpperCase();
    if (e < 0)
      throw D.NUM;
    if (e = Math.trunc(e), e >= r.length)
      return (Ye.REPT("0", e - r.length) + r).toUpperCase();
    throw D.NUM;
  },
  BIN2OCT: (t, e) => {
    t = b.accept(t, H.NUMBER_NO_BOOLEAN), e = b.accept(e, H.NUMBER, null);
    let n = t.toString();
    if (n.length > 10)
      throw D.NUM;
    if (n.length === 10 && n.substr(0, 1) === "1")
      return (parseInt(n.substr(1), 2) + 1073741312).toString(8);
    let r = parseInt(t, 2).toString(8);
    if (e == null)
      return r.toUpperCase();
    if (e < 0)
      throw D.NUM;
    if (e = Math.trunc(e), e >= r.length)
      return Ye.REPT("0", e - r.length) + r;
    throw D.NUM;
  },
  BITAND: (t, e) => {
    if (t = b.accept(t, H.NUMBER), e = b.accept(e, H.NUMBER), t < 0 || e < 0 || Math.floor(t) !== t || Math.floor(e) !== e || t > 281474976710655 || e > 281474976710655)
      throw D.NUM;
    return t & e;
  },
  BITLSHIFT: (t, e) => {
    if (t = b.accept(t, H.NUMBER), e = b.accept(e, H.NUMBER), e = Math.trunc(e), Math.abs(e) > 53 || t < 0 || Math.floor(t) !== t || t > 281474976710655)
      throw D.NUM;
    const n = e >= 0 ? t * 2 ** e : Math.trunc(t / 2 ** -e);
    if (n > 281474976710655)
      throw D.NUM;
    return n;
  },
  BITOR: (t, e) => {
    if (t = b.accept(t, H.NUMBER), e = b.accept(e, H.NUMBER), t < 0 || e < 0 || Math.floor(t) !== t || Math.floor(e) !== e || t > 281474976710655 || e > 281474976710655)
      throw D.NUM;
    return t | e;
  },
  BITRSHIFT: (t, e) => (t = b.accept(t, H.NUMBER), e = b.accept(e, H.NUMBER), K.BITLSHIFT(t, -e)),
  BITXOR: (t, e) => {
    if (t = b.accept(t, H.NUMBER), e = b.accept(e, H.NUMBER), t < 0 || t > 281474976710655 || Math.floor(t) !== t || e < 0 || e > 281474976710655 || Math.floor(e) !== e)
      throw D.NUM;
    return t ^ e;
  },
  COMPLEX: (t, e, n) => {
    if (t = b.accept(t, H.NUMBER_NO_BOOLEAN), e = b.accept(e, H.NUMBER_NO_BOOLEAN), n = b.accept(n, H.STRING, "i"), n !== "i" && n !== "j")
      throw D.VALUE;
    if (t === 0 && e === 0)
      return 0;
    if (t === 0)
      return e === 1 ? n : e === -1 ? "-" + n : e.toString() + n;
    if (e === 0)
      return t.toString();
    {
      let r = e > 0 ? "+" : "";
      return e === 1 ? t.toString() + r + n : e === -1 ? t.toString() + r + "-" + n : t.toString() + r + e.toString() + n;
    }
  },
  DEC2BIN: (t, e) => {
    if (t = b.accept(t, H.NUMBER), e = b.accept(e, H.NUMBER, null), t < vn || t > dr)
      throw D.NUM;
    if (t < 0)
      return "1" + Ye.REPT("0", 9 - (512 + t).toString(2).length) + (512 + t).toString(2);
    let n = parseInt(t, 10).toString(2);
    if (e == null)
      return n;
    if (e = Math.trunc(e), e <= 0 || e < n.length)
      throw D.NUM;
    return Ye.REPT("0", e - n.length) + n;
  },
  DEC2HEX: (t, e) => {
    if (t = b.accept(t, H.NUMBER), e = b.accept(e, H.NUMBER, null), t < -549755813888 || t > 549755813888)
      throw D.NUM;
    if (t < 0)
      return (1099511627776 + t).toString(16).toUpperCase();
    let n = parseInt(t, 10).toString(16);
    if (e == null)
      return n.toUpperCase();
    if (e = Math.trunc(e), e <= 0 || e < n.length)
      throw D.NUM;
    return Ye.REPT("0", e - n.length) + n.toUpperCase();
  },
  DEC2OCT: (t, e) => {
    if (t = b.accept(t, H.NUMBER), e = b.accept(e, H.NUMBER, null), t < -536870912 || t > 536870912)
      throw D.NUM;
    if (t < 0)
      return (t + 1073741824).toString(8);
    let n = parseInt(t, 10).toString(8);
    if (e == null)
      return n.toUpperCase();
    if (e = Math.trunc(e), e <= 0 || e < n.length)
      throw D.NUM;
    return Ye.REPT("0", e - n.length) + n;
  },
  DELTA: (t, e) => (t = b.accept(t, H.NUMBER_NO_BOOLEAN), e = b.accept(e, H.NUMBER_NO_BOOLEAN, 0), t === e ? 1 : 0),
  ERF: (t, e) => (t = b.accept(t, H.NUMBER_NO_BOOLEAN), e = b.accept(e, H.NUMBER_NO_BOOLEAN, 0), di.erf(t)),
  ERFC: (t) => (t = b.accept(t, H.NUMBER_NO_BOOLEAN), di.erfc(t)),
  GESTEP: (t, e) => (t = b.accept(t, H.NUMBER_NO_BOOLEAN), e = b.accept(e, H.NUMBER_NO_BOOLEAN, 0), t >= e ? 1 : 0),
  HEX2BIN: (t, e) => {
    if (t = b.accept(t, H.STRING), e = b.accept(e, H.NUMBER, null), t.length > 10 || !/^[0-9a-fA-F]*$/.test(t))
      throw D.NUM;
    let n = t.length === 10 && t.substr(0, 1).toLowerCase() === "f", r = n ? parseInt(t, 16) - 1099511627776 : parseInt(t, 16);
    if (r < vn || r > dr)
      throw D.NUM;
    if (n)
      return "1" + Ye.REPT("0", 9 - (r + 512).toString(2).length) + (r + 512).toString(2);
    let i = r.toString(2);
    if (e == null)
      return i;
    if (e = Math.trunc(e), e <= 0 || e < i.length)
      throw D.NUM;
    return Ye.REPT("0", e - i.length) + i;
  },
  HEX2DEC: (t) => {
    if (t = b.accept(t, H.STRING), t.length > 10 || !/^[0-9a-fA-F]*$/.test(t))
      throw D.NUM;
    let e = parseInt(t, 16);
    return e >= 549755813888 ? e - 1099511627776 : e;
  },
  HEX2OCT: (t, e) => {
    if (t = b.accept(t, H.STRING), t.length > 10 || !/^[0-9a-fA-F]*$/.test(t))
      throw D.NUM;
    let n = K.HEX2DEC(t);
    if (n > $a || n < Ha)
      throw D.NUM;
    return K.DEC2OCT(n, e);
  },
  IMABS: (t) => {
    const { real: e, im: n } = re(t);
    return Math.sqrt(Math.pow(e, 2) + Math.pow(n, 2));
  },
  IMAGINARY: (t) => re(t).im,
  IMARGUMENT: (t) => {
    const { real: e, im: n } = re(t);
    if (e === 0 && n === 0)
      throw D.DIV0;
    return e === 0 && n > 0 ? Math.PI / 2 : e === 0 && n < 0 ? -Math.PI / 2 : e < 0 && n === 0 ? Math.PI : e > 0 && n === 0 ? 0 : e > 0 ? Math.atan(n / e) : e < 0 && n > 0 ? Math.atan(n / e) + Math.PI : Math.atan(n / e) - Math.PI;
  },
  IMCONJUGATE: (t) => {
    const { real: e, im: n, unit: r } = re(t);
    return n !== 0 ? K.COMPLEX(e, -n, r) : "" + e;
  },
  IMCOS: (t) => {
    const { real: e, im: n, unit: r } = re(t);
    let i = Math.cos(e) * (Math.exp(n) + Math.exp(-n)) / 2, a = -Math.sin(e) * (Math.exp(n) - Math.exp(-n)) / 2;
    return K.COMPLEX(i, a, r);
  },
  IMCOSH: (t) => {
    const { real: e, im: n, unit: r } = re(t);
    let i = Math.cos(n) * (Math.exp(e) + Math.exp(-e)) / 2, a = -Math.sin(n) * (Math.exp(e) - Math.exp(-e)) / 2;
    return K.COMPLEX(i, -a, r);
  },
  IMCOT: (t) => {
    t = b.accept(t);
    let e = K.IMCOS(t), n = K.IMSIN(t);
    return K.IMDIV(e, n);
  },
  IMCSC: (t) => (t = b.accept(t), K.IMDIV("1", K.IMSIN(t))),
  IMCSCH: (t) => (t = b.accept(t), K.IMDIV("1", K.IMSINH(t))),
  IMDIV: (t, e) => {
    const n = re(t), r = n.real, i = n.im, a = n.unit, c = re(e), h = c.real, p = c.im, u = c.unit;
    if (h === 0 && p === 0 || a !== u)
      throw D.NUM;
    let o = a, s = Math.pow(h, 2) + Math.pow(p, 2);
    return K.COMPLEX((r * h + i * p) / s, (i * h - r * p) / s, o);
  },
  IMEXP: (t) => {
    const { real: e, im: n, unit: r } = re(t);
    let i = Math.exp(e);
    return K.COMPLEX(i * Math.cos(n), i * Math.sin(n), r);
  },
  IMLN: (t) => {
    const { real: e, im: n, unit: r } = re(t);
    return K.COMPLEX(
      Math.log(Math.sqrt(Math.pow(e, 2) + Math.pow(n, 2))),
      Math.atan(n / e),
      r
    );
  },
  IMLOG10: (t) => {
    const { real: e, im: n, unit: r } = re(t);
    let i = Math.log(Math.sqrt(Math.pow(e, 2) + Math.pow(n, 2))) / Math.log(10), a = Math.atan(n / e) / Math.log(10);
    return K.COMPLEX(i, a, r);
  },
  IMLOG2: (t) => {
    const { real: e, im: n, unit: r } = re(t);
    let i = Math.log(Math.sqrt(Math.pow(e, 2) + Math.pow(n, 2))) / Math.log(2), a = Math.atan(n / e) / Math.log(2);
    return K.COMPLEX(i, a, r);
  },
  IMPOWER: (t, e) => {
    let { unit: n } = re(t);
    e = b.accept(e, H.NUMBER_NO_BOOLEAN);
    let r = Math.pow(K.IMABS(t), e), i = K.IMARGUMENT(t), a = r * Math.cos(e * i), c = r * Math.sin(e * i);
    return K.COMPLEX(a, c, n);
  },
  IMPRODUCT: (...t) => {
    let e, n = 0;
    return b.flattenParams(t, null, !1, (r) => {
      if (n === 0)
        e = b.accept(r), re(e);
      else {
        const i = re(e), a = i.real, c = i.im, h = i.unit, p = re(r), u = p.real, o = p.im, s = p.unit;
        if (h !== s)
          throw D.VALUE;
        e = K.COMPLEX(a * u - c * o, a * o + c * u);
      }
      n++;
    }, 1), e;
  },
  IMREAL: (t) => re(t).real,
  IMSEC: (t) => K.IMDIV("1", K.IMCOS(t)),
  IMSECH: (t) => K.IMDIV("1", K.IMCOSH(t)),
  IMSIN: (t) => {
    const { real: e, im: n, unit: r } = re(t);
    let i = Math.sin(e) * (Math.exp(n) + Math.exp(-n)) / 2, a = Math.cos(e) * (Math.exp(n) - Math.exp(-n)) / 2;
    return K.COMPLEX(i, a, r);
  },
  IMSINH: (t) => {
    const { real: e, im: n, unit: r } = re(t);
    let i = Math.cos(n) * (Math.exp(e) - Math.exp(-e)) / 2, a = Math.sin(n) * (Math.exp(e) + Math.exp(-e)) / 2;
    return K.COMPLEX(i, a, r);
  },
  IMSQRT: (t) => {
    const { unit: e } = re(t);
    let n = Math.sqrt(K.IMABS(t)), r = K.IMARGUMENT(t);
    return K.COMPLEX(n * Math.cos(r / 2), n * Math.sin(r / 2), e);
  },
  IMSUB: (t, e) => {
    const n = re(t), r = n.real, i = n.im, a = n.unit, c = re(e), h = c.real, p = c.im, u = c.unit;
    if (a !== u)
      throw D.VALUE;
    return K.COMPLEX(r - h, i - p, a);
  },
  IMSUM: (...t) => {
    let e = 0, n = 0, r;
    return b.flattenParams(t, null, !1, (i) => {
      const { real: a, im: c, unit: h } = re(i);
      if (r || (r = h), r !== h)
        throw D.VALUE;
      e += a, n += c;
    }), K.COMPLEX(e, n, r);
  },
  IMTAN: (t) => {
    const { unit: e } = re(t);
    return K.IMDIV(K.IMSIN(t), K.IMCOS(t), e);
  },
  // FIXME: need to check the test cases
  OCT2BIN: (t, e) => {
    if (t = b.accept(t, H.STRING), e = b.accept(e, H.NUMBER, null), t.length > 10 || e > 10 || e !== null && e < 0)
      throw D.NUM;
    e = Math.trunc(e);
    let n = t.length === 10 && t.substring(0, 1) === "7", r = K.OCT2DEC(t);
    if (r < vn || r > dr)
      return D.NUM;
    if (n)
      return "1" + Ye.REPT("0", 9 - (512 + r).toString(2).length) + (512 + r).toString(2);
    let i = r.toString(2);
    if (e === 0)
      return i;
    if (e < i.length)
      throw D.NUM;
    return Ye.REPT("0", e - i.length) + i;
  },
  OCT2DEC: (t) => {
    if (t = b.accept(t, H.STRING), t.length > 10)
      throw D.NUM;
    for (const n of t)
      if (n < "0" || n > "7")
        throw D.NUM;
    let e = parseInt(t, 8);
    return e >= 536870912 ? e - 1073741824 : e;
  },
  OCT2HEX: (t, e) => {
    if (t = b.accept(t, H.STRING), e = b.accept(e, H.NUMBER_NO_BOOLEAN, null), t.length > 10)
      throw D.NUM;
    for (const i of t)
      if (i < "0" || i > "7")
        throw D.NUM;
    if (e = Math.trunc(e), e < 0 || e > 10)
      throw D.NUM;
    let n = K.OCT2DEC(t), r = K.DEC2HEX(n);
    if (e === 0)
      return r;
    if (e < r.length)
      throw D.NUM;
    return Ye.REPT("0", e - r.length) + r;
  }
};
var Ka = K;
const te = he(), { FormulaHelpers: za, Types: Oe, WildCard: gn, Address: Xa } = ge(), vi = Gn, X = za, Qa = {
  ADDRESS: (t, e, n, r, i) => {
    if (t = X.accept(t, Oe.NUMBER), e = X.accept(e, Oe.NUMBER), n = X.accept(n, Oe.NUMBER, 1), r = X.accept(r, Oe.BOOLEAN, !0), i = X.accept(i, Oe.STRING, ""), t < 1 || e < 1 || n < 1 || n > 4)
      throw te.VALUE;
    let a = "";
    return i.length > 0 && (/[^A-Za-z_.\d\u007F-\uFFFF]/.test(i) ? a += `'${i}'!` : a += i + "!"), r ? (a += n === 1 || n === 3 ? "$" : "", a += Xa.columnNumberToName(e), a += n === 1 || n === 2 ? "$" : "", a += t) : (a += "R", a += n === 4 || n === 3 ? `[${t}]` : t, a += "C", a += n === 4 || n === 2 ? `[${e}]` : e), a;
  },
  AREAS: (t) => (t = X.accept(t), t instanceof vi ? t.length : 1),
  CHOOSE: (t, ...e) => {
  },
  // Special
  COLUMN: (t, e) => {
    if (e == null) {
      if (t.position.col != null)
        return t.position.col;
      throw Error("FormulaParser.parse is called without position parameter.");
    } else {
      if (typeof e != "object" || Array.isArray(e))
        throw te.VALUE;
      if (X.isCellRef(e))
        return e.ref.col;
      if (X.isRangeRef(e))
        return e.ref.from.col;
      throw Error("ReferenceFunctions.COLUMN should not reach here.");
    }
  },
  // Special
  COLUMNS: (t, e) => {
    if (e == null)
      throw Error("COLUMNS requires one argument");
    if (typeof e != "object" || Array.isArray(e))
      throw te.VALUE;
    if (X.isCellRef(e))
      return 1;
    if (X.isRangeRef(e))
      return Math.abs(e.ref.from.col - e.ref.to.col) + 1;
    throw Error("ReferenceFunctions.COLUMNS should not reach here.");
  },
  HLOOKUP: (t, e, n, r) => {
    t = X.accept(t);
    try {
      e = X.accept(e, Oe.ARRAY, void 0, !1);
    } catch (a) {
      throw a instanceof te ? te.NA : a;
    }
    if (n = X.accept(n, Oe.NUMBER), r = X.accept(r, Oe.BOOLEAN, !0), n < 1)
      throw te.VALUE;
    if (e[n - 1] === void 0)
      throw te.REF;
    const i = typeof t;
    if (r) {
      let a = i === typeof e[0][0] ? e[0][0] : null;
      for (let c = 1; c < e[0].length; c++) {
        const h = e[0][c];
        if (typeof h === i) {
          if (a > t && h > t)
            throw te.NA;
          if (h === t)
            return e[n - 1][c];
          if (a != null && h > t && a <= t)
            return e[n - 1][c - 1];
          a = h;
        }
      }
      if (a == null)
        throw te.NA;
      return a;
    } else {
      let a = -1;
      if (gn.isWildCard(t) ? a = e[0].findIndex((c) => gn.toRegex(t, "i").test(c)) : a = e[0].findIndex((c) => c === t), a === -1)
        throw te.NA;
      return e[n - 1][a];
    }
  },
  // Special
  INDEX: (t, e, n, r, i) => {
    n = t.utils.extractRefValue(n), n = { value: n.val, isArray: n.isArray }, n = X.accept(n, Oe.NUMBER), n = Math.trunc(n), r == null ? r = 1 : (r = t.utils.extractRefValue(r), r = { value: r.val, isArray: r.isArray }, r = X.accept(r, Oe.NUMBER, 1), r = Math.trunc(r)), i == null ? i = 1 : (i = t.utils.extractRefValue(i), i = { value: i.val, isArray: i.isArray }, i = X.accept(i, Oe.NUMBER, 1), i = Math.trunc(i));
    let a = e;
    if (e instanceof vi)
      a = e.refs[i - 1];
    else if (i > 1)
      throw te.REF;
    if (n === 0 && r === 0)
      return a;
    if (n === 0) {
      if (X.isRangeRef(a)) {
        if (a.ref.to.col - a.ref.from.col < r - 1)
          throw te.REF;
        return a.ref.from.col += r - 1, a.ref.to.col = a.ref.from.col, a;
      } else if (Array.isArray(a)) {
        const c = [];
        return a.forEach((h) => c.push([h[r - 1]])), c;
      }
    }
    if (r === 0) {
      if (X.isRangeRef(a)) {
        if (a.ref.to.row - a.ref.from.row < n - 1)
          throw te.REF;
        return a.ref.from.row += n - 1, a.ref.to.row = a.ref.from.row, a;
      } else if (Array.isArray(a))
        return a[r - 1];
    }
    if (n !== 0 && r !== 0) {
      if (X.isRangeRef(a)) {
        if (a = a.ref, a.to.row - a.from.row < n - 1 || a.to.col - a.from.col < r - 1)
          throw te.REF;
        return { ref: { row: a.from.row + n - 1, col: a.from.col + r - 1 } };
      } else if (X.isCellRef(a)) {
        if (a = a.ref, n > 1 || r > 1)
          throw te.REF;
        return { ref: { row: a.row + n - 1, col: a.col + r - 1 } };
      } else if (Array.isArray(a)) {
        if (a.length < n || a[0].length < r)
          throw te.REF;
        return a[n - 1][r - 1];
      }
    }
  },
  MATCH: () => {
  },
  // Special
  ROW: (t, e) => {
    if (e == null) {
      if (t.position.row != null)
        return t.position.row;
      throw Error("FormulaParser.parse is called without position parameter.");
    } else {
      if (typeof e != "object" || Array.isArray(e))
        throw te.VALUE;
      if (X.isCellRef(e))
        return e.ref.row;
      if (X.isRangeRef(e))
        return e.ref.from.row;
      throw Error("ReferenceFunctions.ROW should not reach here.");
    }
  },
  // Special
  ROWS: (t, e) => {
    if (e == null)
      throw Error("ROWS requires one argument");
    if (typeof e != "object" || Array.isArray(e))
      throw te.VALUE;
    if (X.isCellRef(e))
      return 1;
    if (X.isRangeRef(e))
      return Math.abs(e.ref.from.row - e.ref.to.row) + 1;
    throw Error("ReferenceFunctions.ROWS should not reach here.");
  },
  TRANSPOSE: (t) => {
    t = X.accept(t, Oe.ARRAY, void 0, !1);
    const e = [];
    for (let n = 0; n < t[0].length; n++) {
      e[n] = [];
      for (let r = 0; r < t.length; r++)
        e[n][r] = t[r][n];
    }
    return e;
  },
  VLOOKUP: (t, e, n, r) => {
    t = X.accept(t);
    try {
      e = X.accept(e, Oe.ARRAY, void 0, !1);
    } catch (a) {
      throw a instanceof te ? te.NA : a;
    }
    if (n = X.accept(n, Oe.NUMBER), r = X.accept(r, Oe.BOOLEAN, !0), n < 1)
      throw te.VALUE;
    if (e[0][n - 1] === void 0)
      throw te.REF;
    const i = typeof t;
    if (r) {
      let a = i === typeof e[0][0] ? e[0][0] : null;
      for (let c = 1; c < e.length; c++) {
        const h = e[c], p = e[c][0];
        if (typeof p === i) {
          if (a > t && p > t)
            throw te.NA;
          if (p === t)
            return h[n - 1];
          if (a != null && p > t && a <= t)
            return e[c - 1][n - 1];
          a = p;
        }
      }
      if (a == null)
        throw te.NA;
      return a;
    } else {
      let a = -1;
      if (gn.isWildCard(t) ? a = e.findIndex((c) => gn.toRegex(t, "i").test(c[0])) : a = e.findIndex((c) => c[0] === t), a === -1)
        throw te.NA;
      return e[a][n - 1];
    }
  }
};
var Za = Qa;
const ct = he(), { FormulaHelpers: Ja, Types: ja } = ge(), me = Ja, ec = {
  "#NULL!": 1,
  "#DIV/0!": 2,
  "#VALUE!": 3,
  "#REF!": 4,
  "#NAME?": 5,
  "#NUM!": 6,
  "#N/A": 7
}, tc = {
  CELL: (t, e) => {
  },
  "ERROR.TYPE": (t) => {
    if (t = me.accept(t), t instanceof ct)
      return ec[t.toString()];
    throw ct.NA;
  },
  INFO: () => {
  },
  ISBLANK: (t) => t.ref ? t.value == null || t.value === "" : !1,
  ISERR: (t) => (t = me.accept(t), t instanceof ct && t.toString() !== "#N/A"),
  ISERROR: (t) => (t = me.accept(t), t instanceof ct),
  ISEVEN: (t) => (t = me.accept(t, ja.NUMBER), t = Math.trunc(t), t % 2 === 0),
  ISLOGICAL: (t) => (t = me.accept(t), typeof t == "boolean"),
  ISNA: (t) => (t = me.accept(t), t instanceof ct && t.toString() === "#N/A"),
  ISNONTEXT: (t) => (t = me.accept(t), typeof t != "string"),
  ISNUMBER: (t) => (t = me.accept(t), typeof t == "number"),
  ISREF: (t) => !t.ref || me.isCellRef(t) && (t.ref.row > 1048576 || t.ref.col > 16384) || me.isRangeRef(t) && (t.ref.from.row > 1048576 || t.ref.from.col > 16384 || t.ref.to.row > 1048576 || t.ref.to.col > 16384) ? !1 : (t = me.accept(t), !(t instanceof ct && t.toString() === "#REF!")),
  ISTEXT: (t) => (t = me.accept(t), typeof t == "string"),
  N: (t) => {
    t = me.accept(t);
    const e = typeof t;
    if (e === "number")
      return t;
    if (e === "boolean")
      return Number(t);
    if (t instanceof ct)
      throw t;
    return 0;
  },
  NA: () => {
    throw ct.NA;
  },
  TYPE: (t) => {
    if (t.ref) {
      if (me.isRangeRef(t))
        return 16;
      if (me.isCellRef(t) && (t = me.accept(t), typeof t == "string" && t.length === 0))
        return 1;
    }
    t = me.accept(t);
    const e = typeof t;
    if (e === "number")
      return 1;
    if (e === "string")
      return 2;
    if (e === "boolean")
      return 4;
    if (t instanceof ct)
      return 16;
    if (Array.isArray(t))
      return 64;
  }
};
var nc = tc;
const k = he(), { FormulaHelpers: rc, Types: I } = ge(), O = rc, B = bo, En = So, ic = 2.5066282746310002, Do = {
  "BETA.DIST": (t, e, n, r, i, a) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), r = O.accept(r, I.BOOLEAN), i = O.accept(i, I.NUMBER, 0), a = O.accept(a, I.NUMBER, 1), e <= 0 || n <= 0 || t < i || t > a || i === a)
      throw k.NUM;
    return t = (t - i) / (a - i), r ? B.beta.cdf(t, e, n) : B.beta.pdf(t, e, n) / (a - i);
  },
  "BETA.INV": (t, e, n, r, i) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), r = O.accept(r, I.NUMBER, 0), i = O.accept(i, I.NUMBER, 1), e <= 0 || n <= 0 || t <= 0 || t > 1)
      throw k.NUM;
    return B.beta.inv(t, e, n) * (i - r) + r;
  },
  "BINOM.DIST": (t, e, n, r) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), r = O.accept(r, I.BOOLEAN), e < 0 || n < 0 || n > 1 || t < 0 || t > e)
      throw k.NUM;
    return r ? B.binomial.cdf(t, e, n) : B.binomial.pdf(t, e, n);
  },
  "BINOM.DIST.RANGE": (t, e, n, r) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), r = O.accept(r, I.NUMBER, n), t < 0 || e < 0 || e > 1 || n < 0 || n > t || r < n || r > t)
      throw k.NUM;
    let i = 0;
    for (let a = n; a <= r; a++)
      i += En.COMBIN(t, a) * Math.pow(e, a) * Math.pow(1 - e, t - a);
    return i;
  },
  "BINOM.INV": (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), t < 0 || e < 0 || e > 1 || n < 0 || n > 1)
      throw k.NUM;
    let r = 0;
    for (; r <= t; ) {
      if (B.binomial.cdf(r, t, e) >= n)
        return r;
      r++;
    }
  },
  "CHISQ.DIST": (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), e = Math.trunc(e), t < 0 || e < 1 || e > 10 ** 10)
      throw k.NUM;
    return n ? B.chisquare.cdf(t, e) : B.chisquare.pdf(t, e);
  },
  "CHISQ.DIST.RT": (t, e) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), e = Math.trunc(e), t < 0 || e < 1 || e > 10 ** 10)
      throw k.NUM;
    return 1 - B.chisquare.cdf(t, e);
  },
  "CHISQ.INV": (t, e) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), e = Math.trunc(e), t < 0 || t > 1 || e < 1 || e > 10 ** 10)
      throw k.NUM;
    return B.chisquare.inv(t, e);
  },
  "CHISQ.INV.RT": (t, e) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), e = Math.trunc(e), t < 0 || t > 1 || e < 1 || e > 10 ** 10)
      throw k.NUM;
    return B.chisquare.inv(1 - t, e);
  },
  "CHISQ.TEST": (t, e) => {
    const n = O.accept(t, I.ARRAY, void 0, !1, !1), r = O.accept(e, I.ARRAY, void 0, !1, !1);
    if (n.length !== r.length || n[0].length !== r[0].length || n.length === 1 && n[0].length === 1)
      throw k.NA;
    const i = n.length, a = n[0].length;
    let c = (i - 1) * (a - 1);
    i === 1 ? c = a - 1 : c = i - 1;
    let h = 0;
    for (let l = 0; l < i; l++)
      for (let f = 0; f < a; f++)
        if (!(typeof n[l][f] != "number" || typeof r[l][f] != "number")) {
          if (r[l][f] === 0)
            throw k.DIV0;
          h += Math.pow(n[l][f] - r[l][f], 2) / r[l][f];
        }
    let p = Math.exp(-0.5 * h);
    c % 2 === 1 && (p = p * Math.sqrt(2 * h / Math.PI));
    let u = c;
    for (; u >= 2; )
      p = p * h / u, u = u - 2;
    let o = p, s = c;
    for (; o > 1e-15 * p; )
      s = s + 2, o = o * h / s, p = p + o;
    return 1 - p;
  },
  "CONFIDENCE.NORM": (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), n = Math.trunc(n), t <= 0 || t >= 1 || e <= 0 || n < 1)
      throw k.NUM;
    return B.normalci(1, t, e, n)[1] - 1;
  },
  "CONFIDENCE.T": (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), n = Math.trunc(n), t <= 0 || t >= 1 || e <= 0 || n < 1)
      throw k.NUM;
    if (n === 1)
      throw k.DIV0;
    return B.tci(1, t, e, n)[1] - 1;
  },
  CORREL: (t, e) => {
    if (t = O.accept(t, I.ARRAY, void 0, !0, !0), e = O.accept(e, I.ARRAY, void 0, !0, !0), t.length !== e.length)
      throw k.NA;
    const n = [], r = [];
    for (let i = 0; i < t.length; i++)
      typeof t[i] != "number" || typeof e[i] != "number" || (n.push(t[i]), r.push(e[i]));
    if (n.length <= 1)
      throw k.DIV0;
    return B.corrcoeff(n, r);
  },
  "COVARIANCE.P": (t, e) => {
    if (t = O.accept(t, I.ARRAY, void 0, !0, !0), e = O.accept(e, I.ARRAY, void 0, !0, !0), t.length !== e.length)
      throw k.NA;
    const n = [], r = [];
    for (let h = 0; h < t.length; h++)
      typeof t[h] != "number" || typeof e[h] != "number" || (n.push(t[h]), r.push(e[h]));
    const i = B.mean(n), a = B.mean(r);
    let c = 0;
    for (let h = 0; h < n.length; h++)
      c += (n[h] - i) * (r[h] - a);
    return c / n.length;
  },
  "COVARIANCE.S": (t, e) => {
    if (t = O.accept(t, I.ARRAY, void 0, !0, !0), e = O.accept(e, I.ARRAY, void 0, !0, !0), t.length !== e.length)
      throw k.NA;
    const n = [], r = [];
    for (let i = 0; i < t.length; i++)
      typeof t[i] != "number" || typeof e[i] != "number" || (n.push(t[i]), r.push(e[i]));
    if (n.length <= 1)
      throw k.DIV0;
    return B.covariance(n, r);
  },
  DEVSQ: (...t) => {
    let e = 0, n = [];
    O.flattenParams(t, I.NUMBER, !0, (i, a) => {
      typeof i == "number" && (e += i, n.push(i));
    });
    const r = e / n.length;
    e = 0;
    for (let i = 0; i < n.length; i++)
      e += (n[i] - r) ** 2;
    return e;
  },
  "EXPON.DIST": (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.BOOLEAN), t < 0 || e <= 0)
      throw k.NUM;
    return n ? B.exponential.cdf(t, e) : B.exponential.pdf(t, e);
  },
  "F.DIST": (t, e, n, r) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), r = O.accept(r, I.BOOLEAN), t < 0 || e < 1 || n < 1)
      throw k.NUM;
    return e = Math.trunc(e), n = Math.trunc(n), r ? B.centralF.cdf(t, e, n) : B.centralF.pdf(t, e, n);
  },
  "F.DIST.RT": (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), t < 0 || e < 1 || n < 1)
      throw k.NUM;
    return e = Math.trunc(e), n = Math.trunc(n), 1 - B.centralF.cdf(t, e, n);
  },
  "F.INV": (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), t < 0 || t > 1 || e < 1 || n < 1)
      throw k.NUM;
    return e = Math.trunc(e), n = Math.trunc(n), B.centralF.inv(t, e, n);
  },
  "F.INV.RT": (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), t < 0 || t > 1 || e < 1 || e >= Math.pow(10, 10) || n < 1 || n >= Math.pow(10, 10))
      throw k.NUM;
    return e = Math.trunc(e), n = Math.trunc(n), B.centralF.inv(1 - t, e, n);
  },
  /**
   * https://en.wikipedia.org/wiki/F-test_of_equality_of_variances
   */
  "F.TEST": (t, e) => {
    t = O.accept(t, I.ARRAY, void 0, !0, !0), e = O.accept(e, I.ARRAY, void 0, !0, !0);
    const n = [], r = [];
    let i = 0, a = 0;
    for (let p = 0; p < Math.max(t.length, e.length); p++)
      typeof t[p] == "number" && (n.push(t[p]), i += t[p]), typeof e[p] == "number" && (r.push(e[p]), a += e[p]);
    if (n.length <= 1 || r.length <= 1)
      throw k.DIV0;
    i /= n.length, a /= r.length;
    let c = 0, h = 0;
    for (let p = 0; p < n.length; p++)
      c += (i - n[p]) ** 2;
    c /= n.length - 1;
    for (let p = 0; p < r.length; p++)
      h += (a - r[p]) ** 2;
    return h /= r.length - 1, B.centralF.cdf(c / h, n.length - 1, r.length - 1) * 2;
  },
  FISHER: (t) => {
    if (t = O.accept(t, I.NUMBER), t <= -1 || t >= 1)
      throw k.NUM;
    return Math.log((1 + t) / (1 - t)) / 2;
  },
  FISHERINV: (t) => {
    t = O.accept(t, I.NUMBER);
    let e = Math.exp(2 * t);
    return (e - 1) / (e + 1);
  },
  // FIXME
  FORECAST: (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.ARRAY, void 0, !0, !0), n = O.accept(n, I.ARRAY, void 0, !0, !0), n.length !== e.length)
      throw k.NA;
    const r = [], i = [];
    let a = !0;
    for (let l = 0; l < e.length; l++)
      typeof e[l] != "number" || typeof n[l] != "number" || (r.push(e[l]), i.push(n[l]), n[l] !== n[0] && (a = !1));
    if (a)
      throw k.DIV0;
    const c = B.mean(r), h = B.mean(i);
    let p = 0, u = 0;
    for (let l = 0; l < r.length; l++)
      p += (i[l] - h) * (r[l] - c), u += (i[l] - h) ** 2;
    const o = p / u;
    return c - o * h + o * t;
  },
  "FORECAST.ETS": () => {
  },
  "FORECAST.ETS.CONFINT": () => {
  },
  "FORECAST.ETS.SEASONALITY": () => {
  },
  "FORECAST.ETS.STAT": () => {
  },
  "FORECAST.LINEAR": (...t) => Do.FORECAST(...t),
  FREQUENCY: (t, e) => {
    t = O.accept(t, I.ARRAY, void 0, !0, !0), e = O.accept(e, I.ARRAY, void 0, !0, !0);
    const n = [];
    for (let i = 0; i < e.length; i++)
      typeof e[i] == "number" && n.push(e[i]);
    n.sort(), n.push(1 / 0);
    const r = [];
    for (let i = 0; i < n.length; i++) {
      r[i] = [], r[i][0] = 0;
      for (let a = 0; a < t.length; a++) {
        if (typeof t[a] != "number")
          continue;
        t[a] <= n[i] && (r[i][0]++, t[a] = null);
      }
    }
    return r;
  },
  GAMMA: (t) => {
    if (t = O.accept(t, I.NUMBER), t === 0 || t < 0 && t === Math.trunc(t))
      throw k.NUM;
    return B.gammafn(t);
  },
  "GAMMA.DIST": (t, e, n, r) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), r = O.accept(r, I.BOOLEAN), t < 0 || e <= 0 || n <= 0)
      throw k.NUM;
    return r ? B.gamma.cdf(t, e, n, !0) : B.gamma.pdf(t, e, n, !1);
  },
  "GAMMA.INV": (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), t < 0 || t > 1 || e <= 0 || n <= 0)
      throw k.NUM;
    return B.gamma.inv(t, e, n);
  },
  GAMMALN: (t) => {
    if (t = O.accept(t, I.NUMBER), t <= 0)
      throw k.NUM;
    return B.gammaln(t);
  },
  "GAMMALN.PRECISE": (t) => {
    if (t = O.accept(t, I.NUMBER), t <= 0)
      throw k.NUM;
    return B.gammaln(t);
  },
  GAUSS: (t) => (t = O.accept(t, I.NUMBER), B.normal.cdf(t, 0, 1) - 0.5),
  GEOMEAN: (...t) => {
    const e = [];
    return O.flattenParams(t, I.NUMBER, !0, (n, r) => {
      typeof n == "number" && e.push(n);
    }), B.geomean(e);
  },
  GROWTH: (t, e, n, r) => {
    t = O.accept(t, I.ARRAY, void 0, !0, !0);
    for (let f = 0; f < t.length; f++)
      if (typeof t[f] != "number")
        throw k.VALUE;
    e = O.accept(e, I.ARRAY, null, !0, !0);
    const i = e == null;
    if (e == null) {
      e = [];
      for (let f = 1; f <= t.length; f++)
        e.push(f);
    } else {
      if (e.length !== t.length)
        throw k.REF;
      for (let f = 0; f < e.length; f++)
        if (typeof e[f] != "number")
          throw k.VALUE;
    }
    if (n = O.accept(n, I.ARRAY, null, !1, !0), n == null && i) {
      n = [];
      for (let f = 1; f <= t.length; f++)
        n.push(f);
      n = [n];
    } else
      n == null && (n = Array.isArray(e[0]) ? e : [e]);
    r = O.accept(r, I.BOOLEAN, !0);
    const a = t.length;
    let c = 0, h = 0, p = 0, u = 0;
    for (let f = 0; f < a; f++) {
      const v = e[f], d = Math.log(t[f]);
      c += v, h += d, p += v * d, u += v * v;
    }
    c /= a, h /= a, p /= a, u /= a;
    let o, s;
    r ? (o = (p - c * h) / (u - c * c), s = h - o * c) : (o = p / u, s = 0);
    const l = [];
    for (let f = 0; f < n.length; f++) {
      l[f] = [];
      for (let v = 0; v < n[0].length; v++) {
        if (typeof n[f][v] != "number")
          throw k.VALUE;
        l[f][v] = Math.exp(s + o * n[f][v]);
      }
    }
    return l;
  },
  HARMEAN: (...t) => {
    let e = 0, n = 0;
    return O.flattenParams(t, I.NUMBER, !0, (r, i) => {
      typeof r == "number" && (n += 1 / r, e++);
    }), e / n;
  },
  "HYPGEOM.DIST": (t, e, n, r, i) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), r = O.accept(r, I.NUMBER), i = O.accept(i, I.BOOLEAN), t = Math.trunc(t), e = Math.trunc(e), n = Math.trunc(n), r = Math.trunc(r), r <= 0 || t < 0 || e <= 0 || n <= 0 || e > r || n > r || e < t || n < t || t < e - r + n)
      throw k.NUM;
    function a(h, p, u, o) {
      return En.COMBIN(u, h) * En.COMBIN(o - u, p - h) / En.COMBIN(o, p);
    }
    function c(h, p, u, o) {
      let s = 0;
      for (let l = 0; l <= h; l++)
        s += a(l, p, u, o);
      return s;
    }
    return i ? c(t, e, n, r) : a(t, e, n, r);
  },
  INTERCEPT: (t, e) => {
    if (t = O.accept(t, I.ARRAY, void 0, !0, !0), e = O.accept(e, I.ARRAY, void 0, !0, !0), e.length !== t.length)
      throw k.NA;
    const n = [], r = [];
    for (let u = 0; u < t.length; u++)
      typeof t[u] != "number" || typeof e[u] != "number" || (n.push(t[u]), r.push(e[u]));
    if (n.length <= 1)
      throw k.DIV0;
    const i = B.mean(n), a = B.mean(r);
    let c = 0, h = 0;
    for (let u = 0; u < n.length; u++)
      c += (r[u] - a) * (n[u] - i), h += (r[u] - a) ** 2;
    const p = c / h;
    return i - p * a;
  },
  KURT: (...t) => {
    let e = 0, n = [];
    O.flattenParams(t, I.NUMBER, !0, (a, c) => {
      typeof a == "number" && (e += a, n.push(a));
    });
    const r = n.length;
    e /= r;
    let i = 0;
    for (let a = 0; a < r; a++)
      i += Math.pow(n[a] - e, 4);
    return i = i / Math.pow(B.stdev(n, !0), 4), r * (r + 1) / ((r - 1) * (r - 2) * (r - 3)) * i - 3 * (r - 1) * (r - 1) / ((r - 2) * (r - 3));
  },
  LINEST: () => {
  },
  LOGEST: () => {
  },
  "LOGNORM.DIST": (t, e, n, r) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), r = O.accept(r, I.BOOLEAN), t <= 0 || n <= 0)
      throw k.NUM;
    return r ? B.lognormal.cdf(t, e, n) : B.lognormal.pdf(t, e, n);
  },
  "LOGNORM.INV": (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), t <= 0 || t >= 1 || n <= 0)
      throw k.NUM;
    return B.lognormal.inv(t, e, n);
  },
  "MODE.MULT": () => {
  },
  "MODE.SNGL": () => {
  },
  "NEGBINOM.DIST": (t, e, n, r) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), r = O.accept(r, I.BOOLEAN), t = Math.trunc(t), e = Math.trunc(e), n < 0 || n > 1 || t < 0 || e < 1)
      throw k.NUM;
    return r ? B.negbin.cdf(t, e, n) : B.negbin.pdf(t, e, n);
  },
  "NORM.DIST": (t, e, n, r) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), r = O.accept(r, I.BOOLEAN), n <= 0)
      throw k.NUM;
    return r ? B.normal.cdf(t, e, n) : B.normal.pdf(t, e, n);
  },
  "NORM.INV": (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), t <= 0 || t >= 1 || n <= 0)
      throw k.NUM;
    return B.normal.inv(t, e, n);
  },
  "NORM.S.DIST": (t, e) => (t = O.accept(t, I.NUMBER), e = O.accept(e, I.BOOLEAN), e ? B.normal.cdf(t, 0, 1) : B.normal.pdf(t, 0, 1)),
  "NORM.S.INV": (t) => {
    if (t = O.accept(t, I.NUMBER), t <= 0 || t >= 1)
      throw k.NUM;
    return B.normal.inv(t, 0, 1);
  },
  PEARSON: () => {
  },
  "PERCENTILE.EXC": () => {
  },
  "PERCENTILE.INC": () => {
  },
  "PERCENTRANK.EXC": () => {
  },
  "PERCENTRANK.INC": () => {
  },
  PERMUTATIONA: () => {
  },
  PHI: (t) => (t = O.accept(t, I.NUMBER), Math.exp(-0.5 * t * t) / ic),
  "POISSON.DIST": (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.BOOLEAN), t < 0 || e < 0)
      throw k.NUM;
    return t = Math.trunc(t), n ? B.poisson.cdf(t, e) : B.poisson.pdf(t, e);
  },
  PROB: () => {
  },
  "QUARTILE.EXC": () => {
  },
  "QUARTILE.INC": () => {
  },
  "RANK.AVG": () => {
  },
  "RANK.EQ": () => {
  },
  RSQ: () => {
  },
  SKEW: () => {
  },
  "SKEW.P": () => {
  },
  SLOPE: () => {
  },
  STANDARDIZE: (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), n <= 0)
      throw k.NUM;
    return (t - e) / n;
  },
  "STDEV.P": () => {
  },
  "STDEV.S": () => {
  },
  STDEVA: () => {
  },
  STDEVPA: () => {
  },
  STEYX: () => {
  },
  "T.DIST": (t, e, n) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.BOOLEAN), e < 1)
      throw k.NUM;
    return n ? B.studentt.cdf(t, e) : B.studentt.pdf(t, e);
  },
  "T.DIST.2T": (t, e) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), e < 1 || t < 0)
      throw k.NUM;
    return (1 - B.studentt.cdf(t, e)) * 2;
  },
  "T.DIST.RT": (t, e) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), e < 1)
      throw k.NUM;
    return 1 - B.studentt.cdf(t, e);
  },
  "T.INV": (t, e) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), t <= 0 || t > 1 || e < 1)
      throw k.NUM;
    return e = e % 1 === 0 ? e : Math.trunc(e), B.studentt.inv(t, e);
  },
  "T.INV.2T": (t, e) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), t <= 0 || t > 1 || e < 1)
      throw k.NUM;
    return e = e % 1 === 0 ? e : Math.trunc(e), Math.abs(B.studentt.inv(t / 2, e));
  },
  "T.TEST": () => {
  },
  TREND: () => {
  },
  TRIMMEAN: () => {
  },
  "VAR.P": () => {
  },
  "VAR.S": () => {
  },
  VARA: () => {
  },
  VARPA: () => {
  },
  "WEIBULL.DIST": (t, e, n, r) => {
    if (t = O.accept(t, I.NUMBER), e = O.accept(e, I.NUMBER), n = O.accept(n, I.NUMBER), r = O.accept(r, I.BOOLEAN), t < 0 || e <= 0 || n <= 0)
      throw k.NUM;
    return r ? 1 - Math.exp(-Math.pow(t / n, e)) : Math.pow(t, e - 1) * Math.exp(-Math.pow(t / n, e)) * e / Math.pow(n, e);
  },
  "Z.TEST": () => {
  }
};
var oc = {
  DistributionFunctions: Do
};
const sc = he(), { FormulaHelpers: ac, Types: mn, Criteria: gi, Address: Wh } = ge(), { Infix: Ei } = br, lt = ac, { DistributionFunctions: cc } = oc, lc = {
  AVEDEV: (...t) => {
    let e = 0;
    const n = [];
    lt.flattenParams(t, mn.NUMBER, !0, (i, a) => {
      typeof i == "number" && (e += i, n.push(i));
    });
    const r = e / n.length;
    e = 0;
    for (let i = 0; i < n.length; i++)
      e += Math.abs(n[i] - r);
    return e / n.length;
  },
  AVERAGE: (...t) => {
    let e = 0, n = 0;
    return lt.flattenParams(t, mn.NUMBER, !0, (r, i) => {
      typeof r == "number" && (e += r, n++);
    }), e / n;
  },
  AVERAGEA: (...t) => {
    let e = 0, n = 0;
    return lt.flattenParams(t, mn.NUMBER, !0, (r, i) => {
      const a = typeof r;
      a === "number" ? (e += r, n++) : a === "string" && n++;
    }), e / n;
  },
  // special
  AVERAGEIF: (t, e, n, r) => {
    const i = lt.retrieveRanges(t, e, r);
    e = i[0], r = i[1], n = lt.retrieveArg(t, n);
    const a = n.isArray;
    n = gi.parse(lt.accept(n));
    let c = 0, h = 0;
    if (e.forEach((p, u) => {
      p.forEach((o, s) => {
        const l = r[u][s];
        typeof l == "number" && (n.op === "wc" ? n.match === n.value.test(o) && (c += l, h++) : Ei.compareOp(o, n.op, n.value, Array.isArray(o), a) && (c += l, h++));
      });
    }), h === 0)
      throw sc.DIV0;
    return c / h;
  },
  AVERAGEIFS: () => {
  },
  COUNT: (...t) => {
    let e = 0;
    return lt.flattenParams(
      t,
      null,
      !0,
      (n, r) => {
        (r.isLiteral && !isNaN(n) || typeof n == "number") && e++;
      }
    ), e;
  },
  COUNTIF: (t, e) => {
    t = lt.accept(t, mn.ARRAY, void 0, !1, !0);
    const n = e.isArray;
    e = lt.accept(e);
    let r = 0;
    return e = gi.parse(e), t.forEach((i) => {
      i.forEach((a) => {
        e.op === "wc" ? e.match === e.value.test(a) && r++ : Ei.compareOp(a, e.op, e.value, Array.isArray(a), n) && r++;
      });
    }), r;
  },
  LARGE: () => {
  },
  MAX: () => {
  },
  MAXA: () => {
  },
  MAXIFS: () => {
  },
  MEDIAN: () => {
  },
  MIN: () => {
  },
  MINA: () => {
  },
  MINIFS: () => {
  },
  PERMUT: () => {
  },
  PERMUTATIONA: () => {
  },
  SMALL: () => {
  }
};
var uc = Object.assign(lc, cc);
const De = he(), { FormulaHelpers: fc, Types: pe } = ge(), ae = fc, Rn = 1e3 * 60 * 60 * 24, Ir = new Date(Date.UTC(1900, 0, 1)), hc = [
  void 0,
  0,
  1,
  void 0,
  void 0,
  void 0,
  void 0,
  void 0,
  void 0,
  void 0,
  void 0,
  void 0,
  1,
  2,
  3,
  4,
  5,
  6,
  0
], pc = [
  void 0,
  [1, 2, 3, 4, 5, 6, 7],
  [7, 1, 2, 3, 4, 5, 6],
  [6, 0, 1, 2, 3, 4, 5],
  void 0,
  void 0,
  void 0,
  void 0,
  void 0,
  void 0,
  void 0,
  [7, 1, 2, 3, 4, 5, 6],
  [6, 7, 1, 2, 3, 4, 5],
  [5, 6, 7, 1, 2, 3, 4],
  [4, 5, 6, 7, 1, 2, 3],
  [3, 4, 5, 6, 7, 1, 2],
  [2, 3, 4, 5, 6, 7, 1],
  [1, 2, 3, 4, 5, 6, 7]
], mi = [
  void 0,
  [6, 0],
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  void 0,
  void 0,
  void 0,
  [0],
  [1],
  [2],
  [3],
  [4],
  [5],
  [6]
], dc = /^\s*(\d\d?)\s*(:\s*\d\d?)?\s*(:\s*\d\d?)?\s*(pm|am)?\s*$/i, vc = /^\s*((\d\d?)\s*([-\/])\s*(\d\d?))([\d:.apm\s]*)$/i, gc = /^\s*((\d\d?)\s*([-/])\s*(jan\w*|feb\w*|mar\w*|apr\w*|may\w*|jun\w*|jul\w*|aug\w*|sep\w*|oct\w*|nov\w*|dec\w*))([\d:.apm\s]*)$/i, Ec = /^\s*((jan\w*|feb\w*|mar\w*|apr\w*|may\w*|jun\w*|jul\w*|aug\w*|sep\w*|oct\w*|nov\w*|dec\w*)\s*([-/])\s*(\d\d?))([\d:.apm\s]*)$/i;
function mc(t) {
  const e = t.match(vc), n = t.match(gc), r = t.match(Ec);
  return e ? t = e[1] + e[3] + (/* @__PURE__ */ new Date()).getFullYear() + e[5] : n ? t = n[1] + n[3] + (/* @__PURE__ */ new Date()).getFullYear() + n[5] : r && (t = r[1] + r[3] + (/* @__PURE__ */ new Date()).getFullYear() + r[5]), new Date(Date.parse(`${t} UTC`));
}
function Rc(t) {
  const e = t.match(dc);
  if (!e)
    return;
  const n = e[2] ? e[2] : ":00", r = e[3] ? e[3] : ":00", i = e[4] ? " " + e[4] : "", a = new Date(Date.parse(`1/1/1900 ${e[1] + n + r + i} UTC`));
  let c = /* @__PURE__ */ new Date();
  return c = new Date(Date.UTC(
    c.getFullYear(),
    c.getMonth(),
    c.getDate(),
    c.getHours(),
    c.getMinutes(),
    c.getSeconds(),
    c.getMilliseconds()
  )), new Date(Date.UTC(
    c.getUTCFullYear(),
    c.getUTCMonth(),
    c.getUTCDate(),
    a.getUTCHours(),
    a.getUTCMinutes(),
    a.getUTCSeconds(),
    a.getUTCMilliseconds()
  ));
}
function Ot(t) {
  const e = t > -22038912e5 ? 2 : 1;
  return Math.floor((t - Ir) / 864e5) + e;
}
function Nc(t) {
  if (t < 0)
    throw De.VALUE;
  return t <= 60 ? new Date(Ir.getTime() + (t - 1) * 864e5) : new Date(Ir.getTime() + (t - 2) * 864e5);
}
function Vo(t) {
  if (t instanceof Date)
    return { date: t };
  t = ae.accept(t);
  let e = !0, n;
  return isNaN(t) ? (n = Rc(t), n ? e = !1 : n = mc(t)) : (t = Number(t), n = Nc(t)), { date: n, isDateGiven: e };
}
function Z(t) {
  return Vo(t).date;
}
function vr(t, e) {
  return t.getUTCFullYear() === e.getUTCFullYear() && t.getUTCMonth() === e.getUTCMonth() && t.getUTCDate() === e.getUTCDate();
}
function Ac(t) {
  return t === 1900 ? !0 : new Date(t, 1, 29).getMonth() === 1;
}
const Mt = {
  DATE: (t, e, n) => {
    if (t = ae.accept(t, pe.NUMBER), e = ae.accept(e, pe.NUMBER), n = ae.accept(n, pe.NUMBER), t < 0 || t >= 1e4)
      throw De.NUM;
    return t < 1900 && (t += 1900), Ot(Date.UTC(t, e - 1, n));
  },
  DATEDIF: (t, e, n) => {
    if (t = Z(t), e = Z(e), n = ae.accept(n, pe.STRING).toLowerCase(), t > e)
      throw De.NUM;
    const r = e.getUTCFullYear() - t.getUTCFullYear(), i = e.getUTCMonth() - t.getUTCMonth(), a = e.getUTCDate() - t.getUTCDate();
    let c;
    switch (n) {
      case "y":
        return c = i < 0 || i === 0 && a < 0 ? -1 : 0, c + r;
      case "m":
        return c = a < 0 ? -1 : 0, r * 12 + i + c;
      case "d":
        return Math.floor(e - t) / Rn;
      case "md":
        return t.setUTCFullYear(e.getUTCFullYear()), a < 0 ? t.setUTCMonth(e.getUTCMonth() - 1) : t.setUTCMonth(e.getUTCMonth()), Math.floor(e - t) / Rn;
      case "ym":
        return c = a < 0 ? -1 : 0, (c + r * 12 + i) % 12;
      case "yd":
        return i < 0 || i === 0 && a < 0 ? t.setUTCFullYear(e.getUTCFullYear() - 1) : t.setUTCFullYear(e.getUTCFullYear()), Math.floor(e - t) / Rn;
    }
  },
  /**
   * Limitation: Year must be four digit, only support ISO 8016 date format.
   * Does not support date without year, i.e. "5-JUL".
   * @param {string} dateText
   */
  DATEVALUE: (t) => {
    t = ae.accept(t, pe.STRING);
    const { date: e, isDateGiven: n } = Vo(t);
    if (!n)
      return 0;
    const r = Ot(e);
    if (r < 0 || r > 2958465)
      throw De.VALUE;
    return r;
  },
  DAY: (t) => Z(t).getUTCDate(),
  DAYS: (t, e) => {
    t = Z(t), e = Z(e);
    let n = 0;
    return e < -22038912e5 && -22038912e5 < t && (n = 1), Math.floor(t - e) / Rn + n;
  },
  DAYS360: (t, e, n) => {
    t = Z(t), e = Z(e), n = ae.accept(n, pe.BOOLEAN, !1), t.getUTCDate() === 31 && t.setUTCDate(30), !n && t.getUTCDate() < 30 && e.getUTCDate() > 30 ? e.setUTCMonth(e.getUTCMonth() + 1, 1) : e.getUTCDate() === 31 && e.setUTCDate(30);
    const r = e.getUTCFullYear() - t.getUTCFullYear(), i = e.getUTCMonth() - t.getUTCMonth(), a = e.getUTCDate() - t.getUTCDate();
    return i * 30 + a + r * 12 * 30;
  },
  EDATE: (t, e) => (t = Z(t), e = ae.accept(e, pe.NUMBER), t.setUTCMonth(t.getUTCMonth() + e), Ot(t)),
  EOMONTH: (t, e) => (t = Z(t), e = ae.accept(e, pe.NUMBER), t.setUTCMonth(t.getUTCMonth() + e + 1, 0), Ot(t)),
  HOUR: (t) => Z(t).getUTCHours(),
  ISOWEEKNUM: (t) => {
    const e = Z(t), n = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate())), r = n.getUTCDay();
    n.setUTCDate(n.getUTCDate() + 4 - r);
    const i = new Date(Date.UTC(n.getUTCFullYear(), 0, 1));
    return Math.ceil(((n - i) / 864e5 + 1) / 7);
  },
  MINUTE: (t) => Z(t).getUTCMinutes(),
  MONTH: (t) => Z(t).getUTCMonth() + 1,
  NETWORKDAYS: (t, e, n) => {
    t = Z(t), e = Z(e);
    let r = 1;
    if (t > e) {
      r = -1;
      const c = t;
      t = e, e = c;
    }
    const i = [];
    n != null && ae.flattenParams([n], pe.NUMBER, !1, (c) => {
      i.push(Z(c));
    });
    let a = 0;
    for (; t <= e; ) {
      if (t.getUTCDay() !== 0 && t.getUTCDay() !== 6) {
        let c = !1;
        for (let h = 0; h < i.length; h++)
          if (vr(t, i[h])) {
            c = !0;
            break;
          }
        c || a++;
      }
      t.setUTCDate(t.getUTCDate() + 1);
    }
    return r * a;
  },
  "NETWORKDAYS.INTL": (t, e, n, r) => {
    t = Z(t), e = Z(e);
    let i = 1;
    if (t > e) {
      i = -1;
      const h = t;
      t = e, e = h;
    }
    if (n = ae.accept(n, null, 1), n === "1111111")
      return 0;
    if (typeof n == "string" && Number(n).toString() !== n) {
      if (n.length !== 7)
        throw De.VALUE;
      n = n.charAt(6) + n.slice(0, 6);
      const h = [];
      for (let p = 0; p < n.length; p++)
        n.charAt(p) === "1" && h.push(p);
      n = h;
    } else {
      if (typeof n != "number")
        throw De.VALUE;
      n = mi[n];
    }
    const a = [];
    r != null && ae.flattenParams([r], pe.NUMBER, !1, (h) => {
      a.push(Z(h));
    });
    let c = 0;
    for (; t <= e; ) {
      let h = !1;
      for (let p = 0; p < n.length; p++)
        if (n[p] === t.getUTCDay()) {
          h = !0;
          break;
        }
      if (!h) {
        let p = !1;
        for (let u = 0; u < a.length; u++)
          if (vr(t, a[u])) {
            p = !0;
            break;
          }
        p || c++;
      }
      t.setUTCDate(t.getUTCDate() + 1);
    }
    return i * c;
  },
  NOW: () => {
    const t = /* @__PURE__ */ new Date();
    return Ot(Date.UTC(
      t.getFullYear(),
      t.getMonth(),
      t.getDate(),
      t.getHours(),
      t.getMinutes(),
      t.getSeconds(),
      t.getMilliseconds()
    )) + (3600 * t.getHours() + 60 * t.getMinutes() + t.getSeconds()) / 86400;
  },
  SECOND: (t) => Z(t).getUTCSeconds(),
  TIME: (t, e, n) => {
    if (t = ae.accept(t, pe.NUMBER), e = ae.accept(e, pe.NUMBER), n = ae.accept(n, pe.NUMBER), t < 0 || t > 32767 || e < 0 || e > 32767 || n < 0 || n > 32767)
      throw De.NUM;
    return (3600 * t + 60 * e + n) / 86400;
  },
  TIMEVALUE: (t) => (t = Z(t), (3600 * t.getUTCHours() + 60 * t.getUTCMinutes() + t.getUTCSeconds()) / 86400),
  TODAY: () => {
    const t = /* @__PURE__ */ new Date();
    return Ot(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));
  },
  WEEKDAY: (t, e) => {
    const n = Z(t);
    e = ae.accept(e, pe.NUMBER, 1);
    const r = n.getUTCDay(), i = pc[e];
    if (!i)
      throw De.NUM;
    return i[r];
  },
  WEEKNUM: (t, e) => {
    const n = Z(t);
    if (e = ae.accept(e, pe.NUMBER, 1), e === 21)
      return Mt.ISOWEEKNUM(t);
    const r = hc[e], i = new Date(Date.UTC(n.getUTCFullYear(), 0, 1)), a = i.getUTCDay() < r ? 1 : 0;
    return Math.ceil(((n - i) / 864e5 + 1) / 7) + a;
  },
  WORKDAY: (t, e, n) => Mt["WORKDAY.INTL"](t, e, 1, n),
  "WORKDAY.INTL": (t, e, n, r) => {
    if (t = Z(t), e = ae.accept(e, pe.NUMBER), n = ae.accept(n, null, 1), n === "1111111")
      throw De.VALUE;
    if (typeof n == "string" && Number(n).toString() !== n) {
      if (n.length !== 7)
        throw De.VALUE;
      n = n.charAt(6) + n.slice(0, 6);
      const c = [];
      for (let h = 0; h < n.length; h++)
        n.charAt(h) === "1" && c.push(h);
      n = c;
    } else {
      if (typeof n != "number")
        throw De.VALUE;
      if (n = mi[n], n == null)
        throw De.NUM;
    }
    const i = [];
    r != null && ae.flattenParams([r], pe.NUMBER, !1, (c) => {
      i.push(Z(c));
    }), t.setUTCDate(t.getUTCDate() + 1);
    let a = 0;
    for (; a < e; ) {
      let c = !1;
      for (let h = 0; h < n.length; h++)
        if (n[h] === t.getUTCDay()) {
          c = !0;
          break;
        }
      if (!c) {
        let h = !1;
        for (let p = 0; p < i.length; p++)
          if (vr(t, i[p])) {
            h = !0;
            break;
          }
        h || a++;
      }
      t.setUTCDate(t.getUTCDate() + 1);
    }
    return Ot(t) - 1;
  },
  YEAR: (t) => Z(t).getUTCFullYear(),
  // Warning: may have bugs
  YEARFRAC: (t, e, n) => {
    if (t = Z(t), e = Z(e), t > e) {
      const u = t;
      t = e, e = u;
    }
    if (n = ae.accept(n, pe.NUMBER, 0), n = Math.trunc(n), n < 0 || n > 4)
      throw De.VALUE;
    let r = t.getUTCDate();
    const i = t.getUTCMonth() + 1, a = t.getUTCFullYear();
    let c = e.getUTCDate();
    const h = e.getUTCMonth() + 1, p = e.getUTCFullYear();
    switch (n) {
      case 0:
        return r === 31 && c === 31 ? (r = 30, c = 30) : r === 31 ? r = 30 : r === 30 && c === 31 && (c = 30), Math.abs(c + h * 30 + p * 360 - (r + i * 30 + a * 360)) / 360;
      case 1:
        if (p - a < 2) {
          const u = Ac(a) && a !== 1900 ? 366 : 365;
          return Mt.DAYS(e, t) / u;
        } else {
          const u = p - a + 1, s = (new Date(p + 1, 0, 1) - new Date(a, 0, 1)) / 1e3 / 60 / 60 / 24 / u;
          return Mt.DAYS(e, t) / s;
        }
      case 2:
        return Math.abs(Mt.DAYS(e, t) / 360);
      case 3:
        return Math.abs(Mt.DAYS(e, t) / 365);
      case 4:
        return Math.abs(c + h * 30 + p * 360 - (r + i * 30 + a * 360)) / 360;
    }
  }
};
var yc = Mt;
const Tc = he(), { FormulaHelpers: wc, Types: Cc } = ge(), Ic = wc, Oc = {
  ENCODEURL: (t) => encodeURIComponent(Ic.accept(t, Cc.STRING)),
  FILTERXML: () => {
  },
  WEBSERVICE: (t, e) => {
    throw Tc.ERROR("WEBSERVICE is not supported in sync mode.");
  }
};
var Mc = Oc, Or = "7.1.2";
function ee(t) {
  return t && t.length === 0;
}
function Qe(t) {
  return t == null ? [] : Object.keys(t);
}
function xe(t) {
  for (var e = [], n = Object.keys(t), r = 0; r < n.length; r++)
    e.push(t[n[r]]);
  return e;
}
function Uc(t, e) {
  for (var n = [], r = Qe(t), i = 0; i < r.length; i++) {
    var a = r[i];
    n.push(e.call(null, t[a], a));
  }
  return n;
}
function x(t, e) {
  for (var n = [], r = 0; r < t.length; r++)
    n.push(e.call(null, t[r], r));
  return n;
}
function Ve(t) {
  for (var e = [], n = 0; n < t.length; n++) {
    var r = t[n];
    Array.isArray(r) ? e = e.concat(Ve(r)) : e.push(r);
  }
  return e;
}
function Ze(t) {
  return ee(t) ? void 0 : t[0];
}
function Go(t) {
  var e = t && t.length;
  return e ? t[e - 1] : void 0;
}
function V(t, e) {
  if (Array.isArray(t))
    for (var n = 0; n < t.length; n++)
      e.call(null, t[n], n);
  else if (Vr(t))
    for (var r = Qe(t), n = 0; n < r.length; n++) {
      var i = r[n], a = t[i];
      e.call(null, a, i);
    }
  else
    throw Error("non exhaustive match");
}
function ot(t) {
  return typeof t == "string";
}
function ht(t) {
  return t === void 0;
}
function Ct(t) {
  return t instanceof Function;
}
function Re(t, e) {
  return e === void 0 && (e = 1), t.slice(e, t.length);
}
function nn(t, e) {
  return e === void 0 && (e = 1), t.slice(0, t.length - e);
}
function Je(t, e) {
  var n = [];
  if (Array.isArray(t))
    for (var r = 0; r < t.length; r++) {
      var i = t[r];
      e.call(null, i) && n.push(i);
    }
  return n;
}
function Ht(t, e) {
  return Je(t, function(n) {
    return !e(n);
  });
}
function je(t, e) {
  for (var n = Object.keys(t), r = {}, i = 0; i < n.length; i++) {
    var a = n[i], c = t[a];
    e(c) && (r[a] = c);
  }
  return r;
}
function $(t, e) {
  return Vr(t) ? t.hasOwnProperty(e) : !1;
}
function fe(t, e) {
  return $t(t, function(n) {
    return n === e;
  }) !== void 0;
}
function Se(t) {
  for (var e = [], n = 0; n < t.length; n++)
    e.push(t[n]);
  return e;
}
function on(t) {
  var e = {};
  for (var n in t)
    Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
  return e;
}
function $t(t, e) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    if (e.call(null, r))
      return r;
  }
}
function Lc(t, e) {
  for (var n = [], r = 0; r < t.length; r++) {
    var i = t[r];
    e.call(null, i) && n.push(i);
  }
  return n;
}
function Ne(t, e, n) {
  for (var r = Array.isArray(t), i = r ? t : xe(t), a = r ? [] : Qe(t), c = n, h = 0; h < i.length; h++)
    c = e.call(null, c, i[h], r ? h : a[h]);
  return c;
}
function sn(t) {
  return Ht(t, function(e) {
    return e == null;
  });
}
function Dr(t, e) {
  e === void 0 && (e = function(r) {
    return r;
  });
  var n = [];
  return Ne(t, function(r, i) {
    var a = e(i);
    return fe(n, a) ? r : (n.push(a), r.concat(i));
  }, []);
}
function it(t) {
  return Array.isArray(t);
}
function pt(t) {
  return t instanceof RegExp;
}
function Vr(t) {
  return t instanceof Object;
}
function He(t, e) {
  for (var n = 0; n < t.length; n++)
    if (!e(t[n], n))
      return !1;
  return !0;
}
function $n(t, e) {
  return Ht(t, function(n) {
    return fe(e, n);
  });
}
function $o(t, e) {
  for (var n = 0; n < t.length; n++)
    if (e(t[n]))
      return !0;
  return !1;
}
function _c(t, e) {
  for (var n = 0; n < t.length; n++)
    if (t[n] === e)
      return n;
  return -1;
}
function et(t) {
  for (var e = [], n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  for (var r = 0; r < e.length; r++)
    for (var i = e[r], a = Qe(i), c = 0; c < a.length; c++) {
      var h = a[c];
      t[h] = i[h];
    }
  return t;
}
function Pc(t) {
  for (var e = [], n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  for (var r = 0; r < e.length; r++)
    for (var i = e[r], a = Qe(i), c = 0; c < a.length; c++) {
      var h = a[c];
      $(t, h) || (t[h] = i[h]);
    }
  return t;
}
function Gr() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return Pc.apply(null, [{}].concat(t));
}
function kc(t, e) {
  var n = {};
  return V(t, function(r) {
    var i = e(r), a = n[i];
    a ? a.push(r) : n[i] = [r];
  }), n;
}
function Ri(t, e) {
  for (var n = on(t), r = Qe(e), i = 0; i < r.length; i++) {
    var a = r[i], c = e[a];
    n[a] = c;
  }
  return n;
}
function de() {
}
function Ni(t) {
  return t;
}
function xc(t) {
  for (var e = [], n = 0; n < t.length; n++) {
    var r = t[n];
    e.push(r !== void 0 ? r : void 0);
  }
  return e;
}
function Mr(t) {
  console && console.error && console.error("Error: " + t);
}
function Ho(t) {
  console && console.warn && console.warn("Warning: " + t);
}
function Ai() {
  return typeof Map == "function";
}
function Sc(t, e) {
  e.forEach(function(n) {
    var r = n.prototype;
    Object.getOwnPropertyNames(r).forEach(function(i) {
      if (i !== "constructor") {
        var a = Object.getOwnPropertyDescriptor(r, i);
        a && (a.get || a.set) ? Object.defineProperty(t.prototype, i, a) : t.prototype[i] = n.prototype[i];
      }
    });
  });
}
function Wo(t) {
  function e() {
  }
  e.prototype = t;
  var n = new e();
  function r() {
    return typeof n.bar;
  }
  return r(), r(), t;
}
function kn(t) {
  return t[t.length - 1];
}
function qo(t) {
  var e = (/* @__PURE__ */ new Date()).getTime(), n = t(), r = (/* @__PURE__ */ new Date()).getTime(), i = r - e;
  return { time: i, value: n };
}
var Yo = { exports: {} };
(function(t) {
  (function(e, n) {
    t.exports ? t.exports = n() : e.regexpToAst = n();
  })(
    typeof self < "u" ? (
      // istanbul ignore next
      self
    ) : go,
    function() {
      function e() {
      }
      e.prototype.saveState = function() {
        return {
          idx: this.idx,
          input: this.input,
          groupIdx: this.groupIdx
        };
      }, e.prototype.restoreState = function(d) {
        this.idx = d.idx, this.input = d.input, this.groupIdx = d.groupIdx;
      }, e.prototype.pattern = function(d) {
        this.idx = 0, this.input = d, this.groupIdx = 0, this.consumeChar("/");
        var g = this.disjunction();
        this.consumeChar("/");
        for (var E = {
          type: "Flags",
          loc: { begin: this.idx, end: d.length },
          global: !1,
          ignoreCase: !1,
          multiLine: !1,
          unicode: !1,
          sticky: !1
        }; this.isRegExpFlag(); )
          switch (this.popChar()) {
            case "g":
              h(E, "global");
              break;
            case "i":
              h(E, "ignoreCase");
              break;
            case "m":
              h(E, "multiLine");
              break;
            case "u":
              h(E, "unicode");
              break;
            case "y":
              h(E, "sticky");
              break;
          }
        if (this.idx !== this.input.length)
          throw Error(
            "Redundant input: " + this.input.substring(this.idx)
          );
        return {
          type: "Pattern",
          flags: E,
          value: g,
          loc: this.loc(0)
        };
      }, e.prototype.disjunction = function() {
        var d = [], g = this.idx;
        for (d.push(this.alternative()); this.peekChar() === "|"; )
          this.consumeChar("|"), d.push(this.alternative());
        return { type: "Disjunction", value: d, loc: this.loc(g) };
      }, e.prototype.alternative = function() {
        for (var d = [], g = this.idx; this.isTerm(); )
          d.push(this.term());
        return { type: "Alternative", value: d, loc: this.loc(g) };
      }, e.prototype.term = function() {
        return this.isAssertion() ? this.assertion() : this.atom();
      }, e.prototype.assertion = function() {
        var d = this.idx;
        switch (this.popChar()) {
          case "^":
            return {
              type: "StartAnchor",
              loc: this.loc(d)
            };
          case "$":
            return { type: "EndAnchor", loc: this.loc(d) };
          case "\\":
            switch (this.popChar()) {
              case "b":
                return {
                  type: "WordBoundary",
                  loc: this.loc(d)
                };
              case "B":
                return {
                  type: "NonWordBoundary",
                  loc: this.loc(d)
                };
            }
            throw Error("Invalid Assertion Escape");
          case "(":
            this.consumeChar("?");
            var g;
            switch (this.popChar()) {
              case "=":
                g = "Lookahead";
                break;
              case "!":
                g = "NegativeLookahead";
                break;
            }
            p(g);
            var E = this.disjunction();
            return this.consumeChar(")"), {
              type: g,
              value: E,
              loc: this.loc(d)
            };
        }
        u();
      }, e.prototype.quantifier = function(d) {
        var g, E = this.idx;
        switch (this.popChar()) {
          case "*":
            g = {
              atLeast: 0,
              atMost: 1 / 0
            };
            break;
          case "+":
            g = {
              atLeast: 1,
              atMost: 1 / 0
            };
            break;
          case "?":
            g = {
              atLeast: 0,
              atMost: 1
            };
            break;
          case "{":
            var A = this.integerIncludingZero();
            switch (this.popChar()) {
              case "}":
                g = {
                  atLeast: A,
                  atMost: A
                };
                break;
              case ",":
                var m;
                this.isDigit() ? (m = this.integerIncludingZero(), g = {
                  atLeast: A,
                  atMost: m
                }) : g = {
                  atLeast: A,
                  atMost: 1 / 0
                }, this.consumeChar("}");
                break;
            }
            if (d === !0 && g === void 0)
              return;
            p(g);
            break;
        }
        if (!(d === !0 && g === void 0))
          return p(g), this.peekChar(0) === "?" ? (this.consumeChar("?"), g.greedy = !1) : g.greedy = !0, g.type = "Quantifier", g.loc = this.loc(E), g;
      }, e.prototype.atom = function() {
        var d, g = this.idx;
        switch (this.peekChar()) {
          case ".":
            d = this.dotAll();
            break;
          case "\\":
            d = this.atomEscape();
            break;
          case "[":
            d = this.characterClass();
            break;
          case "(":
            d = this.group();
            break;
        }
        return d === void 0 && this.isPatternCharacter() && (d = this.patternCharacter()), p(d), d.loc = this.loc(g), this.isQuantifier() && (d.quantifier = this.quantifier()), d;
      }, e.prototype.dotAll = function() {
        return this.consumeChar("."), {
          type: "Set",
          complement: !0,
          value: [a(`
`), a("\r"), a("\u2028"), a("\u2029")]
        };
      }, e.prototype.atomEscape = function() {
        switch (this.consumeChar("\\"), this.peekChar()) {
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            return this.decimalEscapeAtom();
          case "d":
          case "D":
          case "s":
          case "S":
          case "w":
          case "W":
            return this.characterClassEscape();
          case "f":
          case "n":
          case "r":
          case "t":
          case "v":
            return this.controlEscapeAtom();
          case "c":
            return this.controlLetterEscapeAtom();
          case "0":
            return this.nulCharacterAtom();
          case "x":
            return this.hexEscapeSequenceAtom();
          case "u":
            return this.regExpUnicodeEscapeSequenceAtom();
          default:
            return this.identityEscapeAtom();
        }
      }, e.prototype.decimalEscapeAtom = function() {
        var d = this.positiveInteger();
        return { type: "GroupBackReference", value: d };
      }, e.prototype.characterClassEscape = function() {
        var d, g = !1;
        switch (this.popChar()) {
          case "d":
            d = s;
            break;
          case "D":
            d = s, g = !0;
            break;
          case "s":
            d = f;
            break;
          case "S":
            d = f, g = !0;
            break;
          case "w":
            d = l;
            break;
          case "W":
            d = l, g = !0;
            break;
        }
        return p(d), { type: "Set", value: d, complement: g };
      }, e.prototype.controlEscapeAtom = function() {
        var d;
        switch (this.popChar()) {
          case "f":
            d = a("\f");
            break;
          case "n":
            d = a(`
`);
            break;
          case "r":
            d = a("\r");
            break;
          case "t":
            d = a("	");
            break;
          case "v":
            d = a("\v");
            break;
        }
        return p(d), { type: "Character", value: d };
      }, e.prototype.controlLetterEscapeAtom = function() {
        this.consumeChar("c");
        var d = this.popChar();
        if (/[a-zA-Z]/.test(d) === !1)
          throw Error("Invalid ");
        var g = d.toUpperCase().charCodeAt(0) - 64;
        return { type: "Character", value: g };
      }, e.prototype.nulCharacterAtom = function() {
        return this.consumeChar("0"), { type: "Character", value: a("\0") };
      }, e.prototype.hexEscapeSequenceAtom = function() {
        return this.consumeChar("x"), this.parseHexDigits(2);
      }, e.prototype.regExpUnicodeEscapeSequenceAtom = function() {
        return this.consumeChar("u"), this.parseHexDigits(4);
      }, e.prototype.identityEscapeAtom = function() {
        var d = this.popChar();
        return { type: "Character", value: a(d) };
      }, e.prototype.classPatternCharacterAtom = function() {
        switch (this.peekChar()) {
          case `
`:
          case "\r":
          case "\u2028":
          case "\u2029":
          case "\\":
          case "]":
            throw Error("TBD");
          default:
            var d = this.popChar();
            return { type: "Character", value: a(d) };
        }
      }, e.prototype.characterClass = function() {
        var d = [], g = !1;
        for (this.consumeChar("["), this.peekChar(0) === "^" && (this.consumeChar("^"), g = !0); this.isClassAtom(); ) {
          var E = this.classAtom(), A = E.type === "Character";
          if (A && this.isRangeDash()) {
            this.consumeChar("-");
            var m = this.classAtom(), N = m.type === "Character";
            if (N) {
              if (m.value < E.value)
                throw Error("Range out of order in character class");
              d.push({ from: E.value, to: m.value });
            } else
              c(E.value, d), d.push(a("-")), c(m.value, d);
          } else
            c(E.value, d);
        }
        return this.consumeChar("]"), { type: "Set", complement: g, value: d };
      }, e.prototype.classAtom = function() {
        switch (this.peekChar()) {
          case "]":
          case `
`:
          case "\r":
          case "\u2028":
          case "\u2029":
            throw Error("TBD");
          case "\\":
            return this.classEscape();
          default:
            return this.classPatternCharacterAtom();
        }
      }, e.prototype.classEscape = function() {
        switch (this.consumeChar("\\"), this.peekChar()) {
          case "b":
            return this.consumeChar("b"), { type: "Character", value: a("\b") };
          case "d":
          case "D":
          case "s":
          case "S":
          case "w":
          case "W":
            return this.characterClassEscape();
          case "f":
          case "n":
          case "r":
          case "t":
          case "v":
            return this.controlEscapeAtom();
          case "c":
            return this.controlLetterEscapeAtom();
          case "0":
            return this.nulCharacterAtom();
          case "x":
            return this.hexEscapeSequenceAtom();
          case "u":
            return this.regExpUnicodeEscapeSequenceAtom();
          default:
            return this.identityEscapeAtom();
        }
      }, e.prototype.group = function() {
        var d = !0;
        switch (this.consumeChar("("), this.peekChar(0)) {
          case "?":
            this.consumeChar("?"), this.consumeChar(":"), d = !1;
            break;
          default:
            this.groupIdx++;
            break;
        }
        var g = this.disjunction();
        this.consumeChar(")");
        var E = {
          type: "Group",
          capturing: d,
          value: g
        };
        return d && (E.idx = this.groupIdx), E;
      }, e.prototype.positiveInteger = function() {
        var d = this.popChar();
        if (i.test(d) === !1)
          throw Error("Expecting a positive integer");
        for (; r.test(this.peekChar(0)); )
          d += this.popChar();
        return parseInt(d, 10);
      }, e.prototype.integerIncludingZero = function() {
        var d = this.popChar();
        if (r.test(d) === !1)
          throw Error("Expecting an integer");
        for (; r.test(this.peekChar(0)); )
          d += this.popChar();
        return parseInt(d, 10);
      }, e.prototype.patternCharacter = function() {
        var d = this.popChar();
        switch (d) {
          case `
`:
          case "\r":
          case "\u2028":
          case "\u2029":
          case "^":
          case "$":
          case "\\":
          case ".":
          case "*":
          case "+":
          case "?":
          case "(":
          case ")":
          case "[":
          case "|":
            throw Error("TBD");
          default:
            return { type: "Character", value: a(d) };
        }
      }, e.prototype.isRegExpFlag = function() {
        switch (this.peekChar(0)) {
          case "g":
          case "i":
          case "m":
          case "u":
          case "y":
            return !0;
          default:
            return !1;
        }
      }, e.prototype.isRangeDash = function() {
        return this.peekChar() === "-" && this.isClassAtom(1);
      }, e.prototype.isDigit = function() {
        return r.test(this.peekChar(0));
      }, e.prototype.isClassAtom = function(d) {
        switch (d === void 0 && (d = 0), this.peekChar(d)) {
          case "]":
          case `
`:
          case "\r":
          case "\u2028":
          case "\u2029":
            return !1;
          default:
            return !0;
        }
      }, e.prototype.isTerm = function() {
        return this.isAtom() || this.isAssertion();
      }, e.prototype.isAtom = function() {
        if (this.isPatternCharacter())
          return !0;
        switch (this.peekChar(0)) {
          case ".":
          case "\\":
          case "[":
          case "(":
            return !0;
          default:
            return !1;
        }
      }, e.prototype.isAssertion = function() {
        switch (this.peekChar(0)) {
          case "^":
          case "$":
            return !0;
          case "\\":
            switch (this.peekChar(1)) {
              case "b":
              case "B":
                return !0;
              default:
                return !1;
            }
          case "(":
            return this.peekChar(1) === "?" && (this.peekChar(2) === "=" || this.peekChar(2) === "!");
          default:
            return !1;
        }
      }, e.prototype.isQuantifier = function() {
        var d = this.saveState();
        try {
          return this.quantifier(!0) !== void 0;
        } catch {
          return !1;
        } finally {
          this.restoreState(d);
        }
      }, e.prototype.isPatternCharacter = function() {
        switch (this.peekChar()) {
          case "^":
          case "$":
          case "\\":
          case ".":
          case "*":
          case "+":
          case "?":
          case "(":
          case ")":
          case "[":
          case "|":
          case "/":
          case `
`:
          case "\r":
          case "\u2028":
          case "\u2029":
            return !1;
          default:
            return !0;
        }
      }, e.prototype.parseHexDigits = function(d) {
        for (var g = "", E = 0; E < d; E++) {
          var A = this.popChar();
          if (n.test(A) === !1)
            throw Error("Expecting a HexDecimal digits");
          g += A;
        }
        var m = parseInt(g, 16);
        return { type: "Character", value: m };
      }, e.prototype.peekChar = function(d) {
        return d === void 0 && (d = 0), this.input[this.idx + d];
      }, e.prototype.popChar = function() {
        var d = this.peekChar(0);
        return this.consumeChar(), d;
      }, e.prototype.consumeChar = function(d) {
        if (d !== void 0 && this.input[this.idx] !== d)
          throw Error(
            "Expected: '" + d + "' but found: '" + this.input[this.idx] + "' at offset: " + this.idx
          );
        if (this.idx >= this.input.length)
          throw Error("Unexpected end of input");
        this.idx++;
      }, e.prototype.loc = function(d) {
        return { begin: d, end: this.idx };
      };
      var n = /[0-9a-fA-F]/, r = /[0-9]/, i = /[1-9]/;
      function a(d) {
        return d.charCodeAt(0);
      }
      function c(d, g) {
        d.length !== void 0 ? d.forEach(function(E) {
          g.push(E);
        }) : g.push(d);
      }
      function h(d, g) {
        if (d[g] === !0)
          throw "duplicate flag " + g;
        d[g] = !0;
      }
      function p(d) {
        if (d === void 0)
          throw Error("Internal Error - Should never get here!");
      }
      function u() {
        throw Error("Internal Error - Should never get here!");
      }
      var o, s = [];
      for (o = a("0"); o <= a("9"); o++)
        s.push(o);
      var l = [a("_")].concat(s);
      for (o = a("a"); o <= a("z"); o++)
        l.push(o);
      for (o = a("A"); o <= a("Z"); o++)
        l.push(o);
      var f = [
        a(" "),
        a("\f"),
        a(`
`),
        a("\r"),
        a("	"),
        a("\v"),
        a("	"),
        a(" "),
        a(" "),
        a(" "),
        a(" "),
        a(" "),
        a(" "),
        a(" "),
        a(" "),
        a(" "),
        a(" "),
        a(" "),
        a(" "),
        a(" "),
        a("\u2028"),
        a("\u2029"),
        a(" "),
        a(" "),
        a("　"),
        a("\uFEFF")
      ];
      function v() {
      }
      return v.prototype.visitChildren = function(d) {
        for (var g in d) {
          var E = d[g];
          d.hasOwnProperty(g) && (E.type !== void 0 ? this.visit(E) : Array.isArray(E) && E.forEach(function(A) {
            this.visit(A);
          }, this));
        }
      }, v.prototype.visit = function(d) {
        switch (d.type) {
          case "Pattern":
            this.visitPattern(d);
            break;
          case "Flags":
            this.visitFlags(d);
            break;
          case "Disjunction":
            this.visitDisjunction(d);
            break;
          case "Alternative":
            this.visitAlternative(d);
            break;
          case "StartAnchor":
            this.visitStartAnchor(d);
            break;
          case "EndAnchor":
            this.visitEndAnchor(d);
            break;
          case "WordBoundary":
            this.visitWordBoundary(d);
            break;
          case "NonWordBoundary":
            this.visitNonWordBoundary(d);
            break;
          case "Lookahead":
            this.visitLookahead(d);
            break;
          case "NegativeLookahead":
            this.visitNegativeLookahead(d);
            break;
          case "Character":
            this.visitCharacter(d);
            break;
          case "Set":
            this.visitSet(d);
            break;
          case "Group":
            this.visitGroup(d);
            break;
          case "GroupBackReference":
            this.visitGroupBackReference(d);
            break;
          case "Quantifier":
            this.visitQuantifier(d);
            break;
        }
        this.visitChildren(d);
      }, v.prototype.visitPattern = function(d) {
      }, v.prototype.visitFlags = function(d) {
      }, v.prototype.visitDisjunction = function(d) {
      }, v.prototype.visitAlternative = function(d) {
      }, v.prototype.visitStartAnchor = function(d) {
      }, v.prototype.visitEndAnchor = function(d) {
      }, v.prototype.visitWordBoundary = function(d) {
      }, v.prototype.visitNonWordBoundary = function(d) {
      }, v.prototype.visitLookahead = function(d) {
      }, v.prototype.visitNegativeLookahead = function(d) {
      }, v.prototype.visitCharacter = function(d) {
      }, v.prototype.visitSet = function(d) {
      }, v.prototype.visitGroup = function(d) {
      }, v.prototype.visitGroupBackReference = function(d) {
      }, v.prototype.visitQuantifier = function(d) {
      }, {
        RegExpParser: e,
        BaseRegExpVisitor: v,
        VERSION: "0.5.0"
      };
    }
  );
})(Yo);
var an = Yo.exports, In = {}, Bc = new an.RegExpParser();
function Hn(t) {
  var e = t.toString();
  if (In.hasOwnProperty(e))
    return In[e];
  var n = Bc.pattern(e);
  return In[e] = n, n;
}
function Fc() {
  In = {};
}
var bc = globalThis && globalThis.__extends || function() {
  var t = function(e, n) {
    return t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, i) {
      r.__proto__ = i;
    } || function(r, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (r[a] = i[a]);
    }, t(e, n);
  };
  return function(e, n) {
    t(e, n);
    function r() {
      this.constructor = e;
    }
    e.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
  };
}(), Ko = "Complement Sets are not supported for first char optimization", xn = `Unable to use "first char" lexer optimizations:
`;
function Dc(t, e) {
  e === void 0 && (e = !1);
  try {
    var n = Hn(t), r = Ur(n.value, {}, n.flags.ignoreCase);
    return r;
  } catch (a) {
    if (a.message === Ko)
      e && Ho("" + xn + ("	Unable to optimize: < " + t.toString() + ` >
`) + `	Complement Sets cannot be automatically optimized.
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#COMPLEMENT for details.`);
    else {
      var i = "";
      e && (i = `
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#REGEXP_PARSING for details.`), Mr(xn + `
` + ("	Failed parsing: < " + t.toString() + ` >
`) + ("	Using the regexp-to-ast library version: " + an.VERSION + `
`) + "	Please open an issue at: https://github.com/bd82/regexp-to-ast/issues" + i);
    }
  }
  return [];
}
function Ur(t, e, n) {
  switch (t.type) {
    case "Disjunction":
      for (var r = 0; r < t.value.length; r++)
        Ur(t.value[r], e, n);
      break;
    case "Alternative":
      for (var i = t.value, r = 0; r < i.length; r++) {
        var a = i[r];
        switch (a.type) {
          case "EndAnchor":
          case "GroupBackReference":
          case "Lookahead":
          case "NegativeLookahead":
          case "StartAnchor":
          case "WordBoundary":
          case "NonWordBoundary":
            continue;
        }
        var c = a;
        switch (c.type) {
          case "Character":
            Nn(c.value, e, n);
            break;
          case "Set":
            if (c.complement === !0)
              throw Error(Ko);
            V(c.value, function(u) {
              if (typeof u == "number")
                Nn(u, e, n);
              else {
                var o = u;
                if (n === !0)
                  for (var s = o.from; s <= o.to; s++)
                    Nn(s, e, n);
                else {
                  for (var s = o.from; s <= o.to && s < Jt; s++)
                    Nn(s, e, n);
                  if (o.to >= Jt)
                    for (var l = o.from >= Jt ? o.from : Jt, f = o.to, v = Tt(l), d = Tt(f), g = v; g <= d; g++)
                      e[g] = g;
                }
              }
            });
            break;
          case "Group":
            Ur(c.value, e, n);
            break;
          default:
            throw Error("Non Exhaustive Match");
        }
        var h = c.quantifier !== void 0 && c.quantifier.atLeast === 0;
        if (
          // A group may be optional due to empty contents /(?:)/
          // or if everything inside it is optional /((a)?)/
          c.type === "Group" && Lr(c) === !1 || // If this term is not a group it may only be optional if it has an optional quantifier
          c.type !== "Group" && h === !1
        )
          break;
      }
      break;
    default:
      throw Error("non exhaustive match!");
  }
  return xe(e);
}
function Nn(t, e, n) {
  var r = Tt(t);
  e[r] = r, n === !0 && Vc(t, e);
}
function Vc(t, e) {
  var n = String.fromCharCode(t), r = n.toUpperCase();
  if (r !== n) {
    var i = Tt(r.charCodeAt(0));
    e[i] = i;
  } else {
    var a = n.toLowerCase();
    if (a !== n) {
      var i = Tt(a.charCodeAt(0));
      e[i] = i;
    }
  }
}
function yi(t, e) {
  return $t(t.value, function(n) {
    if (typeof n == "number")
      return fe(e, n);
    var r = n;
    return $t(e, function(i) {
      return r.from <= i && i <= r.to;
    }) !== void 0;
  });
}
function Lr(t) {
  return t.quantifier && t.quantifier.atLeast === 0 ? !0 : t.value ? it(t.value) ? He(t.value, Lr) : Lr(t.value) : !1;
}
var Gc = (
  /** @class */
  function(t) {
    bc(e, t);
    function e(n) {
      var r = t.call(this) || this;
      return r.targetCharCodes = n, r.found = !1, r;
    }
    return e.prototype.visitChildren = function(n) {
      if (this.found !== !0) {
        switch (n.type) {
          case "Lookahead":
            this.visitLookahead(n);
            return;
          case "NegativeLookahead":
            this.visitNegativeLookahead(n);
            return;
        }
        t.prototype.visitChildren.call(this, n);
      }
    }, e.prototype.visitCharacter = function(n) {
      fe(this.targetCharCodes, n.value) && (this.found = !0);
    }, e.prototype.visitSet = function(n) {
      n.complement ? yi(n, this.targetCharCodes) === void 0 && (this.found = !0) : yi(n, this.targetCharCodes) !== void 0 && (this.found = !0);
    }, e;
  }(an.BaseRegExpVisitor)
);
function $r(t, e) {
  if (e instanceof RegExp) {
    var n = Hn(e), r = new Gc(t);
    return r.visit(n), r.found;
  } else
    return $t(e, function(i) {
      return fe(t, i.charCodeAt(0));
    }) !== void 0;
}
var zo = globalThis && globalThis.__extends || function() {
  var t = function(e, n) {
    return t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, i) {
      r.__proto__ = i;
    } || function(r, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (r[a] = i[a]);
    }, t(e, n);
  };
  return function(e, n) {
    t(e, n);
    function r() {
      this.constructor = e;
    }
    e.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
  };
}(), st = "PATTERN", Lt = "defaultMode", An = "modes", Xo = typeof new RegExp("(?:)").sticky == "boolean";
function $c(t, e) {
  e = Gr(e, {
    useSticky: Xo,
    debug: !1,
    safeMode: !1,
    positionTracking: "full",
    lineTerminatorCharacters: ["\r", `
`],
    tracer: function(A, m) {
      return m();
    }
  });
  var n = e.tracer;
  n("initCharCodeToOptimizedIndexMap", function() {
    fl();
  });
  var r;
  n("Reject Lexer.NA", function() {
    r = Ht(t, function(A) {
      return A[st] === Xe.NA;
    });
  });
  var i = !1, a;
  n("Transform Patterns", function() {
    i = !1, a = x(r, function(A) {
      var m = A[st];
      if (pt(m)) {
        var N = m.source;
        return N.length === 1 && // only these regExp meta characters which can appear in a length one regExp
        N !== "^" && N !== "$" && N !== "." && !m.ignoreCase ? N : N.length === 2 && N[0] === "\\" && // not a meta character
        !fe([
          "d",
          "D",
          "s",
          "S",
          "t",
          "r",
          "n",
          "t",
          "0",
          "c",
          "b",
          "B",
          "f",
          "v",
          "w",
          "W"
        ], N[1]) ? N[1] : e.useSticky ? wi(m) : Ti(m);
      } else {
        if (Ct(m))
          return i = !0, { exec: m };
        if ($(m, "exec"))
          return i = !0, m;
        if (typeof m == "string") {
          if (m.length === 1)
            return m;
          var y = m.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&"), R = new RegExp(y);
          return e.useSticky ? wi(R) : Ti(R);
        } else
          throw Error("non exhaustive match");
      }
    });
  });
  var c, h, p, u, o;
  n("misc mapping", function() {
    c = x(r, function(A) {
      return A.tokenTypeIdx;
    }), h = x(r, function(A) {
      var m = A.GROUP;
      if (m !== Xe.SKIPPED) {
        if (ot(m))
          return m;
        if (ht(m))
          return !1;
        throw Error("non exhaustive match");
      }
    }), p = x(r, function(A) {
      var m = A.LONGER_ALT;
      if (m) {
        var N = _c(r, m);
        return N;
      }
    }), u = x(r, function(A) {
      return A.PUSH_MODE;
    }), o = x(r, function(A) {
      return $(A, "POP_MODE");
    });
  });
  var s;
  n("Line Terminator Handling", function() {
    var A = Jo(e.lineTerminatorCharacters);
    s = x(r, function(m) {
      return !1;
    }), e.positionTracking !== "onlyOffset" && (s = x(r, function(m) {
      if ($(m, "LINE_BREAKS"))
        return m.LINE_BREAKS;
      if (Zo(m, A) === !1)
        return $r(A, m.PATTERN);
    }));
  });
  var l, f, v, d;
  n("Misc Mapping #2", function() {
    l = x(r, Qo), f = x(a, cl), v = Ne(r, function(A, m) {
      var N = m.GROUP;
      return ot(N) && N !== Xe.SKIPPED && (A[N] = []), A;
    }, {}), d = x(a, function(A, m) {
      return {
        pattern: a[m],
        longerAlt: p[m],
        canLineTerminator: s[m],
        isCustom: l[m],
        short: f[m],
        group: h[m],
        push: u[m],
        pop: o[m],
        tokenTypeIdx: c[m],
        tokenType: r[m]
      };
    });
  });
  var g = !0, E = [];
  return e.safeMode || n("First Char Optimization", function() {
    E = Ne(r, function(A, m, N) {
      if (typeof m.PATTERN == "string") {
        var y = m.PATTERN.charCodeAt(0), R = Tt(y);
        gr(A, R, d[N]);
      } else if (it(m.START_CHARS_HINT)) {
        var T;
        V(m.START_CHARS_HINT, function(C) {
          var M = typeof C == "string" ? C.charCodeAt(0) : C, _ = Tt(M);
          T !== _ && (T = _, gr(A, _, d[N]));
        });
      } else if (pt(m.PATTERN))
        if (m.PATTERN.unicode)
          g = !1, e.ensureOptimizations && Mr("" + xn + ("	Unable to analyze < " + m.PATTERN.toString() + ` > pattern.
`) + `	The regexp unicode flag is not currently supported by the regexp-to-ast library.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNICODE_OPTIMIZE`);
        else {
          var w = Dc(m.PATTERN, e.ensureOptimizations);
          ee(w) && (g = !1), V(w, function(C) {
            gr(A, C, d[N]);
          });
        }
      else
        e.ensureOptimizations && Mr("" + xn + ("	TokenType: <" + m.name + `> is using a custom token pattern without providing <start_chars_hint> parameter.
`) + `	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_OPTIMIZE`), g = !1;
      return A;
    }, []);
  }), n("ArrayPacking", function() {
    E = xc(E);
  }), {
    emptyGroups: v,
    patternIdxToConfig: d,
    charCodeToPatternIdxToConfig: E,
    hasCustom: i,
    canBeOptimized: g
  };
}
function Hc(t, e) {
  var n = [], r = qc(t);
  n = n.concat(r.errors);
  var i = Yc(r.valid), a = i.valid;
  return n = n.concat(i.errors), n = n.concat(Wc(a)), n = n.concat(el(a)), n = n.concat(tl(a, e)), n = n.concat(nl(a)), n;
}
function Wc(t) {
  var e = [], n = Je(t, function(r) {
    return pt(r[st]);
  });
  return e = e.concat(zc(n)), e = e.concat(Zc(n)), e = e.concat(Jc(n)), e = e.concat(jc(n)), e = e.concat(Xc(n)), e;
}
function qc(t) {
  var e = Je(t, function(i) {
    return !$(i, st);
  }), n = x(e, function(i) {
    return {
      message: "Token Type: ->" + i.name + "<- missing static 'PATTERN' property",
      type: se.MISSING_PATTERN,
      tokenTypes: [i]
    };
  }), r = $n(t, e);
  return { errors: n, valid: r };
}
function Yc(t) {
  var e = Je(t, function(i) {
    var a = i[st];
    return !pt(a) && !Ct(a) && !$(a, "exec") && !ot(a);
  }), n = x(e, function(i) {
    return {
      message: "Token Type: ->" + i.name + "<- static 'PATTERN' can only be a RegExp, a Function matching the {CustomPatternMatcherFunc} type or an Object matching the {ICustomPattern} interface.",
      type: se.INVALID_PATTERN,
      tokenTypes: [i]
    };
  }), r = $n(t, e);
  return { errors: n, valid: r };
}
var Kc = /[^\\][\$]/;
function zc(t) {
  var e = (
    /** @class */
    function(i) {
      zo(a, i);
      function a() {
        var c = i !== null && i.apply(this, arguments) || this;
        return c.found = !1, c;
      }
      return a.prototype.visitEndAnchor = function(c) {
        this.found = !0;
      }, a;
    }(an.BaseRegExpVisitor)
  ), n = Je(t, function(i) {
    var a = i[st];
    try {
      var c = Hn(a), h = new e();
      return h.visit(c), h.found;
    } catch {
      return Kc.test(a.source);
    }
  }), r = x(n, function(i) {
    return {
      message: `Unexpected RegExp Anchor Error:
	Token Type: ->` + i.name + `<- static 'PATTERN' cannot contain end of input anchor '$'
	See chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.`,
      type: se.EOI_ANCHOR_FOUND,
      tokenTypes: [i]
    };
  });
  return r;
}
function Xc(t) {
  var e = Je(t, function(r) {
    var i = r[st];
    return i.test("");
  }), n = x(e, function(r) {
    return {
      message: "Token Type: ->" + r.name + "<- static 'PATTERN' must not match an empty string",
      type: se.EMPTY_MATCH_PATTERN,
      tokenTypes: [r]
    };
  });
  return n;
}
var Qc = /[^\\[][\^]|^\^/;
function Zc(t) {
  var e = (
    /** @class */
    function(i) {
      zo(a, i);
      function a() {
        var c = i !== null && i.apply(this, arguments) || this;
        return c.found = !1, c;
      }
      return a.prototype.visitStartAnchor = function(c) {
        this.found = !0;
      }, a;
    }(an.BaseRegExpVisitor)
  ), n = Je(t, function(i) {
    var a = i[st];
    try {
      var c = Hn(a), h = new e();
      return h.visit(c), h.found;
    } catch {
      return Qc.test(a.source);
    }
  }), r = x(n, function(i) {
    return {
      message: `Unexpected RegExp Anchor Error:
	Token Type: ->` + i.name + `<- static 'PATTERN' cannot contain start of input anchor '^'
	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.`,
      type: se.SOI_ANCHOR_FOUND,
      tokenTypes: [i]
    };
  });
  return r;
}
function Jc(t) {
  var e = Je(t, function(r) {
    var i = r[st];
    return i instanceof RegExp && (i.multiline || i.global);
  }), n = x(e, function(r) {
    return {
      message: "Token Type: ->" + r.name + "<- static 'PATTERN' may NOT contain global('g') or multiline('m')",
      type: se.UNSUPPORTED_FLAGS_FOUND,
      tokenTypes: [r]
    };
  });
  return n;
}
function jc(t) {
  var e = [], n = x(t, function(a) {
    return Ne(t, function(c, h) {
      return a.PATTERN.source === h.PATTERN.source && !fe(e, h) && h.PATTERN !== Xe.NA && (e.push(h), c.push(h)), c;
    }, []);
  });
  n = sn(n);
  var r = Je(n, function(a) {
    return a.length > 1;
  }), i = x(r, function(a) {
    var c = x(a, function(p) {
      return p.name;
    }), h = Ze(a).PATTERN;
    return {
      message: "The same RegExp pattern ->" + h + "<-" + ("has been used in all of the following Token Types: " + c.join(", ") + " <-"),
      type: se.DUPLICATE_PATTERNS_FOUND,
      tokenTypes: a
    };
  });
  return i;
}
function el(t) {
  var e = Je(t, function(r) {
    if (!$(r, "GROUP"))
      return !1;
    var i = r.GROUP;
    return i !== Xe.SKIPPED && i !== Xe.NA && !ot(i);
  }), n = x(e, function(r) {
    return {
      message: "Token Type: ->" + r.name + "<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String",
      type: se.INVALID_GROUP_TYPE_FOUND,
      tokenTypes: [r]
    };
  });
  return n;
}
function tl(t, e) {
  var n = Je(t, function(i) {
    return i.PUSH_MODE !== void 0 && !fe(e, i.PUSH_MODE);
  }), r = x(n, function(i) {
    var a = "Token Type: ->" + i.name + "<- static 'PUSH_MODE' value cannot refer to a Lexer Mode ->" + i.PUSH_MODE + "<-which does not exist";
    return {
      message: a,
      type: se.PUSH_MODE_DOES_NOT_EXIST,
      tokenTypes: [i]
    };
  });
  return r;
}
function nl(t) {
  var e = [], n = Ne(t, function(r, i, a) {
    var c = i.PATTERN;
    return c === Xe.NA || (ot(c) ? r.push({ str: c, idx: a, tokenType: i }) : pt(c) && il(c) && r.push({ str: c.source, idx: a, tokenType: i })), r;
  }, []);
  return V(t, function(r, i) {
    V(n, function(a) {
      var c = a.str, h = a.idx, p = a.tokenType;
      if (i < h && rl(c, r.PATTERN)) {
        var u = "Token: ->" + p.name + `<- can never be matched.
` + ("Because it appears AFTER the Token Type ->" + r.name + "<-") + `in the lexer's definition.
See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNREACHABLE`;
        e.push({
          message: u,
          type: se.UNREACHABLE_PATTERN,
          tokenTypes: [r, p]
        });
      }
    });
  }), e;
}
function rl(t, e) {
  if (pt(e)) {
    var n = e.exec(t);
    return n !== null && n.index === 0;
  } else {
    if (Ct(e))
      return e(t, 0, [], {});
    if ($(e, "exec"))
      return e.exec(t, 0, [], {});
    if (typeof e == "string")
      return e === t;
    throw Error("non exhaustive match");
  }
}
function il(t) {
  var e = [
    ".",
    "\\",
    "[",
    "]",
    "|",
    "^",
    "$",
    "(",
    ")",
    "?",
    "*",
    "+",
    "{"
  ];
  return $t(e, function(n) {
    return t.source.indexOf(n) !== -1;
  }) === void 0;
}
function Ti(t) {
  var e = t.ignoreCase ? "i" : "";
  return new RegExp("^(?:" + t.source + ")", e);
}
function wi(t) {
  var e = t.ignoreCase ? "iy" : "y";
  return new RegExp("" + t.source, e);
}
function ol(t, e, n) {
  var r = [];
  return $(t, Lt) || r.push({
    message: "A MultiMode Lexer cannot be initialized without a <" + Lt + `> property in its definition
`,
    type: se.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE
  }), $(t, An) || r.push({
    message: "A MultiMode Lexer cannot be initialized without a <" + An + `> property in its definition
`,
    type: se.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY
  }), $(t, An) && $(t, Lt) && !$(t.modes, t.defaultMode) && r.push({
    message: "A MultiMode Lexer cannot be initialized with a " + Lt + ": <" + t.defaultMode + `>which does not exist
`,
    type: se.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST
  }), $(t, An) && V(t.modes, function(i, a) {
    V(i, function(c, h) {
      ht(c) && r.push({
        message: "A Lexer cannot be initialized using an undefined Token Type. Mode:" + ("<" + a + "> at index: <" + h + `>
`),
        type: se.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED
      });
    });
  }), r;
}
function sl(t, e, n) {
  var r = [], i = !1, a = sn(Ve(Uc(t.modes, function(p) {
    return p;
  }))), c = Ht(a, function(p) {
    return p[st] === Xe.NA;
  }), h = Jo(n);
  return e && V(c, function(p) {
    var u = Zo(p, h);
    if (u !== !1) {
      var o = ul(p, u), s = {
        message: o,
        type: u.issue,
        tokenType: p
      };
      r.push(s);
    } else
      $(p, "LINE_BREAKS") ? p.LINE_BREAKS === !0 && (i = !0) : $r(h, p.PATTERN) && (i = !0);
  }), e && !i && r.push({
    message: `Warning: No LINE_BREAKS Found.
	This Lexer has been defined to track line and column information,
	But none of the Token Types can be identified as matching a line terminator.
	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#LINE_BREAKS 
	for details.`,
    type: se.NO_LINE_BREAKS_FLAGS
  }), r;
}
function al(t) {
  var e = {}, n = Qe(t);
  return V(n, function(r) {
    var i = t[r];
    if (it(i))
      e[r] = [];
    else
      throw Error("non exhaustive match");
  }), e;
}
function Qo(t) {
  var e = t.PATTERN;
  if (pt(e))
    return !1;
  if (Ct(e))
    return !0;
  if ($(e, "exec"))
    return !0;
  if (ot(e))
    return !1;
  throw Error("non exhaustive match");
}
function cl(t) {
  return ot(t) && t.length === 1 ? t.charCodeAt(0) : !1;
}
var ll = {
  // implements /\n|\r\n?/g.test
  test: function(t) {
    for (var e = t.length, n = this.lastIndex; n < e; n++) {
      var r = t.charCodeAt(n);
      if (r === 10)
        return this.lastIndex = n + 1, !0;
      if (r === 13)
        return t.charCodeAt(n + 1) === 10 ? this.lastIndex = n + 2 : this.lastIndex = n + 1, !0;
    }
    return !1;
  },
  lastIndex: 0
};
function Zo(t, e) {
  if ($(t, "LINE_BREAKS"))
    return !1;
  if (pt(t.PATTERN)) {
    try {
      $r(e, t.PATTERN);
    } catch (n) {
      return {
        issue: se.IDENTIFY_TERMINATOR,
        errMsg: n.message
      };
    }
    return !1;
  } else {
    if (ot(t.PATTERN))
      return !1;
    if (Qo(t))
      return { issue: se.CUSTOM_LINE_BREAK };
    throw Error("non exhaustive match");
  }
}
function ul(t, e) {
  if (e.issue === se.IDENTIFY_TERMINATOR)
    return `Warning: unable to identify line terminator usage in pattern.
` + ("	The problem is in the <" + t.name + `> Token Type
`) + ("	 Root cause: " + e.errMsg + `.
`) + "	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#IDENTIFY_TERMINATOR";
  if (e.issue === se.CUSTOM_LINE_BREAK)
    return `Warning: A Custom Token Pattern should specify the <line_breaks> option.
` + ("	The problem is in the <" + t.name + `> Token Type
`) + "	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_LINE_BREAK";
  throw Error("non exhaustive match");
}
function Jo(t) {
  var e = x(t, function(n) {
    return ot(n) && n.length > 0 ? n.charCodeAt(0) : n;
  });
  return e;
}
function gr(t, e, n) {
  t[e] === void 0 ? t[e] = [n] : t[e].push(n);
}
var Jt = 256;
function Tt(t) {
  return t < Jt ? t : On[t];
}
var On = [];
function fl() {
  if (ee(On)) {
    On = new Array(65536);
    for (var t = 0; t < 65536; t++)
      On[t] = t > 255 ? 255 + ~~(t / 255) : t;
  }
}
function Wn(t, e) {
  var n = t.tokenTypeIdx;
  return n === e.tokenTypeIdx ? !0 : e.isParent === !0 && e.categoryMatchesMap[n] === !0;
}
function Sn(t, e) {
  return t.tokenTypeIdx === e.tokenTypeIdx;
}
var Ci = 1, jo = {};
function cn(t) {
  var e = hl(t);
  pl(e), vl(e), dl(e), V(e, function(n) {
    n.isParent = n.categoryMatches.length > 0;
  });
}
function hl(t) {
  for (var e = Se(t), n = t, r = !0; r; ) {
    n = sn(Ve(x(n, function(a) {
      return a.CATEGORIES;
    })));
    var i = $n(n, e);
    e = e.concat(i), ee(i) ? r = !1 : n = i;
  }
  return e;
}
function pl(t) {
  V(t, function(e) {
    ts(e) || (jo[Ci] = e, e.tokenTypeIdx = Ci++), Ii(e) && !it(e.CATEGORIES) && (e.CATEGORIES = [e.CATEGORIES]), Ii(e) || (e.CATEGORIES = []), gl(e) || (e.categoryMatches = []), El(e) || (e.categoryMatchesMap = {});
  });
}
function dl(t) {
  V(t, function(e) {
    e.categoryMatches = [], V(e.categoryMatchesMap, function(n, r) {
      e.categoryMatches.push(jo[r].tokenTypeIdx);
    });
  });
}
function vl(t) {
  V(t, function(e) {
    es([], e);
  });
}
function es(t, e) {
  V(t, function(n) {
    e.categoryMatchesMap[n.tokenTypeIdx] = !0;
  }), V(e.CATEGORIES, function(n) {
    var r = t.concat(e);
    fe(r, n) || es(r, n);
  });
}
function ts(t) {
  return $(t, "tokenTypeIdx");
}
function Ii(t) {
  return $(t, "CATEGORIES");
}
function gl(t) {
  return $(t, "categoryMatches");
}
function El(t) {
  return $(t, "categoryMatchesMap");
}
function ml(t) {
  return $(t, "tokenTypeIdx");
}
var ns = {
  buildUnableToPopLexerModeMessage: function(t) {
    return "Unable to pop Lexer Mode after encountering Token ->" + t.image + "<- The Mode Stack is empty";
  },
  buildUnexpectedCharactersMessage: function(t, e, n, r, i) {
    return "unexpected character: ->" + t.charAt(e) + "<- at offset: " + e + "," + (" skipped " + n + " characters.");
  }
}, se;
(function(t) {
  t[t.MISSING_PATTERN = 0] = "MISSING_PATTERN", t[t.INVALID_PATTERN = 1] = "INVALID_PATTERN", t[t.EOI_ANCHOR_FOUND = 2] = "EOI_ANCHOR_FOUND", t[t.UNSUPPORTED_FLAGS_FOUND = 3] = "UNSUPPORTED_FLAGS_FOUND", t[t.DUPLICATE_PATTERNS_FOUND = 4] = "DUPLICATE_PATTERNS_FOUND", t[t.INVALID_GROUP_TYPE_FOUND = 5] = "INVALID_GROUP_TYPE_FOUND", t[t.PUSH_MODE_DOES_NOT_EXIST = 6] = "PUSH_MODE_DOES_NOT_EXIST", t[t.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE = 7] = "MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE", t[t.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY = 8] = "MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY", t[t.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST = 9] = "MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST", t[t.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED = 10] = "LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED", t[t.SOI_ANCHOR_FOUND = 11] = "SOI_ANCHOR_FOUND", t[t.EMPTY_MATCH_PATTERN = 12] = "EMPTY_MATCH_PATTERN", t[t.NO_LINE_BREAKS_FLAGS = 13] = "NO_LINE_BREAKS_FLAGS", t[t.UNREACHABLE_PATTERN = 14] = "UNREACHABLE_PATTERN", t[t.IDENTIFY_TERMINATOR = 15] = "IDENTIFY_TERMINATOR", t[t.CUSTOM_LINE_BREAK = 16] = "CUSTOM_LINE_BREAK";
})(se || (se = {}));
var jt = {
  deferDefinitionErrorsHandling: !1,
  positionTracking: "full",
  lineTerminatorsPattern: /\n|\r\n?/g,
  lineTerminatorCharacters: [`
`, "\r"],
  ensureOptimizations: !1,
  safeMode: !1,
  errorMessageProvider: ns,
  traceInitPerf: !1,
  skipValidations: !1
};
Object.freeze(jt);
var Xe = (
  /** @class */
  function() {
    function t(e, n) {
      var r = this;
      if (n === void 0 && (n = jt), this.lexerDefinition = e, this.lexerDefinitionErrors = [], this.lexerDefinitionWarning = [], this.patternIdxToConfig = {}, this.charCodeToPatternIdxToConfig = {}, this.modes = [], this.emptyGroups = {}, this.config = void 0, this.trackStartLines = !0, this.trackEndLines = !0, this.hasCustom = !1, this.canModeBeOptimized = {}, typeof n == "boolean")
        throw Error(`The second argument to the Lexer constructor is now an ILexerConfig Object.
a boolean 2nd argument is no longer supported`);
      this.config = Ri(jt, n);
      var i = this.config.traceInitPerf;
      i === !0 ? (this.traceInitMaxIdent = 1 / 0, this.traceInitPerf = !0) : typeof i == "number" && (this.traceInitMaxIdent = i, this.traceInitPerf = !0), this.traceInitIndent = -1, this.TRACE_INIT("Lexer Constructor", function() {
        var a, c = !0;
        r.TRACE_INIT("Lexer Config handling", function() {
          if (r.config.lineTerminatorsPattern === jt.lineTerminatorsPattern)
            r.config.lineTerminatorsPattern = ll;
          else if (r.config.lineTerminatorCharacters === jt.lineTerminatorCharacters)
            throw Error(`Error: Missing <lineTerminatorCharacters> property on the Lexer config.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#MISSING_LINE_TERM_CHARS`);
          if (n.safeMode && n.ensureOptimizations)
            throw Error('"safeMode" and "ensureOptimizations" flags are mutually exclusive.');
          r.trackStartLines = /full|onlyStart/i.test(r.config.positionTracking), r.trackEndLines = /full/i.test(r.config.positionTracking), it(e) ? (a = { modes: {} }, a.modes[Lt] = Se(e), a[Lt] = Lt) : (c = !1, a = on(e));
        }), r.config.skipValidations === !1 && (r.TRACE_INIT("performRuntimeChecks", function() {
          r.lexerDefinitionErrors = r.lexerDefinitionErrors.concat(ol(a, r.trackStartLines, r.config.lineTerminatorCharacters));
        }), r.TRACE_INIT("performWarningRuntimeChecks", function() {
          r.lexerDefinitionWarning = r.lexerDefinitionWarning.concat(sl(a, r.trackStartLines, r.config.lineTerminatorCharacters));
        })), a.modes = a.modes ? a.modes : {}, V(a.modes, function(o, s) {
          a.modes[s] = Ht(o, function(l) {
            return ht(l);
          });
        });
        var h = Qe(a.modes);
        if (V(a.modes, function(o, s) {
          r.TRACE_INIT("Mode: <" + s + "> processing", function() {
            if (r.modes.push(s), r.config.skipValidations === !1 && r.TRACE_INIT("validatePatterns", function() {
              r.lexerDefinitionErrors = r.lexerDefinitionErrors.concat(Hc(o, h));
            }), ee(r.lexerDefinitionErrors)) {
              cn(o);
              var l;
              r.TRACE_INIT("analyzeTokenTypes", function() {
                l = $c(o, {
                  lineTerminatorCharacters: r.config.lineTerminatorCharacters,
                  positionTracking: n.positionTracking,
                  ensureOptimizations: n.ensureOptimizations,
                  safeMode: n.safeMode,
                  tracer: r.TRACE_INIT.bind(r)
                });
              }), r.patternIdxToConfig[s] = l.patternIdxToConfig, r.charCodeToPatternIdxToConfig[s] = l.charCodeToPatternIdxToConfig, r.emptyGroups = Ri(r.emptyGroups, l.emptyGroups), r.hasCustom = l.hasCustom || r.hasCustom, r.canModeBeOptimized[s] = l.canBeOptimized;
            }
          });
        }), r.defaultMode = a.defaultMode, !ee(r.lexerDefinitionErrors) && !r.config.deferDefinitionErrorsHandling) {
          var p = x(r.lexerDefinitionErrors, function(o) {
            return o.message;
          }), u = p.join(`-----------------------
`);
          throw new Error(`Errors detected in definition of Lexer:
` + u);
        }
        V(r.lexerDefinitionWarning, function(o) {
          Ho(o.message);
        }), r.TRACE_INIT("Choosing sub-methods implementations", function() {
          if (Xo ? (r.chopInput = Ni, r.match = r.matchWithTest) : (r.updateLastIndex = de, r.match = r.matchWithExec), c && (r.handleModes = de), r.trackStartLines === !1 && (r.computeNewColumn = Ni), r.trackEndLines === !1 && (r.updateTokenEndLineColumnLocation = de), /full/i.test(r.config.positionTracking))
            r.createTokenInstance = r.createFullToken;
          else if (/onlyStart/i.test(r.config.positionTracking))
            r.createTokenInstance = r.createStartOnlyToken;
          else if (/onlyOffset/i.test(r.config.positionTracking))
            r.createTokenInstance = r.createOffsetOnlyToken;
          else
            throw Error('Invalid <positionTracking> config option: "' + r.config.positionTracking + '"');
          r.hasCustom ? (r.addToken = r.addTokenUsingPush, r.handlePayload = r.handlePayloadWithCustom) : (r.addToken = r.addTokenUsingMemberAccess, r.handlePayload = r.handlePayloadNoCustom);
        }), r.TRACE_INIT("Failed Optimization Warnings", function() {
          var o = Ne(r.canModeBeOptimized, function(s, l, f) {
            return l === !1 && s.push(f), s;
          }, []);
          if (n.ensureOptimizations && !ee(o))
            throw Error("Lexer Modes: < " + o.join(", ") + ` > cannot be optimized.
	 Disable the "ensureOptimizations" lexer config flag to silently ignore this and run the lexer in an un-optimized mode.
	 Or inspect the console log for details on how to resolve these issues.`);
        }), r.TRACE_INIT("clearRegExpParserCache", function() {
          Fc();
        }), r.TRACE_INIT("toFastProperties", function() {
          Wo(r);
        });
      });
    }
    return t.prototype.tokenize = function(e, n) {
      if (n === void 0 && (n = this.defaultMode), !ee(this.lexerDefinitionErrors)) {
        var r = x(this.lexerDefinitionErrors, function(c) {
          return c.message;
        }), i = r.join(`-----------------------
`);
        throw new Error(`Unable to Tokenize because Errors detected in definition of Lexer:
` + i);
      }
      var a = this.tokenizeInternal(e, n);
      return a;
    }, t.prototype.tokenizeInternal = function(e, n) {
      var r = this, i, a, c, h, p, u, o, s, l, f, v, d, g, E, A = e, m = A.length, N = 0, y = 0, R = this.hasCustom ? 0 : Math.floor(e.length / 10), T = new Array(R), w = [], C = this.trackStartLines ? 1 : void 0, M = this.trackStartLines ? 1 : void 0, _ = al(this.emptyGroups), W = this.trackStartLines, F = this.config.lineTerminatorsPattern, S = 0, G = [], J = [], le = [], tt = [];
      Object.freeze(tt);
      var Ae = void 0;
      function Be() {
        return G;
      }
      function Fe(we) {
        var Kt = Tt(we), Ft = J[Kt];
        return Ft === void 0 ? tt : Ft;
      }
      var nt = function(we) {
        if (le.length === 1 && // if we have both a POP_MODE and a PUSH_MODE this is in-fact a "transition"
        // So no error should occur.
        we.tokenType.PUSH_MODE === void 0) {
          var Kt = r.config.errorMessageProvider.buildUnableToPopLexerModeMessage(we);
          w.push({
            offset: we.startOffset,
            line: we.startLine !== void 0 ? we.startLine : void 0,
            column: we.startColumn !== void 0 ? we.startColumn : void 0,
            length: we.image.length,
            message: Kt
          });
        } else {
          le.pop();
          var Ft = Go(le);
          G = r.patternIdxToConfig[Ft], J = r.charCodeToPatternIdxToConfig[Ft], S = G.length;
          var qs = r.canModeBeOptimized[Ft] && r.config.safeMode === !1;
          J && qs ? Ae = Fe : Ae = Be;
        }
      };
      function Ee(we) {
        le.push(we), J = this.charCodeToPatternIdxToConfig[we], G = this.patternIdxToConfig[we], S = G.length, S = G.length;
        var Kt = this.canModeBeOptimized[we] && this.config.safeMode === !1;
        J && Kt ? Ae = Fe : Ae = Be;
      }
      Ee.call(this, n);
      for (var ue; N < m; ) {
        p = null;
        var gt = A.charCodeAt(N), Bt = Ae(gt), Et = Bt.length;
        for (i = 0; i < Et; i++) {
          ue = Bt[i];
          var mt = ue.pattern;
          u = null;
          var qt = ue.short;
          if (qt !== !1 ? gt === qt && (p = mt) : ue.isCustom === !0 ? (E = mt.exec(A, N, T, _), E !== null ? (p = E[0], E.payload !== void 0 && (u = E.payload)) : p = null) : (this.updateLastIndex(mt, N), p = this.match(mt, e, N)), p !== null) {
            if (h = ue.longerAlt, h !== void 0) {
              var jn = G[h], er = jn.pattern;
              o = null, jn.isCustom === !0 ? (E = er.exec(A, N, T, _), E !== null ? (c = E[0], E.payload !== void 0 && (o = E.payload)) : c = null) : (this.updateLastIndex(er, N), c = this.match(er, e, N)), c && c.length > p.length && (p = c, u = o, ue = jn);
            }
            break;
          }
        }
        if (p !== null) {
          if (s = p.length, l = ue.group, l !== void 0 && (f = ue.tokenTypeIdx, v = this.createTokenInstance(p, N, f, ue.tokenType, C, M, s), this.handlePayload(v, u), l === !1 ? y = this.addToken(T, y, v) : _[l].push(v)), e = this.chopInput(e, s), N = N + s, M = this.computeNewColumn(M, s), W === !0 && ue.canLineTerminator === !0) {
            var fn = 0, tr = void 0, nr = void 0;
            F.lastIndex = 0;
            do
              tr = F.test(p), tr === !0 && (nr = F.lastIndex - 1, fn++);
            while (tr === !0);
            fn !== 0 && (C = C + fn, M = s - nr, this.updateTokenEndLineColumnLocation(v, l, nr, fn, C, M, s));
          }
          this.handleModes(ue, nt, Ee, v);
        } else {
          for (var rr = N, ei = C, ti = M, Yt = !1; !Yt && N < m; )
            for (A.charCodeAt(N), e = this.chopInput(e, 1), N++, a = 0; a < S; a++) {
              var ir = G[a], mt = ir.pattern, qt = ir.short;
              if (qt !== !1 ? A.charCodeAt(N) === qt && (Yt = !0) : ir.isCustom === !0 ? Yt = mt.exec(A, N, T, _) !== null : (this.updateLastIndex(mt, N), Yt = mt.exec(e) !== null), Yt === !0)
                break;
            }
          d = N - rr, g = this.config.errorMessageProvider.buildUnexpectedCharactersMessage(A, rr, d, ei, ti), w.push({
            offset: rr,
            line: ei,
            column: ti,
            length: d,
            message: g
          });
        }
      }
      return this.hasCustom || (T.length = y), {
        tokens: T,
        groups: _,
        errors: w
      };
    }, t.prototype.handleModes = function(e, n, r, i) {
      if (e.pop === !0) {
        var a = e.push;
        n(i), a !== void 0 && r.call(this, a);
      } else
        e.push !== void 0 && r.call(this, e.push);
    }, t.prototype.chopInput = function(e, n) {
      return e.substring(n);
    }, t.prototype.updateLastIndex = function(e, n) {
      e.lastIndex = n;
    }, t.prototype.updateTokenEndLineColumnLocation = function(e, n, r, i, a, c, h) {
      var p, u;
      n !== void 0 && (p = r === h - 1, u = p ? -1 : 0, i === 1 && p === !0 || (e.endLine = a + u, e.endColumn = c - 1 + -u));
    }, t.prototype.computeNewColumn = function(e, n) {
      return e + n;
    }, t.prototype.createTokenInstance = function() {
      return null;
    }, t.prototype.createOffsetOnlyToken = function(e, n, r, i) {
      return {
        image: e,
        startOffset: n,
        tokenTypeIdx: r,
        tokenType: i
      };
    }, t.prototype.createStartOnlyToken = function(e, n, r, i, a, c) {
      return {
        image: e,
        startOffset: n,
        startLine: a,
        startColumn: c,
        tokenTypeIdx: r,
        tokenType: i
      };
    }, t.prototype.createFullToken = function(e, n, r, i, a, c, h) {
      return {
        image: e,
        startOffset: n,
        endOffset: n + h - 1,
        startLine: a,
        endLine: a,
        startColumn: c,
        endColumn: c + h - 1,
        tokenTypeIdx: r,
        tokenType: i
      };
    }, t.prototype.addToken = function(e, n, r) {
      return 666;
    }, t.prototype.addTokenUsingPush = function(e, n, r) {
      return e.push(r), n;
    }, t.prototype.addTokenUsingMemberAccess = function(e, n, r) {
      return e[n] = r, n++, n;
    }, t.prototype.handlePayload = function(e, n) {
    }, t.prototype.handlePayloadNoCustom = function(e, n) {
    }, t.prototype.handlePayloadWithCustom = function(e, n) {
      n !== null && (e.payload = n);
    }, t.prototype.match = function(e, n, r) {
      return null;
    }, t.prototype.matchWithTest = function(e, n, r) {
      var i = e.test(n);
      return i === !0 ? n.substring(r, e.lastIndex) : null;
    }, t.prototype.matchWithExec = function(e, n) {
      var r = e.exec(n);
      return r !== null ? r[0] : r;
    }, t.prototype.TRACE_INIT = function(e, n) {
      if (this.traceInitPerf === !0) {
        this.traceInitIndent++;
        var r = new Array(this.traceInitIndent + 1).join("	");
        this.traceInitIndent < this.traceInitMaxIdent && console.log(r + "--> <" + e + ">");
        var i = qo(n), a = i.time, c = i.value, h = a > 10 ? console.warn : console.log;
        return this.traceInitIndent < this.traceInitMaxIdent && h(r + "<-- <" + e + "> time: " + a + "ms"), this.traceInitIndent--, c;
      } else
        return n();
    }, t.SKIPPED = "This marks a skipped Token pattern, this means each token identified by it willbe consumed and then thrown into oblivion, this can be used to for example to completely ignore whitespace.", t.NA = /NOT_APPLICABLE/, t;
  }()
);
function Pt(t) {
  return rs(t) ? t.LABEL : t.name;
}
function Rl(t) {
  return t.name;
}
function rs(t) {
  return ot(t.LABEL) && t.LABEL !== "";
}
var Nl = "parent", Oi = "categories", Mi = "label", Ui = "group", Li = "push_mode", _i = "pop_mode", Pi = "longer_alt", ki = "line_breaks", xi = "start_chars_hint";
function Hr(t) {
  return Al(t);
}
function Al(t) {
  var e = t.pattern, n = {};
  if (n.name = t.name, ht(e) || (n.PATTERN = e), $(t, Nl))
    throw `The parent property is no longer supported.
See: https://github.com/chevrotain/chevrotain/issues/564#issuecomment-349062346 for details.`;
  return $(t, Oi) && (n.CATEGORIES = t[Oi]), cn([n]), $(t, Mi) && (n.LABEL = t[Mi]), $(t, Ui) && (n.GROUP = t[Ui]), $(t, _i) && (n.POP_MODE = t[_i]), $(t, Li) && (n.PUSH_MODE = t[Li]), $(t, Pi) && (n.LONGER_ALT = t[Pi]), $(t, ki) && (n.LINE_BREAKS = t[ki]), $(t, xi) && (n.START_CHARS_HINT = t[xi]), n;
}
var wt = Hr({ name: "EOF", pattern: Xe.NA });
cn([wt]);
function qn(t, e, n, r, i, a, c, h) {
  return {
    image: e,
    startOffset: n,
    endOffset: r,
    startLine: i,
    endLine: a,
    startColumn: c,
    endColumn: h,
    tokenTypeIdx: t.tokenTypeIdx,
    tokenType: t
  };
}
function yl(t, e) {
  return Wn(t, e);
}
var vt = globalThis && globalThis.__extends || function() {
  var t = function(e, n) {
    return t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, i) {
      r.__proto__ = i;
    } || function(r, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (r[a] = i[a]);
    }, t(e, n);
  };
  return function(e, n) {
    t(e, n);
    function r() {
      this.constructor = e;
    }
    e.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
  };
}(), at = (
  /** @class */
  function() {
    function t(e) {
      this._definition = e;
    }
    return Object.defineProperty(t.prototype, "definition", {
      get: function() {
        return this._definition;
      },
      set: function(e) {
        this._definition = e;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.accept = function(e) {
      e.visit(this), V(this.definition, function(n) {
        n.accept(e);
      });
    }, t;
  }()
), Ue = (
  /** @class */
  function(t) {
    vt(e, t);
    function e(n) {
      var r = t.call(this, []) || this;
      return r.idx = 1, et(r, je(n, function(i) {
        return i !== void 0;
      })), r;
    }
    return Object.defineProperty(e.prototype, "definition", {
      get: function() {
        return this.referencedRule !== void 0 ? this.referencedRule.definition : [];
      },
      set: function(n) {
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.accept = function(n) {
      n.visit(this);
    }, e;
  }(at)
), kt = (
  /** @class */
  function(t) {
    vt(e, t);
    function e(n) {
      var r = t.call(this, n.definition) || this;
      return r.orgText = "", et(r, je(n, function(i) {
        return i !== void 0;
      })), r;
    }
    return e;
  }(at)
), Te = (
  /** @class */
  function(t) {
    vt(e, t);
    function e(n) {
      var r = t.call(this, n.definition) || this;
      return r.ignoreAmbiguities = !1, et(r, je(n, function(i) {
        return i !== void 0;
      })), r;
    }
    return e;
  }(at)
), ye = (
  /** @class */
  function(t) {
    vt(e, t);
    function e(n) {
      var r = t.call(this, n.definition) || this;
      return r.idx = 1, et(r, je(n, function(i) {
        return i !== void 0;
      })), r;
    }
    return e;
  }(at)
), We = (
  /** @class */
  function(t) {
    vt(e, t);
    function e(n) {
      var r = t.call(this, n.definition) || this;
      return r.idx = 1, et(r, je(n, function(i) {
        return i !== void 0;
      })), r;
    }
    return e;
  }(at)
), qe = (
  /** @class */
  function(t) {
    vt(e, t);
    function e(n) {
      var r = t.call(this, n.definition) || this;
      return r.idx = 1, et(r, je(n, function(i) {
        return i !== void 0;
      })), r;
    }
    return e;
  }(at)
), ce = (
  /** @class */
  function(t) {
    vt(e, t);
    function e(n) {
      var r = t.call(this, n.definition) || this;
      return r.idx = 1, et(r, je(n, function(i) {
        return i !== void 0;
      })), r;
    }
    return e;
  }(at)
), Ge = (
  /** @class */
  function(t) {
    vt(e, t);
    function e(n) {
      var r = t.call(this, n.definition) || this;
      return r.idx = 1, et(r, je(n, function(i) {
        return i !== void 0;
      })), r;
    }
    return e;
  }(at)
), $e = (
  /** @class */
  function(t) {
    vt(e, t);
    function e(n) {
      var r = t.call(this, n.definition) || this;
      return r.idx = 1, r.ignoreAmbiguities = !1, r.hasPredicates = !1, et(r, je(n, function(i) {
        return i !== void 0;
      })), r;
    }
    return Object.defineProperty(e.prototype, "definition", {
      get: function() {
        return this._definition;
      },
      set: function(n) {
        this._definition = n;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(at)
), ne = (
  /** @class */
  function() {
    function t(e) {
      this.idx = 1, et(this, je(e, function(n) {
        return n !== void 0;
      }));
    }
    return t.prototype.accept = function(e) {
      e.visit(this);
    }, t;
  }()
);
function is(t) {
  return x(t, en);
}
function en(t) {
  function e(i) {
    return x(i, en);
  }
  if (t instanceof Ue)
    return {
      type: "NonTerminal",
      name: t.nonTerminalName,
      idx: t.idx
    };
  if (t instanceof Te)
    return {
      type: "Alternative",
      definition: e(t.definition)
    };
  if (t instanceof ye)
    return {
      type: "Option",
      idx: t.idx,
      definition: e(t.definition)
    };
  if (t instanceof We)
    return {
      type: "RepetitionMandatory",
      idx: t.idx,
      definition: e(t.definition)
    };
  if (t instanceof qe)
    return {
      type: "RepetitionMandatoryWithSeparator",
      idx: t.idx,
      separator: en(new ne({ terminalType: t.separator })),
      definition: e(t.definition)
    };
  if (t instanceof Ge)
    return {
      type: "RepetitionWithSeparator",
      idx: t.idx,
      separator: en(new ne({ terminalType: t.separator })),
      definition: e(t.definition)
    };
  if (t instanceof ce)
    return {
      type: "Repetition",
      idx: t.idx,
      definition: e(t.definition)
    };
  if (t instanceof $e)
    return {
      type: "Alternation",
      idx: t.idx,
      definition: e(t.definition)
    };
  if (t instanceof ne) {
    var n = {
      type: "Terminal",
      name: t.terminalType.name,
      label: Pt(t.terminalType),
      idx: t.idx
    }, r = t.terminalType.PATTERN;
    return t.terminalType.PATTERN && (n.pattern = pt(r) ? r.source : r), n;
  } else {
    if (t instanceof kt)
      return {
        type: "Rule",
        name: t.name,
        orgText: t.orgText,
        definition: e(t.definition)
      };
    throw Error("non exhaustive match");
  }
}
var Yn = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.walk = function(e, n) {
      var r = this;
      n === void 0 && (n = []), V(e.definition, function(i, a) {
        var c = Re(e.definition, a + 1);
        if (i instanceof Ue)
          r.walkProdRef(i, c, n);
        else if (i instanceof ne)
          r.walkTerminal(i, c, n);
        else if (i instanceof Te)
          r.walkFlat(i, c, n);
        else if (i instanceof ye)
          r.walkOption(i, c, n);
        else if (i instanceof We)
          r.walkAtLeastOne(i, c, n);
        else if (i instanceof qe)
          r.walkAtLeastOneSep(i, c, n);
        else if (i instanceof Ge)
          r.walkManySep(i, c, n);
        else if (i instanceof ce)
          r.walkMany(i, c, n);
        else if (i instanceof $e)
          r.walkOr(i, c, n);
        else
          throw Error("non exhaustive match");
      });
    }, t.prototype.walkTerminal = function(e, n, r) {
    }, t.prototype.walkProdRef = function(e, n, r) {
    }, t.prototype.walkFlat = function(e, n, r) {
      var i = n.concat(r);
      this.walk(e, i);
    }, t.prototype.walkOption = function(e, n, r) {
      var i = n.concat(r);
      this.walk(e, i);
    }, t.prototype.walkAtLeastOne = function(e, n, r) {
      var i = [
        new ye({ definition: e.definition })
      ].concat(n, r);
      this.walk(e, i);
    }, t.prototype.walkAtLeastOneSep = function(e, n, r) {
      var i = Si(e, n, r);
      this.walk(e, i);
    }, t.prototype.walkMany = function(e, n, r) {
      var i = [
        new ye({ definition: e.definition })
      ].concat(n, r);
      this.walk(e, i);
    }, t.prototype.walkManySep = function(e, n, r) {
      var i = Si(e, n, r);
      this.walk(e, i);
    }, t.prototype.walkOr = function(e, n, r) {
      var i = this, a = n.concat(r);
      V(e.definition, function(c) {
        var h = new Te({ definition: [c] });
        i.walk(h, a);
      });
    }, t;
  }()
);
function Si(t, e, n) {
  var r = [
    new ye({
      definition: [new ne({ terminalType: t.separator })].concat(t.definition)
    })
  ], i = r.concat(e, n);
  return i;
}
var xt = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.visit = function(e) {
      var n = e;
      switch (n.constructor) {
        case Ue:
          return this.visitNonTerminal(n);
        case Te:
          return this.visitAlternative(n);
        case ye:
          return this.visitOption(n);
        case We:
          return this.visitRepetitionMandatory(n);
        case qe:
          return this.visitRepetitionMandatoryWithSeparator(n);
        case Ge:
          return this.visitRepetitionWithSeparator(n);
        case ce:
          return this.visitRepetition(n);
        case $e:
          return this.visitAlternation(n);
        case ne:
          return this.visitTerminal(n);
        case kt:
          return this.visitRule(n);
        default:
          throw Error("non exhaustive match");
      }
    }, t.prototype.visitNonTerminal = function(e) {
    }, t.prototype.visitAlternative = function(e) {
    }, t.prototype.visitOption = function(e) {
    }, t.prototype.visitRepetition = function(e) {
    }, t.prototype.visitRepetitionMandatory = function(e) {
    }, t.prototype.visitRepetitionMandatoryWithSeparator = function(e) {
    }, t.prototype.visitRepetitionWithSeparator = function(e) {
    }, t.prototype.visitAlternation = function(e) {
    }, t.prototype.visitTerminal = function(e) {
    }, t.prototype.visitRule = function(e) {
    }, t;
  }()
), Tl = globalThis && globalThis.__extends || function() {
  var t = function(e, n) {
    return t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, i) {
      r.__proto__ = i;
    } || function(r, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (r[a] = i[a]);
    }, t(e, n);
  };
  return function(e, n) {
    t(e, n);
    function r() {
      this.constructor = e;
    }
    e.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
  };
}();
function wl(t) {
  return t instanceof Te || t instanceof ye || t instanceof ce || t instanceof We || t instanceof qe || t instanceof Ge || t instanceof ne || t instanceof kt;
}
function Bn(t, e) {
  e === void 0 && (e = []);
  var n = t instanceof ye || t instanceof ce || t instanceof Ge;
  return n ? !0 : t instanceof $e ? $o(t.definition, function(r) {
    return Bn(r, e);
  }) : t instanceof Ue && fe(e, t) ? !1 : t instanceof at ? (t instanceof Ue && e.push(t), He(t.definition, function(r) {
    return Bn(r, e);
  })) : !1;
}
function Cl(t) {
  return t instanceof $e;
}
function rt(t) {
  if (t instanceof Ue)
    return "SUBRULE";
  if (t instanceof ye)
    return "OPTION";
  if (t instanceof $e)
    return "OR";
  if (t instanceof We)
    return "AT_LEAST_ONE";
  if (t instanceof qe)
    return "AT_LEAST_ONE_SEP";
  if (t instanceof Ge)
    return "MANY_SEP";
  if (t instanceof ce)
    return "MANY";
  if (t instanceof ne)
    return "CONSUME";
  throw Error("non exhaustive match");
}
var os = (
  /** @class */
  function(t) {
    Tl(e, t);
    function e() {
      var n = t !== null && t.apply(this, arguments) || this;
      return n.separator = "-", n.dslMethods = {
        option: [],
        alternation: [],
        repetition: [],
        repetitionWithSeparator: [],
        repetitionMandatory: [],
        repetitionMandatoryWithSeparator: []
      }, n;
    }
    return e.prototype.reset = function() {
      this.dslMethods = {
        option: [],
        alternation: [],
        repetition: [],
        repetitionWithSeparator: [],
        repetitionMandatory: [],
        repetitionMandatoryWithSeparator: []
      };
    }, e.prototype.visitTerminal = function(n) {
      var r = n.terminalType.name + this.separator + "Terminal";
      $(this.dslMethods, r) || (this.dslMethods[r] = []), this.dslMethods[r].push(n);
    }, e.prototype.visitNonTerminal = function(n) {
      var r = n.nonTerminalName + this.separator + "Terminal";
      $(this.dslMethods, r) || (this.dslMethods[r] = []), this.dslMethods[r].push(n);
    }, e.prototype.visitOption = function(n) {
      this.dslMethods.option.push(n);
    }, e.prototype.visitRepetitionWithSeparator = function(n) {
      this.dslMethods.repetitionWithSeparator.push(n);
    }, e.prototype.visitRepetitionMandatory = function(n) {
      this.dslMethods.repetitionMandatory.push(n);
    }, e.prototype.visitRepetitionMandatoryWithSeparator = function(n) {
      this.dslMethods.repetitionMandatoryWithSeparator.push(n);
    }, e.prototype.visitRepetition = function(n) {
      this.dslMethods.repetition.push(n);
    }, e.prototype.visitAlternation = function(n) {
      this.dslMethods.alternation.push(n);
    }, e;
  }(xt)
), yn = new os();
function Il(t) {
  yn.reset(), t.accept(yn);
  var e = yn.dslMethods;
  return yn.reset(), e;
}
function ln(t) {
  if (t instanceof Ue)
    return ln(t.referencedRule);
  if (t instanceof ne)
    return Ul(t);
  if (wl(t))
    return Ol(t);
  if (Cl(t))
    return Ml(t);
  throw Error("non exhaustive match");
}
function Ol(t) {
  for (var e = [], n = t.definition, r = 0, i = n.length > r, a, c = !0; i && c; )
    a = n[r], c = Bn(a), e = e.concat(ln(a)), r = r + 1, i = n.length > r;
  return Dr(e);
}
function Ml(t) {
  var e = x(t.definition, function(n) {
    return ln(n);
  });
  return Dr(Ve(e));
}
function Ul(t) {
  return [t.terminalType];
}
var ss = "_~IN~_", Ll = globalThis && globalThis.__extends || function() {
  var t = function(e, n) {
    return t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, i) {
      r.__proto__ = i;
    } || function(r, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (r[a] = i[a]);
    }, t(e, n);
  };
  return function(e, n) {
    t(e, n);
    function r() {
      this.constructor = e;
    }
    e.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
  };
}(), _l = (
  /** @class */
  function(t) {
    Ll(e, t);
    function e(n) {
      var r = t.call(this) || this;
      return r.topProd = n, r.follows = {}, r;
    }
    return e.prototype.startWalking = function() {
      return this.walk(this.topProd), this.follows;
    }, e.prototype.walkTerminal = function(n, r, i) {
    }, e.prototype.walkProdRef = function(n, r, i) {
      var a = kl(n.referencedRule, n.idx) + this.topProd.name, c = r.concat(i), h = new Te({ definition: c }), p = ln(h);
      this.follows[a] = p;
    }, e;
  }(Yn)
);
function Pl(t) {
  var e = {};
  return V(t, function(n) {
    var r = new _l(n).startWalking();
    et(e, r);
  }), e;
}
function kl(t, e) {
  return t.name + e + ss;
}
var Wr = {
  buildMismatchTokenMessage: function(t) {
    var e = t.expected, n = t.actual;
    t.previous, t.ruleName;
    var r = rs(e), i = r ? "--> " + Pt(e) + " <--" : "token of type --> " + e.name + " <--", a = "Expecting " + i + " but found --> '" + n.image + "' <--";
    return a;
  },
  buildNotAllInputParsedMessage: function(t) {
    var e = t.firstRedundant;
    return t.ruleName, "Redundant input, expecting EOF but found: " + e.image;
  },
  buildNoViableAltMessage: function(t) {
    var e = t.expectedPathsPerAlt, n = t.actual;
    t.previous;
    var r = t.customUserDescription;
    t.ruleName;
    var i = "Expecting: ", a = Ze(n).image, c = `
but found: '` + a + "'";
    if (r)
      return i + r + c;
    var h = Ne(e, function(s, l) {
      return s.concat(l);
    }, []), p = x(h, function(s) {
      return "[" + x(s, function(l) {
        return Pt(l);
      }).join(", ") + "]";
    }), u = x(p, function(s, l) {
      return "  " + (l + 1) + ". " + s;
    }), o = `one of these possible Token sequences:
` + u.join(`
`);
    return i + o + c;
  },
  buildEarlyExitMessage: function(t) {
    var e = t.expectedIterationPaths, n = t.actual, r = t.customUserDescription;
    t.ruleName;
    var i = "Expecting: ", a = Ze(n).image, c = `
but found: '` + a + "'";
    if (r)
      return i + r + c;
    var h = x(e, function(u) {
      return "[" + x(u, function(o) {
        return Pt(o);
      }).join(",") + "]";
    }), p = `expecting at least one iteration which starts with one of these possible Token sequences::
  ` + ("<" + h.join(" ,") + ">");
    return i + p + c;
  }
};
Object.freeze(Wr);
var as = {
  buildRuleNotFoundError: function(t, e) {
    var n = "Invalid grammar, reference to a rule which is not defined: ->" + e.nonTerminalName + `<-
inside top level rule: ->` + t.name + "<-";
    return n;
  }
}, Kn = {
  buildDuplicateFoundError: function(t, e) {
    function n(o) {
      return o instanceof ne ? o.terminalType.name : o instanceof Ue ? o.nonTerminalName : "";
    }
    var r = t.name, i = Ze(e), a = i.idx, c = rt(i), h = n(i), p = a > 0, u = "->" + c + (p ? a : "") + "<- " + (h ? "with argument: ->" + h + "<-" : "") + `
                  appears more than once (` + e.length + " times) in the top level rule: ->" + r + `<-.                  
                  For further details see: https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES 
                  `;
    return u = u.replace(/[ \t]+/g, " "), u = u.replace(/\s\s+/g, `
`), u;
  },
  buildNamespaceConflictError: function(t) {
    var e = `Namespace conflict found in grammar.
` + ("The grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <" + t.name + `>.
`) + `To resolve this make sure each Terminal and Non-Terminal names are unique
This is easy to accomplish by using the convention that Terminal names start with an uppercase letter
and Non-Terminal names start with a lower case letter.`;
    return e;
  },
  buildAlternationPrefixAmbiguityError: function(t) {
    var e = x(t.prefixPath, function(i) {
      return Pt(i);
    }).join(", "), n = t.alternation.idx === 0 ? "" : t.alternation.idx, r = "Ambiguous alternatives: <" + t.ambiguityIndices.join(" ,") + `> due to common lookahead prefix
` + ("in <OR" + n + "> inside <" + t.topLevelRule.name + `> Rule,
`) + ("<" + e + `> may appears as a prefix path in all these alternatives.
`) + `See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX
For Further details.`;
    return r;
  },
  buildAlternationAmbiguityError: function(t) {
    var e = x(t.prefixPath, function(i) {
      return Pt(i);
    }).join(", "), n = t.alternation.idx === 0 ? "" : t.alternation.idx, r = "Ambiguous Alternatives Detected: <" + t.ambiguityIndices.join(" ,") + "> in <OR" + n + ">" + (" inside <" + t.topLevelRule.name + `> Rule,
`) + ("<" + e + `> may appears as a prefix path in all these alternatives.
`);
    return r = r + `See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`, r;
  },
  buildEmptyRepetitionError: function(t) {
    var e = rt(t.repetition);
    t.repetition.idx !== 0 && (e += t.repetition.idx);
    var n = "The repetition <" + e + "> within Rule <" + t.topLevelRule.name + `> can never consume any tokens.
This could lead to an infinite loop.`;
    return n;
  },
  // TODO: remove - `errors_public` from nyc.config.js exclude
  //       once this method is fully removed from this file
  buildTokenNameError: function(t) {
    return "deprecated";
  },
  buildEmptyAlternationError: function(t) {
    var e = "Ambiguous empty alternative: <" + (t.emptyChoiceIdx + 1) + ">" + (" in <OR" + t.alternation.idx + "> inside <" + t.topLevelRule.name + `> Rule.
`) + "Only the last alternative may be an empty alternative.";
    return e;
  },
  buildTooManyAlternativesError: function(t) {
    var e = `An Alternation cannot have more than 256 alternatives:
` + ("<OR" + t.alternation.idx + "> inside <" + t.topLevelRule.name + `> Rule.
 has ` + (t.alternation.definition.length + 1) + " alternatives.");
    return e;
  },
  buildLeftRecursionError: function(t) {
    var e = t.topLevelRule.name, n = x(t.leftRecursionPath, function(a) {
      return a.name;
    }), r = e + " --> " + n.concat([e]).join(" --> "), i = `Left Recursion found in grammar.
` + ("rule: <" + e + `> can be invoked from itself (directly or indirectly)
`) + (`without consuming any Tokens. The grammar path that causes this is: 
 ` + r + `
`) + ` To fix this refactor your grammar to remove the left recursion.
see: https://en.wikipedia.org/wiki/LL_parser#Left_Factoring.`;
    return i;
  },
  // TODO: remove - `errors_public` from nyc.config.js exclude
  //       once this method is fully removed from this file
  buildInvalidRuleNameError: function(t) {
    return "deprecated";
  },
  buildDuplicateRuleNameError: function(t) {
    var e;
    t.topLevelRule instanceof kt ? e = t.topLevelRule.name : e = t.topLevelRule;
    var n = "Duplicate definition, rule: ->" + e + "<- is already defined in the grammar: ->" + t.grammarName + "<-";
    return n;
  }
}, xl = globalThis && globalThis.__extends || function() {
  var t = function(e, n) {
    return t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, i) {
      r.__proto__ = i;
    } || function(r, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (r[a] = i[a]);
    }, t(e, n);
  };
  return function(e, n) {
    t(e, n);
    function r() {
      this.constructor = e;
    }
    e.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
  };
}();
function Sl(t, e) {
  var n = new Bl(t, e);
  return n.resolveRefs(), n.errors;
}
var Bl = (
  /** @class */
  function(t) {
    xl(e, t);
    function e(n, r) {
      var i = t.call(this) || this;
      return i.nameToTopRule = n, i.errMsgProvider = r, i.errors = [], i;
    }
    return e.prototype.resolveRefs = function() {
      var n = this;
      V(xe(this.nameToTopRule), function(r) {
        n.currTopLevel = r, r.accept(n);
      });
    }, e.prototype.visitNonTerminal = function(n) {
      var r = this.nameToTopRule[n.nonTerminalName];
      if (r)
        n.referencedRule = r;
      else {
        var i = this.errMsgProvider.buildRuleNotFoundError(this.currTopLevel, n);
        this.errors.push({
          message: i,
          type: Le.UNRESOLVED_SUBRULE_REF,
          ruleName: this.currTopLevel.name,
          unresolvedRefName: n.nonTerminalName
        });
      }
    }, e;
  }(xt)
), St = globalThis && globalThis.__extends || function() {
  var t = function(e, n) {
    return t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, i) {
      r.__proto__ = i;
    } || function(r, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (r[a] = i[a]);
    }, t(e, n);
  };
  return function(e, n) {
    t(e, n);
    function r() {
      this.constructor = e;
    }
    e.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
  };
}(), Fl = (
  /** @class */
  function(t) {
    St(e, t);
    function e(n, r) {
      var i = t.call(this) || this;
      return i.topProd = n, i.path = r, i.possibleTokTypes = [], i.nextProductionName = "", i.nextProductionOccurrence = 0, i.found = !1, i.isAtEndOfPath = !1, i;
    }
    return e.prototype.startWalking = function() {
      if (this.found = !1, this.path.ruleStack[0] !== this.topProd.name)
        throw Error("The path does not start with the walker's top Rule!");
      return this.ruleStack = Se(this.path.ruleStack).reverse(), this.occurrenceStack = Se(this.path.occurrenceStack).reverse(), this.ruleStack.pop(), this.occurrenceStack.pop(), this.updateExpectedNext(), this.walk(this.topProd), this.possibleTokTypes;
    }, e.prototype.walk = function(n, r) {
      r === void 0 && (r = []), this.found || t.prototype.walk.call(this, n, r);
    }, e.prototype.walkProdRef = function(n, r, i) {
      if (n.referencedRule.name === this.nextProductionName && n.idx === this.nextProductionOccurrence) {
        var a = r.concat(i);
        this.updateExpectedNext(), this.walk(n.referencedRule, a);
      }
    }, e.prototype.updateExpectedNext = function() {
      ee(this.ruleStack) ? (this.nextProductionName = "", this.nextProductionOccurrence = 0, this.isAtEndOfPath = !0) : (this.nextProductionName = this.ruleStack.pop(), this.nextProductionOccurrence = this.occurrenceStack.pop());
    }, e;
  }(Yn)
), bl = (
  /** @class */
  function(t) {
    St(e, t);
    function e(n, r) {
      var i = t.call(this, n, r) || this;
      return i.path = r, i.nextTerminalName = "", i.nextTerminalOccurrence = 0, i.nextTerminalName = i.path.lastTok.name, i.nextTerminalOccurrence = i.path.lastTokOccurrence, i;
    }
    return e.prototype.walkTerminal = function(n, r, i) {
      if (this.isAtEndOfPath && n.terminalType.name === this.nextTerminalName && n.idx === this.nextTerminalOccurrence && !this.found) {
        var a = r.concat(i), c = new Te({ definition: a });
        this.possibleTokTypes = ln(c), this.found = !0;
      }
    }, e;
  }(Fl)
), zn = (
  /** @class */
  function(t) {
    St(e, t);
    function e(n, r) {
      var i = t.call(this) || this;
      return i.topRule = n, i.occurrence = r, i.result = {
        token: void 0,
        occurrence: void 0,
        isEndOfRule: void 0
      }, i;
    }
    return e.prototype.startWalking = function() {
      return this.walk(this.topRule), this.result;
    }, e;
  }(Yn)
), Dl = (
  /** @class */
  function(t) {
    St(e, t);
    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }
    return e.prototype.walkMany = function(n, r, i) {
      if (n.idx === this.occurrence) {
        var a = Ze(r.concat(i));
        this.result.isEndOfRule = a === void 0, a instanceof ne && (this.result.token = a.terminalType, this.result.occurrence = a.idx);
      } else
        t.prototype.walkMany.call(this, n, r, i);
    }, e;
  }(zn)
), Bi = (
  /** @class */
  function(t) {
    St(e, t);
    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }
    return e.prototype.walkManySep = function(n, r, i) {
      if (n.idx === this.occurrence) {
        var a = Ze(r.concat(i));
        this.result.isEndOfRule = a === void 0, a instanceof ne && (this.result.token = a.terminalType, this.result.occurrence = a.idx);
      } else
        t.prototype.walkManySep.call(this, n, r, i);
    }, e;
  }(zn)
), Vl = (
  /** @class */
  function(t) {
    St(e, t);
    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }
    return e.prototype.walkAtLeastOne = function(n, r, i) {
      if (n.idx === this.occurrence) {
        var a = Ze(r.concat(i));
        this.result.isEndOfRule = a === void 0, a instanceof ne && (this.result.token = a.terminalType, this.result.occurrence = a.idx);
      } else
        t.prototype.walkAtLeastOne.call(this, n, r, i);
    }, e;
  }(zn)
), Fi = (
  /** @class */
  function(t) {
    St(e, t);
    function e() {
      return t !== null && t.apply(this, arguments) || this;
    }
    return e.prototype.walkAtLeastOneSep = function(n, r, i) {
      if (n.idx === this.occurrence) {
        var a = Ze(r.concat(i));
        this.result.isEndOfRule = a === void 0, a instanceof ne && (this.result.token = a.terminalType, this.result.occurrence = a.idx);
      } else
        t.prototype.walkAtLeastOneSep.call(this, n, r, i);
    }, e;
  }(zn)
);
function _r(t, e, n) {
  n === void 0 && (n = []), n = Se(n);
  var r = [], i = 0;
  function a(u) {
    return u.concat(Re(t, i + 1));
  }
  function c(u) {
    var o = _r(a(u), e, n);
    return r.concat(o);
  }
  for (; n.length < e && i < t.length; ) {
    var h = t[i];
    if (h instanceof Te)
      return c(h.definition);
    if (h instanceof Ue)
      return c(h.definition);
    if (h instanceof ye)
      r = c(h.definition);
    else if (h instanceof We) {
      var p = h.definition.concat([
        new ce({
          definition: h.definition
        })
      ]);
      return c(p);
    } else if (h instanceof qe) {
      var p = [
        new Te({ definition: h.definition }),
        new ce({
          definition: [new ne({ terminalType: h.separator })].concat(h.definition)
        })
      ];
      return c(p);
    } else if (h instanceof Ge) {
      var p = h.definition.concat([
        new ce({
          definition: [new ne({ terminalType: h.separator })].concat(h.definition)
        })
      ]);
      r = c(p);
    } else if (h instanceof ce) {
      var p = h.definition.concat([
        new ce({
          definition: h.definition
        })
      ]);
      r = c(p);
    } else {
      if (h instanceof $e)
        return V(h.definition, function(u) {
          ee(u.definition) === !1 && (r = c(u.definition));
        }), r;
      if (h instanceof ne)
        n.push(h.terminalType);
      else
        throw Error("non exhaustive match");
    }
    i++;
  }
  return r.push({
    partialPath: n,
    suffixDef: Re(t, i)
  }), r;
}
function cs(t, e, n, r) {
  var i = "EXIT_NONE_TERMINAL", a = [i], c = "EXIT_ALTERNATIVE", h = !1, p = e.length, u = p - r - 1, o = [], s = [];
  for (s.push({
    idx: -1,
    def: t,
    ruleStack: [],
    occurrenceStack: []
  }); !ee(s); ) {
    var l = s.pop();
    if (l === c) {
      h && Go(s).idx <= u && s.pop();
      continue;
    }
    var f = l.def, v = l.idx, d = l.ruleStack, g = l.occurrenceStack;
    if (!ee(f)) {
      var E = f[0];
      if (E === i) {
        var A = {
          idx: v,
          def: Re(f),
          ruleStack: nn(d),
          occurrenceStack: nn(g)
        };
        s.push(A);
      } else if (E instanceof ne)
        if (v < p - 1) {
          var m = v + 1, N = e[m];
          if (n(N, E.terminalType)) {
            var A = {
              idx: m,
              def: Re(f),
              ruleStack: d,
              occurrenceStack: g
            };
            s.push(A);
          }
        } else if (v === p - 1)
          o.push({
            nextTokenType: E.terminalType,
            nextTokenOccurrence: E.idx,
            ruleStack: d,
            occurrenceStack: g
          }), h = !0;
        else
          throw Error("non exhaustive match");
      else if (E instanceof Ue) {
        var y = Se(d);
        y.push(E.nonTerminalName);
        var R = Se(g);
        R.push(E.idx);
        var A = {
          idx: v,
          def: E.definition.concat(a, Re(f)),
          ruleStack: y,
          occurrenceStack: R
        };
        s.push(A);
      } else if (E instanceof ye) {
        var T = {
          idx: v,
          def: Re(f),
          ruleStack: d,
          occurrenceStack: g
        };
        s.push(T), s.push(c);
        var w = {
          idx: v,
          def: E.definition.concat(Re(f)),
          ruleStack: d,
          occurrenceStack: g
        };
        s.push(w);
      } else if (E instanceof We) {
        var C = new ce({
          definition: E.definition,
          idx: E.idx
        }), M = E.definition.concat([C], Re(f)), A = {
          idx: v,
          def: M,
          ruleStack: d,
          occurrenceStack: g
        };
        s.push(A);
      } else if (E instanceof qe) {
        var _ = new ne({
          terminalType: E.separator
        }), C = new ce({
          definition: [_].concat(E.definition),
          idx: E.idx
        }), M = E.definition.concat([C], Re(f)), A = {
          idx: v,
          def: M,
          ruleStack: d,
          occurrenceStack: g
        };
        s.push(A);
      } else if (E instanceof Ge) {
        var T = {
          idx: v,
          def: Re(f),
          ruleStack: d,
          occurrenceStack: g
        };
        s.push(T), s.push(c);
        var _ = new ne({
          terminalType: E.separator
        }), W = new ce({
          definition: [_].concat(E.definition),
          idx: E.idx
        }), M = E.definition.concat([W], Re(f)), w = {
          idx: v,
          def: M,
          ruleStack: d,
          occurrenceStack: g
        };
        s.push(w);
      } else if (E instanceof ce) {
        var T = {
          idx: v,
          def: Re(f),
          ruleStack: d,
          occurrenceStack: g
        };
        s.push(T), s.push(c);
        var W = new ce({
          definition: E.definition,
          idx: E.idx
        }), M = E.definition.concat([W], Re(f)), w = {
          idx: v,
          def: M,
          ruleStack: d,
          occurrenceStack: g
        };
        s.push(w);
      } else if (E instanceof $e)
        for (var F = E.definition.length - 1; F >= 0; F--) {
          var S = E.definition[F], G = {
            idx: v,
            def: S.definition.concat(Re(f)),
            ruleStack: d,
            occurrenceStack: g
          };
          s.push(G), s.push(c);
        }
      else if (E instanceof Te)
        s.push({
          idx: v,
          def: E.definition.concat(Re(f)),
          ruleStack: d,
          occurrenceStack: g
        });
      else if (E instanceof kt)
        s.push(Gl(E, v, d, g));
      else
        throw Error("non exhaustive match");
    }
  }
  return o;
}
function Gl(t, e, n, r) {
  var i = Se(n);
  i.push(t.name);
  var a = Se(r);
  return a.push(1), {
    idx: e,
    def: t.definition,
    ruleStack: i,
    occurrenceStack: a
  };
}
var ls = globalThis && globalThis.__extends || function() {
  var t = function(e, n) {
    return t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, i) {
      r.__proto__ = i;
    } || function(r, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (r[a] = i[a]);
    }, t(e, n);
  };
  return function(e, n) {
    t(e, n);
    function r() {
      this.constructor = e;
    }
    e.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
  };
}(), j;
(function(t) {
  t[t.OPTION = 0] = "OPTION", t[t.REPETITION = 1] = "REPETITION", t[t.REPETITION_MANDATORY = 2] = "REPETITION_MANDATORY", t[t.REPETITION_MANDATORY_WITH_SEPARATOR = 3] = "REPETITION_MANDATORY_WITH_SEPARATOR", t[t.REPETITION_WITH_SEPARATOR = 4] = "REPETITION_WITH_SEPARATOR", t[t.ALTERNATION = 5] = "ALTERNATION";
})(j || (j = {}));
function $l(t) {
  if (t instanceof ye)
    return j.OPTION;
  if (t instanceof ce)
    return j.REPETITION;
  if (t instanceof We)
    return j.REPETITION_MANDATORY;
  if (t instanceof qe)
    return j.REPETITION_MANDATORY_WITH_SEPARATOR;
  if (t instanceof Ge)
    return j.REPETITION_WITH_SEPARATOR;
  if (t instanceof $e)
    return j.ALTERNATION;
  throw Error("non exhaustive match");
}
function Hl(t, e, n, r, i, a) {
  var c = qr(t, e, n), h = hs(c) ? Sn : Wn;
  return a(c, r, h, i);
}
function Wl(t, e, n, r, i, a) {
  var c = Yr(t, e, i, n), h = hs(c) ? Sn : Wn;
  return a(c[0], h, r);
}
function ql(t, e, n, r) {
  var i = t.length, a = He(t, function(p) {
    return He(p, function(u) {
      return u.length === 1;
    });
  });
  if (e)
    return function(p) {
      for (var u = x(p, function(m) {
        return m.GATE;
      }), o = 0; o < i; o++) {
        var s = t[o], l = s.length, f = u[o];
        if (!(f !== void 0 && f.call(this) === !1))
          e:
            for (var v = 0; v < l; v++) {
              for (var d = s[v], g = d.length, E = 0; E < g; E++) {
                var A = this.LA(E + 1);
                if (n(A, d[E]) === !1)
                  continue e;
              }
              return o;
            }
      }
    };
  if (a && !r) {
    var c = x(t, function(p) {
      return Ve(p);
    }), h = Ne(c, function(p, u, o) {
      return V(u, function(s) {
        $(p, s.tokenTypeIdx) || (p[s.tokenTypeIdx] = o), V(s.categoryMatches, function(l) {
          $(p, l) || (p[l] = o);
        });
      }), p;
    }, []);
    return function() {
      var p = this.LA(1);
      return h[p.tokenTypeIdx];
    };
  } else
    return function() {
      for (var p = 0; p < i; p++) {
        var u = t[p], o = u.length;
        e:
          for (var s = 0; s < o; s++) {
            for (var l = u[s], f = l.length, v = 0; v < f; v++) {
              var d = this.LA(v + 1);
              if (n(d, l[v]) === !1)
                continue e;
            }
            return p;
          }
      }
    };
}
function Yl(t, e, n) {
  var r = He(t, function(u) {
    return u.length === 1;
  }), i = t.length;
  if (r && !n) {
    var a = Ve(t);
    if (a.length === 1 && ee(a[0].categoryMatches)) {
      var c = a[0], h = c.tokenTypeIdx;
      return function() {
        return this.LA(1).tokenTypeIdx === h;
      };
    } else {
      var p = Ne(a, function(u, o, s) {
        return u[o.tokenTypeIdx] = !0, V(o.categoryMatches, function(l) {
          u[l] = !0;
        }), u;
      }, []);
      return function() {
        var u = this.LA(1);
        return p[u.tokenTypeIdx] === !0;
      };
    }
  } else
    return function() {
      e:
        for (var u = 0; u < i; u++) {
          for (var o = t[u], s = o.length, l = 0; l < s; l++) {
            var f = this.LA(l + 1);
            if (e(f, o[l]) === !1)
              continue e;
          }
          return !0;
        }
      return !1;
    };
}
var Kl = (
  /** @class */
  function(t) {
    ls(e, t);
    function e(n, r, i) {
      var a = t.call(this) || this;
      return a.topProd = n, a.targetOccurrence = r, a.targetProdType = i, a;
    }
    return e.prototype.startWalking = function() {
      return this.walk(this.topProd), this.restDef;
    }, e.prototype.checkIsTarget = function(n, r, i, a) {
      return n.idx === this.targetOccurrence && this.targetProdType === r ? (this.restDef = i.concat(a), !0) : !1;
    }, e.prototype.walkOption = function(n, r, i) {
      this.checkIsTarget(n, j.OPTION, r, i) || t.prototype.walkOption.call(this, n, r, i);
    }, e.prototype.walkAtLeastOne = function(n, r, i) {
      this.checkIsTarget(n, j.REPETITION_MANDATORY, r, i) || t.prototype.walkOption.call(this, n, r, i);
    }, e.prototype.walkAtLeastOneSep = function(n, r, i) {
      this.checkIsTarget(n, j.REPETITION_MANDATORY_WITH_SEPARATOR, r, i) || t.prototype.walkOption.call(this, n, r, i);
    }, e.prototype.walkMany = function(n, r, i) {
      this.checkIsTarget(n, j.REPETITION, r, i) || t.prototype.walkOption.call(this, n, r, i);
    }, e.prototype.walkManySep = function(n, r, i) {
      this.checkIsTarget(n, j.REPETITION_WITH_SEPARATOR, r, i) || t.prototype.walkOption.call(this, n, r, i);
    }, e;
  }(Yn)
), us = (
  /** @class */
  function(t) {
    ls(e, t);
    function e(n, r, i) {
      var a = t.call(this) || this;
      return a.targetOccurrence = n, a.targetProdType = r, a.targetRef = i, a.result = [], a;
    }
    return e.prototype.checkIsTarget = function(n, r) {
      n.idx === this.targetOccurrence && this.targetProdType === r && (this.targetRef === void 0 || n === this.targetRef) && (this.result = n.definition);
    }, e.prototype.visitOption = function(n) {
      this.checkIsTarget(n, j.OPTION);
    }, e.prototype.visitRepetition = function(n) {
      this.checkIsTarget(n, j.REPETITION);
    }, e.prototype.visitRepetitionMandatory = function(n) {
      this.checkIsTarget(n, j.REPETITION_MANDATORY);
    }, e.prototype.visitRepetitionMandatoryWithSeparator = function(n) {
      this.checkIsTarget(n, j.REPETITION_MANDATORY_WITH_SEPARATOR);
    }, e.prototype.visitRepetitionWithSeparator = function(n) {
      this.checkIsTarget(n, j.REPETITION_WITH_SEPARATOR);
    }, e.prototype.visitAlternation = function(n) {
      this.checkIsTarget(n, j.ALTERNATION);
    }, e;
  }(xt)
);
function bi(t) {
  for (var e = new Array(t), n = 0; n < t; n++)
    e[n] = [];
  return e;
}
function Er(t) {
  for (var e = [""], n = 0; n < t.length; n++) {
    for (var r = t[n], i = [], a = 0; a < e.length; a++) {
      var c = e[a];
      i.push(c + "_" + r.tokenTypeIdx);
      for (var h = 0; h < r.categoryMatches.length; h++) {
        var p = "_" + r.categoryMatches[h];
        i.push(c + p);
      }
    }
    e = i;
  }
  return e;
}
function zl(t, e, n) {
  for (var r = 0; r < t.length; r++)
    if (r !== n)
      for (var i = t[r], a = 0; a < e.length; a++) {
        var c = e[a];
        if (i[c] === !0)
          return !1;
      }
  return !0;
}
function fs(t, e) {
  for (var n = x(t, function(o) {
    return _r([o], 1);
  }), r = bi(n.length), i = x(n, function(o) {
    var s = {};
    return V(o, function(l) {
      var f = Er(l.partialPath);
      V(f, function(v) {
        s[v] = !0;
      });
    }), s;
  }), a = n, c = 1; c <= e; c++) {
    var h = a;
    a = bi(h.length);
    for (var p = function(o) {
      for (var s = h[o], l = 0; l < s.length; l++) {
        var f = s[l].partialPath, v = s[l].suffixDef, d = Er(f), g = zl(i, d, o);
        if (g || ee(v) || f.length === e) {
          var E = r[o];
          if (Pr(E, f) === !1) {
            E.push(f);
            for (var A = 0; A < d.length; A++) {
              var m = d[A];
              i[o][m] = !0;
            }
          }
        } else {
          var N = _r(v, c + 1, f);
          a[o] = a[o].concat(N), V(N, function(y) {
            var R = Er(y.partialPath);
            V(R, function(T) {
              i[o][T] = !0;
            });
          });
        }
      }
    }, u = 0; u < h.length; u++)
      p(u);
  }
  return r;
}
function qr(t, e, n, r) {
  var i = new us(t, j.ALTERNATION, r);
  return e.accept(i), fs(i.result, n);
}
function Yr(t, e, n, r) {
  var i = new us(t, n);
  e.accept(i);
  var a = i.result, c = new Kl(e, t, n), h = c.startWalking(), p = new Te({ definition: a }), u = new Te({ definition: h });
  return fs([p, u], r);
}
function Pr(t, e) {
  e:
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      if (r.length === e.length) {
        for (var i = 0; i < r.length; i++) {
          var a = e[i], c = r[i], h = a === c || c.categoryMatchesMap[a.tokenTypeIdx] !== void 0;
          if (h === !1)
            continue e;
        }
        return !0;
      }
    }
  return !1;
}
function Xl(t, e) {
  return t.length < e.length && He(t, function(n, r) {
    var i = e[r];
    return n === i || i.categoryMatchesMap[n.tokenTypeIdx];
  });
}
function hs(t) {
  return He(t, function(e) {
    return He(e, function(n) {
      return He(n, function(r) {
        return ee(r.categoryMatches);
      });
    });
  });
}
var Kr = globalThis && globalThis.__extends || function() {
  var t = function(e, n) {
    return t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, i) {
      r.__proto__ = i;
    } || function(r, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (r[a] = i[a]);
    }, t(e, n);
  };
  return function(e, n) {
    t(e, n);
    function r() {
      this.constructor = e;
    }
    e.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
  };
}();
function Ql(t, e, n, r, i) {
  var a = x(t, function(f) {
    return Zl(f, r);
  }), c = x(t, function(f) {
    return ds(f, f, r);
  }), h = [], p = [], u = [];
  He(c, ee) && (h = x(t, function(f) {
    return nu(f, r);
  }), p = x(t, function(f) {
    return ru(f, e, r);
  }), u = su(t, e, r));
  var o = lu(t, n, r), s = x(t, function(f) {
    return ou(f, r);
  }), l = x(t, function(f) {
    return eu(f, t, i, r);
  });
  return Ve(a.concat(u, c, h, p, o, s, l));
}
function Zl(t, e) {
  var n = new jl();
  t.accept(n);
  var r = n.allProductions, i = kc(r, Jl), a = je(i, function(h) {
    return h.length > 1;
  }), c = x(xe(a), function(h) {
    var p = Ze(h), u = e.buildDuplicateFoundError(t, h), o = rt(p), s = {
      message: u,
      type: Le.DUPLICATE_PRODUCTIONS,
      ruleName: t.name,
      dslName: o,
      occurrence: p.idx
    }, l = ps(p);
    return l && (s.parameter = l), s;
  });
  return c;
}
function Jl(t) {
  return rt(t) + "_#_" + t.idx + "_#_" + ps(t);
}
function ps(t) {
  return t instanceof ne ? t.terminalType.name : t instanceof Ue ? t.nonTerminalName : "";
}
var jl = (
  /** @class */
  function(t) {
    Kr(e, t);
    function e() {
      var n = t !== null && t.apply(this, arguments) || this;
      return n.allProductions = [], n;
    }
    return e.prototype.visitNonTerminal = function(n) {
      this.allProductions.push(n);
    }, e.prototype.visitOption = function(n) {
      this.allProductions.push(n);
    }, e.prototype.visitRepetitionWithSeparator = function(n) {
      this.allProductions.push(n);
    }, e.prototype.visitRepetitionMandatory = function(n) {
      this.allProductions.push(n);
    }, e.prototype.visitRepetitionMandatoryWithSeparator = function(n) {
      this.allProductions.push(n);
    }, e.prototype.visitRepetition = function(n) {
      this.allProductions.push(n);
    }, e.prototype.visitAlternation = function(n) {
      this.allProductions.push(n);
    }, e.prototype.visitTerminal = function(n) {
      this.allProductions.push(n);
    }, e;
  }(xt)
);
function eu(t, e, n, r) {
  var i = [], a = Ne(e, function(h, p) {
    return p.name === t.name ? h + 1 : h;
  }, 0);
  if (a > 1) {
    var c = r.buildDuplicateRuleNameError({
      topLevelRule: t,
      grammarName: n
    });
    i.push({
      message: c,
      type: Le.DUPLICATE_RULE_NAME,
      ruleName: t.name
    });
  }
  return i;
}
function tu(t, e, n) {
  var r = [], i;
  return fe(e, t) || (i = "Invalid rule override, rule: ->" + t + "<- cannot be overridden in the grammar: ->" + n + "<-as it is not defined in any of the super grammars ", r.push({
    message: i,
    type: Le.INVALID_RULE_OVERRIDE,
    ruleName: t
  })), r;
}
function ds(t, e, n, r) {
  r === void 0 && (r = []);
  var i = [], a = Mn(e.definition);
  if (ee(a))
    return [];
  var c = t.name, h = fe(a, t);
  h && i.push({
    message: n.buildLeftRecursionError({
      topLevelRule: t,
      leftRecursionPath: r
    }),
    type: Le.LEFT_RECURSION,
    ruleName: c
  });
  var p = $n(a, r.concat([t])), u = x(p, function(o) {
    var s = Se(r);
    return s.push(o), ds(t, o, n, s);
  });
  return i.concat(Ve(u));
}
function Mn(t) {
  var e = [];
  if (ee(t))
    return e;
  var n = Ze(t);
  if (n instanceof Ue)
    e.push(n.referencedRule);
  else if (n instanceof Te || n instanceof ye || n instanceof We || n instanceof qe || n instanceof Ge || n instanceof ce)
    e = e.concat(Mn(n.definition));
  else if (n instanceof $e)
    e = Ve(x(n.definition, function(c) {
      return Mn(c.definition);
    }));
  else if (!(n instanceof ne))
    throw Error("non exhaustive match");
  var r = Bn(n), i = t.length > 1;
  if (r && i) {
    var a = Re(t);
    return e.concat(Mn(a));
  } else
    return e;
}
var zr = (
  /** @class */
  function(t) {
    Kr(e, t);
    function e() {
      var n = t !== null && t.apply(this, arguments) || this;
      return n.alternations = [], n;
    }
    return e.prototype.visitAlternation = function(n) {
      this.alternations.push(n);
    }, e;
  }(xt)
);
function nu(t, e) {
  var n = new zr();
  t.accept(n);
  var r = n.alternations, i = Ne(r, function(a, c) {
    var h = nn(c.definition), p = x(h, function(u, o) {
      var s = cs([u], [], null, 1);
      return ee(s) ? {
        message: e.buildEmptyAlternationError({
          topLevelRule: t,
          alternation: c,
          emptyChoiceIdx: o
        }),
        type: Le.NONE_LAST_EMPTY_ALT,
        ruleName: t.name,
        occurrence: c.idx,
        alternative: o + 1
      } : null;
    });
    return a.concat(sn(p));
  }, []);
  return i;
}
function ru(t, e, n) {
  var r = new zr();
  t.accept(r);
  var i = r.alternations;
  i = Ht(i, function(c) {
    return c.ignoreAmbiguities === !0;
  });
  var a = Ne(i, function(c, h) {
    var p = h.idx, u = h.maxLookahead || e, o = qr(p, t, u, h), s = au(o, h, t, n), l = cu(o, h, t, n);
    return c.concat(s, l);
  }, []);
  return a;
}
var iu = (
  /** @class */
  function(t) {
    Kr(e, t);
    function e() {
      var n = t !== null && t.apply(this, arguments) || this;
      return n.allProductions = [], n;
    }
    return e.prototype.visitRepetitionWithSeparator = function(n) {
      this.allProductions.push(n);
    }, e.prototype.visitRepetitionMandatory = function(n) {
      this.allProductions.push(n);
    }, e.prototype.visitRepetitionMandatoryWithSeparator = function(n) {
      this.allProductions.push(n);
    }, e.prototype.visitRepetition = function(n) {
      this.allProductions.push(n);
    }, e;
  }(xt)
);
function ou(t, e) {
  var n = new zr();
  t.accept(n);
  var r = n.alternations, i = Ne(r, function(a, c) {
    return c.definition.length > 255 && a.push({
      message: e.buildTooManyAlternativesError({
        topLevelRule: t,
        alternation: c
      }),
      type: Le.TOO_MANY_ALTS,
      ruleName: t.name,
      occurrence: c.idx
    }), a;
  }, []);
  return i;
}
function su(t, e, n) {
  var r = [];
  return V(t, function(i) {
    var a = new iu();
    i.accept(a);
    var c = a.allProductions;
    V(c, function(h) {
      var p = $l(h), u = h.maxLookahead || e, o = h.idx, s = Yr(o, i, p, u), l = s[0];
      if (ee(Ve(l))) {
        var f = n.buildEmptyRepetitionError({
          topLevelRule: i,
          repetition: h
        });
        r.push({
          message: f,
          type: Le.NO_NON_EMPTY_LOOKAHEAD,
          ruleName: i.name
        });
      }
    });
  }), r;
}
function au(t, e, n, r) {
  var i = [], a = Ne(t, function(h, p, u) {
    return e.definition[u].ignoreAmbiguities === !0 || V(p, function(o) {
      var s = [u];
      V(t, function(l, f) {
        u !== f && Pr(l, o) && // ignore (skip) ambiguities with this "other" alternative
        e.definition[f].ignoreAmbiguities !== !0 && s.push(f);
      }), s.length > 1 && !Pr(i, o) && (i.push(o), h.push({
        alts: s,
        path: o
      }));
    }), h;
  }, []), c = x(a, function(h) {
    var p = x(h.alts, function(o) {
      return o + 1;
    }), u = r.buildAlternationAmbiguityError({
      topLevelRule: n,
      alternation: e,
      ambiguityIndices: p,
      prefixPath: h.path
    });
    return {
      message: u,
      type: Le.AMBIGUOUS_ALTS,
      ruleName: n.name,
      occurrence: e.idx,
      alternatives: [h.alts]
    };
  });
  return c;
}
function cu(t, e, n, r) {
  var i = [], a = Ne(t, function(c, h, p) {
    var u = x(h, function(o) {
      return { idx: p, path: o };
    });
    return c.concat(u);
  }, []);
  return V(a, function(c) {
    var h = e.definition[c.idx];
    if (h.ignoreAmbiguities !== !0) {
      var p = c.idx, u = c.path, o = Lc(a, function(l) {
        return (
          // ignore (skip) ambiguities with this "other" alternative
          e.definition[l.idx].ignoreAmbiguities !== !0 && l.idx < p && // checking for strict prefix because identical lookaheads
          // will be be detected using a different validation.
          Xl(l.path, u)
        );
      }), s = x(o, function(l) {
        var f = [l.idx + 1, p + 1], v = e.idx === 0 ? "" : e.idx, d = r.buildAlternationPrefixAmbiguityError({
          topLevelRule: n,
          alternation: e,
          ambiguityIndices: f,
          prefixPath: l.path
        });
        return {
          message: d,
          type: Le.AMBIGUOUS_PREFIX_ALTS,
          ruleName: n.name,
          occurrence: v,
          alternatives: f
        };
      });
      i = i.concat(s);
    }
  }), i;
}
function lu(t, e, n) {
  var r = [], i = x(e, function(a) {
    return a.name;
  });
  return V(t, function(a) {
    var c = a.name;
    if (fe(i, c)) {
      var h = n.buildNamespaceConflictError(a);
      r.push({
        message: h,
        type: Le.CONFLICT_TOKENS_RULES_NAMESPACE,
        ruleName: c
      });
    }
  }), r;
}
function vs(t) {
  t = Gr(t, {
    errMsgProvider: as
  });
  var e = {};
  return V(t.rules, function(n) {
    e[n.name] = n;
  }), Sl(e, t.errMsgProvider);
}
function gs(t) {
  return t = Gr(t, {
    errMsgProvider: Kn
  }), Ql(t.rules, t.maxLookahead, t.tokenTypes, t.errMsgProvider, t.grammarName);
}
function uu(t) {
  V(t.rules, function(e) {
    var n = new os();
    e.accept(n), V(n.dslMethods, function(r) {
      V(r, function(i, a) {
        i.idx = a + 1;
      });
    });
  });
}
var un = globalThis && globalThis.__extends || function() {
  var t = function(e, n) {
    return t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, i) {
      r.__proto__ = i;
    } || function(r, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (r[a] = i[a]);
    }, t(e, n);
  };
  return function(e, n) {
    t(e, n);
    function r() {
      this.constructor = e;
    }
    e.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
  };
}(), Es = "MismatchedTokenException", ms = "NoViableAltException", Rs = "EarlyExitException", Ns = "NotAllInputParsedException", As = [
  Es,
  ms,
  Rs,
  Ns
];
Object.freeze(As);
function rn(t) {
  return fe(As, t.name);
}
var Xn = (
  /** @class */
  function(t) {
    un(e, t);
    function e(n, r) {
      var i = this.constructor, a = t.call(this, n) || this;
      return a.token = r, a.resyncedTokens = [], Object.setPrototypeOf(a, i.prototype), Error.captureStackTrace && Error.captureStackTrace(a, a.constructor), a;
    }
    return e;
  }(Error)
), Xr = (
  /** @class */
  function(t) {
    un(e, t);
    function e(n, r, i) {
      var a = t.call(this, n, r) || this;
      return a.previousToken = i, a.name = Es, a;
    }
    return e;
  }(Xn)
), ys = (
  /** @class */
  function(t) {
    un(e, t);
    function e(n, r, i) {
      var a = t.call(this, n, r) || this;
      return a.previousToken = i, a.name = ms, a;
    }
    return e;
  }(Xn)
), Ts = (
  /** @class */
  function(t) {
    un(e, t);
    function e(n, r) {
      var i = t.call(this, n, r) || this;
      return i.name = Ns, i;
    }
    return e;
  }(Xn)
), ws = (
  /** @class */
  function(t) {
    un(e, t);
    function e(n, r, i) {
      var a = t.call(this, n, r) || this;
      return a.previousToken = i, a.name = Rs, a;
    }
    return e;
  }(Xn)
), mr = {}, Cs = "InRuleRecoveryException";
function Is(t) {
  this.name = Cs, this.message = t;
}
Is.prototype = Error.prototype;
var fu = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.initRecoverable = function(e) {
      this.firstAfterRepMap = {}, this.resyncFollows = {}, this.recoveryEnabled = $(e, "recoveryEnabled") ? e.recoveryEnabled : dt.recoveryEnabled, this.recoveryEnabled && (this.attemptInRepetitionRecovery = hu);
    }, t.prototype.getTokenToInsert = function(e) {
      var n = qn(e, "", NaN, NaN, NaN, NaN, NaN, NaN);
      return n.isInsertedInRecovery = !0, n;
    }, t.prototype.canTokenTypeBeInsertedInRecovery = function(e) {
      return !0;
    }, t.prototype.tryInRepetitionRecovery = function(e, n, r, i) {
      for (var a = this, c = this.findReSyncTokenType(), h = this.exportLexerState(), p = [], u = !1, o = this.LA(1), s = this.LA(1), l = function() {
        var f = a.LA(0), v = a.errorMessageProvider.buildMismatchTokenMessage({
          expected: i,
          actual: o,
          previous: f,
          ruleName: a.getCurrRuleFullName()
        }), d = new Xr(v, o, a.LA(0));
        d.resyncedTokens = nn(p), a.SAVE_ERROR(d);
      }; !u; )
        if (this.tokenMatcher(s, i)) {
          l();
          return;
        } else if (r.call(this)) {
          l(), e.apply(this, n);
          return;
        } else
          this.tokenMatcher(s, c) ? u = !0 : (s = this.SKIP_TOKEN(), this.addToResyncTokens(s, p));
      this.importLexerState(h);
    }, t.prototype.shouldInRepetitionRecoveryBeTried = function(e, n, r) {
      return !(r === !1 || e === void 0 || n === void 0 || this.tokenMatcher(this.LA(1), e) || this.isBackTracking() || this.canPerformInRuleRecovery(e, this.getFollowsForInRuleRecovery(e, n)));
    }, t.prototype.getFollowsForInRuleRecovery = function(e, n) {
      var r = this.getCurrentGrammarPath(e, n), i = this.getNextPossibleTokenTypes(r);
      return i;
    }, t.prototype.tryInRuleRecovery = function(e, n) {
      if (this.canRecoverWithSingleTokenInsertion(e, n)) {
        var r = this.getTokenToInsert(e);
        return r;
      }
      if (this.canRecoverWithSingleTokenDeletion(e)) {
        var i = this.SKIP_TOKEN();
        return this.consumeToken(), i;
      }
      throw new Is("sad sad panda");
    }, t.prototype.canPerformInRuleRecovery = function(e, n) {
      return this.canRecoverWithSingleTokenInsertion(e, n) || this.canRecoverWithSingleTokenDeletion(e);
    }, t.prototype.canRecoverWithSingleTokenInsertion = function(e, n) {
      var r = this;
      if (!this.canTokenTypeBeInsertedInRecovery(e) || ee(n))
        return !1;
      var i = this.LA(1), a = $t(n, function(c) {
        return r.tokenMatcher(i, c);
      }) !== void 0;
      return a;
    }, t.prototype.canRecoverWithSingleTokenDeletion = function(e) {
      var n = this.tokenMatcher(this.LA(2), e);
      return n;
    }, t.prototype.isInCurrentRuleReSyncSet = function(e) {
      var n = this.getCurrFollowKey(), r = this.getFollowSetFromFollowKey(n);
      return fe(r, e);
    }, t.prototype.findReSyncTokenType = function() {
      for (var e = this.flattenFollowSet(), n = this.LA(1), r = 2; ; ) {
        var i = n.tokenType;
        if (fe(e, i))
          return i;
        n = this.LA(r), r++;
      }
    }, t.prototype.getCurrFollowKey = function() {
      if (this.RULE_STACK.length === 1)
        return mr;
      var e = this.getLastExplicitRuleShortName(), n = this.getLastExplicitRuleOccurrenceIndex(), r = this.getPreviousExplicitRuleShortName();
      return {
        ruleName: this.shortRuleNameToFullName(e),
        idxInCallingRule: n,
        inRule: this.shortRuleNameToFullName(r)
      };
    }, t.prototype.buildFullFollowKeyStack = function() {
      var e = this, n = this.RULE_STACK, r = this.RULE_OCCURRENCE_STACK;
      return x(n, function(i, a) {
        return a === 0 ? mr : {
          ruleName: e.shortRuleNameToFullName(i),
          idxInCallingRule: r[a],
          inRule: e.shortRuleNameToFullName(n[a - 1])
        };
      });
    }, t.prototype.flattenFollowSet = function() {
      var e = this, n = x(this.buildFullFollowKeyStack(), function(r) {
        return e.getFollowSetFromFollowKey(r);
      });
      return Ve(n);
    }, t.prototype.getFollowSetFromFollowKey = function(e) {
      if (e === mr)
        return [wt];
      var n = e.ruleName + e.idxInCallingRule + ss + e.inRule;
      return this.resyncFollows[n];
    }, t.prototype.addToResyncTokens = function(e, n) {
      return this.tokenMatcher(e, wt) || n.push(e), n;
    }, t.prototype.reSyncTo = function(e) {
      for (var n = [], r = this.LA(1); this.tokenMatcher(r, e) === !1; )
        r = this.SKIP_TOKEN(), this.addToResyncTokens(r, n);
      return nn(n);
    }, t.prototype.attemptInRepetitionRecovery = function(e, n, r, i, a, c, h) {
    }, t.prototype.getCurrentGrammarPath = function(e, n) {
      var r = this.getHumanReadableRuleStack(), i = Se(this.RULE_OCCURRENCE_STACK), a = {
        ruleStack: r,
        occurrenceStack: i,
        lastTok: e,
        lastTokOccurrence: n
      };
      return a;
    }, t.prototype.getHumanReadableRuleStack = function() {
      var e = this;
      return x(this.RULE_STACK, function(n) {
        return e.shortRuleNameToFullName(n);
      });
    }, t;
  }()
);
function hu(t, e, n, r, i, a, c) {
  var h = this.getKeyForAutomaticLookahead(r, i), p = this.firstAfterRepMap[h];
  if (p === void 0) {
    var u = this.getCurrRuleFullName(), o = this.getGAstProductions()[u], s = new a(o, i);
    p = s.startWalking(), this.firstAfterRepMap[h] = p;
  }
  var l = p.token, f = p.occurrence, v = p.isEndOfRule;
  this.RULE_STACK.length === 1 && v && l === void 0 && (l = wt, f = 1), this.shouldInRepetitionRecoveryBeTried(l, f, c) && this.tryInRepetitionRecovery(t, e, n, l);
}
var pu = 4, It = 8, Os = 1 << It, Ms = 2 << It, kr = 3 << It, xr = 4 << It, Sr = 5 << It, Un = 6 << It;
function Rr(t, e, n) {
  return n | e | t;
}
var du = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.initLooksAhead = function(e) {
      this.dynamicTokensEnabled = $(e, "dynamicTokensEnabled") ? e.dynamicTokensEnabled : dt.dynamicTokensEnabled, this.maxLookahead = $(e, "maxLookahead") ? e.maxLookahead : dt.maxLookahead, this.lookAheadFuncsCache = Ai() ? /* @__PURE__ */ new Map() : [], Ai() ? (this.getLaFuncFromCache = this.getLaFuncFromMap, this.setLaFuncCache = this.setLaFuncCacheUsingMap) : (this.getLaFuncFromCache = this.getLaFuncFromObj, this.setLaFuncCache = this.setLaFuncUsingObj);
    }, t.prototype.preComputeLookaheadFunctions = function(e) {
      var n = this;
      V(e, function(r) {
        n.TRACE_INIT(r.name + " Rule Lookahead", function() {
          var i = Il(r), a = i.alternation, c = i.repetition, h = i.option, p = i.repetitionMandatory, u = i.repetitionMandatoryWithSeparator, o = i.repetitionWithSeparator;
          V(a, function(s) {
            var l = s.idx === 0 ? "" : s.idx;
            n.TRACE_INIT("" + rt(s) + l, function() {
              var f = Hl(s.idx, r, s.maxLookahead || n.maxLookahead, s.hasPredicates, n.dynamicTokensEnabled, n.lookAheadBuilderForAlternatives), v = Rr(n.fullRuleNameToShort[r.name], Os, s.idx);
              n.setLaFuncCache(v, f);
            });
          }), V(c, function(s) {
            n.computeLookaheadFunc(r, s.idx, kr, j.REPETITION, s.maxLookahead, rt(s));
          }), V(h, function(s) {
            n.computeLookaheadFunc(r, s.idx, Ms, j.OPTION, s.maxLookahead, rt(s));
          }), V(p, function(s) {
            n.computeLookaheadFunc(r, s.idx, xr, j.REPETITION_MANDATORY, s.maxLookahead, rt(s));
          }), V(u, function(s) {
            n.computeLookaheadFunc(r, s.idx, Un, j.REPETITION_MANDATORY_WITH_SEPARATOR, s.maxLookahead, rt(s));
          }), V(o, function(s) {
            n.computeLookaheadFunc(r, s.idx, Sr, j.REPETITION_WITH_SEPARATOR, s.maxLookahead, rt(s));
          });
        });
      });
    }, t.prototype.computeLookaheadFunc = function(e, n, r, i, a, c) {
      var h = this;
      this.TRACE_INIT("" + c + (n === 0 ? "" : n), function() {
        var p = Wl(n, e, a || h.maxLookahead, h.dynamicTokensEnabled, i, h.lookAheadBuilderForOptional), u = Rr(h.fullRuleNameToShort[e.name], r, n);
        h.setLaFuncCache(u, p);
      });
    }, t.prototype.lookAheadBuilderForOptional = function(e, n, r) {
      return Yl(e, n, r);
    }, t.prototype.lookAheadBuilderForAlternatives = function(e, n, r, i) {
      return ql(e, n, r, i);
    }, t.prototype.getKeyForAutomaticLookahead = function(e, n) {
      var r = this.getLastExplicitRuleShortName();
      return Rr(r, e, n);
    }, t.prototype.getLaFuncFromCache = function(e) {
    }, t.prototype.getLaFuncFromMap = function(e) {
      return this.lookAheadFuncsCache.get(e);
    }, t.prototype.getLaFuncFromObj = function(e) {
      return this.lookAheadFuncsCache[e];
    }, t.prototype.setLaFuncCache = function(e, n) {
    }, t.prototype.setLaFuncCacheUsingMap = function(e, n) {
      this.lookAheadFuncsCache.set(e, n);
    }, t.prototype.setLaFuncUsingObj = function(e, n) {
      this.lookAheadFuncsCache[e] = n;
    }, t;
  }()
);
function Di(t, e) {
  isNaN(t.startOffset) === !0 ? (t.startOffset = e.startOffset, t.endOffset = e.endOffset) : t.endOffset < e.endOffset && (t.endOffset = e.endOffset);
}
function Vi(t, e) {
  isNaN(t.startOffset) === !0 ? (t.startOffset = e.startOffset, t.startColumn = e.startColumn, t.startLine = e.startLine, t.endOffset = e.endOffset, t.endColumn = e.endColumn, t.endLine = e.endLine) : t.endOffset < e.endOffset && (t.endOffset = e.endOffset, t.endColumn = e.endColumn, t.endLine = e.endLine);
}
function vu(t, e, n) {
  t.children[n] === void 0 ? t.children[n] = [e] : t.children[n].push(e);
}
function gu(t, e, n) {
  t.children[e] === void 0 ? t.children[e] = [n] : t.children[e].push(n);
}
function Eu(t) {
  return Qn(t.constructor);
}
var Gi = "name";
function Qn(t) {
  var e = t.name;
  return e || "anonymous";
}
function Us(t, e) {
  var n = Object.getOwnPropertyDescriptor(t, Gi);
  return ht(n) || n.configurable ? (Object.defineProperty(t, Gi, {
    enumerable: !1,
    configurable: !0,
    writable: !1,
    value: e
  }), !0) : !1;
}
function mu(t, e) {
  for (var n = Qe(t), r = n.length, i = 0; i < r; i++)
    for (var a = n[i], c = t[a], h = c.length, p = 0; p < h; p++) {
      var u = c[p];
      u.tokenTypeIdx === void 0 && this[u.name](u.children, e);
    }
}
function Ru(t, e) {
  var n = function() {
  };
  Us(n, t + "BaseSemantics");
  var r = {
    visit: function(i, a) {
      if (it(i) && (i = i[0]), !ht(i))
        return this[i.name](i.children, a);
    },
    validateVisitor: function() {
      var i = Au(this, e);
      if (!ee(i)) {
        var a = x(i, function(c) {
          return c.msg;
        });
        throw Error("Errors Detected in CST Visitor <" + Qn(this.constructor) + `>:
	` + ("" + a.join(`

`).replace(/\n/g, `
	`)));
      }
    }
  };
  return n.prototype = r, n.prototype.constructor = n, n._RULE_NAMES = e, n;
}
function Nu(t, e, n) {
  var r = function() {
  };
  Us(r, t + "BaseSemanticsWithDefaults");
  var i = Object.create(n.prototype);
  return V(e, function(a) {
    i[a] = mu;
  }), r.prototype = i, r.prototype.constructor = r, r;
}
var Fn;
(function(t) {
  t[t.REDUNDANT_METHOD = 0] = "REDUNDANT_METHOD", t[t.MISSING_METHOD = 1] = "MISSING_METHOD";
})(Fn || (Fn = {}));
function Au(t, e) {
  var n = yu(t, e), r = wu(t, e);
  return n.concat(r);
}
function yu(t, e) {
  var n = x(e, function(r) {
    if (!Ct(t[r]))
      return {
        msg: "Missing visitor method: <" + r + "> on " + Qn(t.constructor) + " CST Visitor.",
        type: Fn.MISSING_METHOD,
        methodName: r
      };
  });
  return sn(n);
}
var Tu = ["constructor", "visit", "validateVisitor"];
function wu(t, e) {
  var n = [];
  for (var r in t)
    Ct(t[r]) && !fe(Tu, r) && !fe(e, r) && n.push({
      msg: "Redundant visitor method: <" + r + "> on " + Qn(t.constructor) + ` CST Visitor
There is no Grammar Rule corresponding to this method's name.
`,
      type: Fn.REDUNDANT_METHOD,
      methodName: r
    });
  return n;
}
var Cu = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.initTreeBuilder = function(e) {
      if (this.CST_STACK = [], this.outputCst = e.outputCst, this.nodeLocationTracking = $(e, "nodeLocationTracking") ? e.nodeLocationTracking : dt.nodeLocationTracking, !this.outputCst)
        this.cstInvocationStateUpdate = de, this.cstFinallyStateUpdate = de, this.cstPostTerminal = de, this.cstPostNonTerminal = de, this.cstPostRule = de;
      else if (/full/i.test(this.nodeLocationTracking))
        this.recoveryEnabled ? (this.setNodeLocationFromToken = Vi, this.setNodeLocationFromNode = Vi, this.cstPostRule = de, this.setInitialNodeLocation = this.setInitialNodeLocationFullRecovery) : (this.setNodeLocationFromToken = de, this.setNodeLocationFromNode = de, this.cstPostRule = this.cstPostRuleFull, this.setInitialNodeLocation = this.setInitialNodeLocationFullRegular);
      else if (/onlyOffset/i.test(this.nodeLocationTracking))
        this.recoveryEnabled ? (this.setNodeLocationFromToken = Di, this.setNodeLocationFromNode = Di, this.cstPostRule = de, this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRecovery) : (this.setNodeLocationFromToken = de, this.setNodeLocationFromNode = de, this.cstPostRule = this.cstPostRuleOnlyOffset, this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRegular);
      else if (/none/i.test(this.nodeLocationTracking))
        this.setNodeLocationFromToken = de, this.setNodeLocationFromNode = de, this.cstPostRule = de, this.setInitialNodeLocation = de;
      else
        throw Error('Invalid <nodeLocationTracking> config option: "' + e.nodeLocationTracking + '"');
    }, t.prototype.setInitialNodeLocationOnlyOffsetRecovery = function(e) {
      e.location = {
        startOffset: NaN,
        endOffset: NaN
      };
    }, t.prototype.setInitialNodeLocationOnlyOffsetRegular = function(e) {
      e.location = {
        // without error recovery the starting Location of a new CstNode is guaranteed
        // To be the next Token's startOffset (for valid inputs).
        // For invalid inputs there won't be any CSTOutput so this potential
        // inaccuracy does not matter
        startOffset: this.LA(1).startOffset,
        endOffset: NaN
      };
    }, t.prototype.setInitialNodeLocationFullRecovery = function(e) {
      e.location = {
        startOffset: NaN,
        startLine: NaN,
        startColumn: NaN,
        endOffset: NaN,
        endLine: NaN,
        endColumn: NaN
      };
    }, t.prototype.setInitialNodeLocationFullRegular = function(e) {
      var n = this.LA(1);
      e.location = {
        startOffset: n.startOffset,
        startLine: n.startLine,
        startColumn: n.startColumn,
        endOffset: NaN,
        endLine: NaN,
        endColumn: NaN
      };
    }, t.prototype.cstInvocationStateUpdate = function(e, n) {
      var r = {
        name: e,
        children: {}
      };
      this.setInitialNodeLocation(r), this.CST_STACK.push(r);
    }, t.prototype.cstFinallyStateUpdate = function() {
      this.CST_STACK.pop();
    }, t.prototype.cstPostRuleFull = function(e) {
      var n = this.LA(0), r = e.location;
      r.startOffset <= n.startOffset ? (r.endOffset = n.endOffset, r.endLine = n.endLine, r.endColumn = n.endColumn) : (r.startOffset = NaN, r.startLine = NaN, r.startColumn = NaN);
    }, t.prototype.cstPostRuleOnlyOffset = function(e) {
      var n = this.LA(0), r = e.location;
      r.startOffset <= n.startOffset ? r.endOffset = n.endOffset : r.startOffset = NaN;
    }, t.prototype.cstPostTerminal = function(e, n) {
      var r = this.CST_STACK[this.CST_STACK.length - 1];
      vu(r, n, e), this.setNodeLocationFromToken(r.location, n);
    }, t.prototype.cstPostNonTerminal = function(e, n) {
      var r = this.CST_STACK[this.CST_STACK.length - 1];
      gu(r, n, e), this.setNodeLocationFromNode(r.location, e.location);
    }, t.prototype.getBaseCstVisitorConstructor = function() {
      if (ht(this.baseCstVisitorConstructor)) {
        var e = Ru(this.className, Qe(this.gastProductionsCache));
        return this.baseCstVisitorConstructor = e, e;
      }
      return this.baseCstVisitorConstructor;
    }, t.prototype.getBaseCstVisitorConstructorWithDefaults = function() {
      if (ht(this.baseCstVisitorWithDefaultsConstructor)) {
        var e = Nu(this.className, Qe(this.gastProductionsCache), this.getBaseCstVisitorConstructor());
        return this.baseCstVisitorWithDefaultsConstructor = e, e;
      }
      return this.baseCstVisitorWithDefaultsConstructor;
    }, t.prototype.getLastExplicitRuleShortName = function() {
      var e = this.RULE_STACK;
      return e[e.length - 1];
    }, t.prototype.getPreviousExplicitRuleShortName = function() {
      var e = this.RULE_STACK;
      return e[e.length - 2];
    }, t.prototype.getLastExplicitRuleOccurrenceIndex = function() {
      var e = this.RULE_OCCURRENCE_STACK;
      return e[e.length - 1];
    }, t;
  }()
), Iu = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.initLexerAdapter = function() {
      this.tokVector = [], this.tokVectorLength = 0, this.currIdx = -1;
    }, Object.defineProperty(t.prototype, "input", {
      get: function() {
        return this.tokVector;
      },
      set: function(e) {
        if (this.selfAnalysisDone !== !0)
          throw Error("Missing <performSelfAnalysis> invocation at the end of the Parser's constructor.");
        this.reset(), this.tokVector = e, this.tokVectorLength = e.length;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.SKIP_TOKEN = function() {
      return this.currIdx <= this.tokVector.length - 2 ? (this.consumeToken(), this.LA(1)) : Dn;
    }, t.prototype.LA = function(e) {
      var n = this.currIdx + e;
      return n < 0 || this.tokVectorLength <= n ? Dn : this.tokVector[n];
    }, t.prototype.consumeToken = function() {
      this.currIdx++;
    }, t.prototype.exportLexerState = function() {
      return this.currIdx;
    }, t.prototype.importLexerState = function(e) {
      this.currIdx = e;
    }, t.prototype.resetLexerState = function() {
      this.currIdx = -1;
    }, t.prototype.moveToTerminatedState = function() {
      this.currIdx = this.tokVector.length - 1;
    }, t.prototype.getLexerPosition = function() {
      return this.exportLexerState();
    }, t;
  }()
), Ou = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.ACTION = function(e) {
      return e.call(this);
    }, t.prototype.consume = function(e, n, r) {
      return this.consumeInternal(n, e, r);
    }, t.prototype.subrule = function(e, n, r) {
      return this.subruleInternal(n, e, r);
    }, t.prototype.option = function(e, n) {
      return this.optionInternal(n, e);
    }, t.prototype.or = function(e, n) {
      return this.orInternal(n, e);
    }, t.prototype.many = function(e, n) {
      return this.manyInternal(e, n);
    }, t.prototype.atLeastOne = function(e, n) {
      return this.atLeastOneInternal(e, n);
    }, t.prototype.CONSUME = function(e, n) {
      return this.consumeInternal(e, 0, n);
    }, t.prototype.CONSUME1 = function(e, n) {
      return this.consumeInternal(e, 1, n);
    }, t.prototype.CONSUME2 = function(e, n) {
      return this.consumeInternal(e, 2, n);
    }, t.prototype.CONSUME3 = function(e, n) {
      return this.consumeInternal(e, 3, n);
    }, t.prototype.CONSUME4 = function(e, n) {
      return this.consumeInternal(e, 4, n);
    }, t.prototype.CONSUME5 = function(e, n) {
      return this.consumeInternal(e, 5, n);
    }, t.prototype.CONSUME6 = function(e, n) {
      return this.consumeInternal(e, 6, n);
    }, t.prototype.CONSUME7 = function(e, n) {
      return this.consumeInternal(e, 7, n);
    }, t.prototype.CONSUME8 = function(e, n) {
      return this.consumeInternal(e, 8, n);
    }, t.prototype.CONSUME9 = function(e, n) {
      return this.consumeInternal(e, 9, n);
    }, t.prototype.SUBRULE = function(e, n) {
      return this.subruleInternal(e, 0, n);
    }, t.prototype.SUBRULE1 = function(e, n) {
      return this.subruleInternal(e, 1, n);
    }, t.prototype.SUBRULE2 = function(e, n) {
      return this.subruleInternal(e, 2, n);
    }, t.prototype.SUBRULE3 = function(e, n) {
      return this.subruleInternal(e, 3, n);
    }, t.prototype.SUBRULE4 = function(e, n) {
      return this.subruleInternal(e, 4, n);
    }, t.prototype.SUBRULE5 = function(e, n) {
      return this.subruleInternal(e, 5, n);
    }, t.prototype.SUBRULE6 = function(e, n) {
      return this.subruleInternal(e, 6, n);
    }, t.prototype.SUBRULE7 = function(e, n) {
      return this.subruleInternal(e, 7, n);
    }, t.prototype.SUBRULE8 = function(e, n) {
      return this.subruleInternal(e, 8, n);
    }, t.prototype.SUBRULE9 = function(e, n) {
      return this.subruleInternal(e, 9, n);
    }, t.prototype.OPTION = function(e) {
      return this.optionInternal(e, 0);
    }, t.prototype.OPTION1 = function(e) {
      return this.optionInternal(e, 1);
    }, t.prototype.OPTION2 = function(e) {
      return this.optionInternal(e, 2);
    }, t.prototype.OPTION3 = function(e) {
      return this.optionInternal(e, 3);
    }, t.prototype.OPTION4 = function(e) {
      return this.optionInternal(e, 4);
    }, t.prototype.OPTION5 = function(e) {
      return this.optionInternal(e, 5);
    }, t.prototype.OPTION6 = function(e) {
      return this.optionInternal(e, 6);
    }, t.prototype.OPTION7 = function(e) {
      return this.optionInternal(e, 7);
    }, t.prototype.OPTION8 = function(e) {
      return this.optionInternal(e, 8);
    }, t.prototype.OPTION9 = function(e) {
      return this.optionInternal(e, 9);
    }, t.prototype.OR = function(e) {
      return this.orInternal(e, 0);
    }, t.prototype.OR1 = function(e) {
      return this.orInternal(e, 1);
    }, t.prototype.OR2 = function(e) {
      return this.orInternal(e, 2);
    }, t.prototype.OR3 = function(e) {
      return this.orInternal(e, 3);
    }, t.prototype.OR4 = function(e) {
      return this.orInternal(e, 4);
    }, t.prototype.OR5 = function(e) {
      return this.orInternal(e, 5);
    }, t.prototype.OR6 = function(e) {
      return this.orInternal(e, 6);
    }, t.prototype.OR7 = function(e) {
      return this.orInternal(e, 7);
    }, t.prototype.OR8 = function(e) {
      return this.orInternal(e, 8);
    }, t.prototype.OR9 = function(e) {
      return this.orInternal(e, 9);
    }, t.prototype.MANY = function(e) {
      this.manyInternal(0, e);
    }, t.prototype.MANY1 = function(e) {
      this.manyInternal(1, e);
    }, t.prototype.MANY2 = function(e) {
      this.manyInternal(2, e);
    }, t.prototype.MANY3 = function(e) {
      this.manyInternal(3, e);
    }, t.prototype.MANY4 = function(e) {
      this.manyInternal(4, e);
    }, t.prototype.MANY5 = function(e) {
      this.manyInternal(5, e);
    }, t.prototype.MANY6 = function(e) {
      this.manyInternal(6, e);
    }, t.prototype.MANY7 = function(e) {
      this.manyInternal(7, e);
    }, t.prototype.MANY8 = function(e) {
      this.manyInternal(8, e);
    }, t.prototype.MANY9 = function(e) {
      this.manyInternal(9, e);
    }, t.prototype.MANY_SEP = function(e) {
      this.manySepFirstInternal(0, e);
    }, t.prototype.MANY_SEP1 = function(e) {
      this.manySepFirstInternal(1, e);
    }, t.prototype.MANY_SEP2 = function(e) {
      this.manySepFirstInternal(2, e);
    }, t.prototype.MANY_SEP3 = function(e) {
      this.manySepFirstInternal(3, e);
    }, t.prototype.MANY_SEP4 = function(e) {
      this.manySepFirstInternal(4, e);
    }, t.prototype.MANY_SEP5 = function(e) {
      this.manySepFirstInternal(5, e);
    }, t.prototype.MANY_SEP6 = function(e) {
      this.manySepFirstInternal(6, e);
    }, t.prototype.MANY_SEP7 = function(e) {
      this.manySepFirstInternal(7, e);
    }, t.prototype.MANY_SEP8 = function(e) {
      this.manySepFirstInternal(8, e);
    }, t.prototype.MANY_SEP9 = function(e) {
      this.manySepFirstInternal(9, e);
    }, t.prototype.AT_LEAST_ONE = function(e) {
      this.atLeastOneInternal(0, e);
    }, t.prototype.AT_LEAST_ONE1 = function(e) {
      return this.atLeastOneInternal(1, e);
    }, t.prototype.AT_LEAST_ONE2 = function(e) {
      this.atLeastOneInternal(2, e);
    }, t.prototype.AT_LEAST_ONE3 = function(e) {
      this.atLeastOneInternal(3, e);
    }, t.prototype.AT_LEAST_ONE4 = function(e) {
      this.atLeastOneInternal(4, e);
    }, t.prototype.AT_LEAST_ONE5 = function(e) {
      this.atLeastOneInternal(5, e);
    }, t.prototype.AT_LEAST_ONE6 = function(e) {
      this.atLeastOneInternal(6, e);
    }, t.prototype.AT_LEAST_ONE7 = function(e) {
      this.atLeastOneInternal(7, e);
    }, t.prototype.AT_LEAST_ONE8 = function(e) {
      this.atLeastOneInternal(8, e);
    }, t.prototype.AT_LEAST_ONE9 = function(e) {
      this.atLeastOneInternal(9, e);
    }, t.prototype.AT_LEAST_ONE_SEP = function(e) {
      this.atLeastOneSepFirstInternal(0, e);
    }, t.prototype.AT_LEAST_ONE_SEP1 = function(e) {
      this.atLeastOneSepFirstInternal(1, e);
    }, t.prototype.AT_LEAST_ONE_SEP2 = function(e) {
      this.atLeastOneSepFirstInternal(2, e);
    }, t.prototype.AT_LEAST_ONE_SEP3 = function(e) {
      this.atLeastOneSepFirstInternal(3, e);
    }, t.prototype.AT_LEAST_ONE_SEP4 = function(e) {
      this.atLeastOneSepFirstInternal(4, e);
    }, t.prototype.AT_LEAST_ONE_SEP5 = function(e) {
      this.atLeastOneSepFirstInternal(5, e);
    }, t.prototype.AT_LEAST_ONE_SEP6 = function(e) {
      this.atLeastOneSepFirstInternal(6, e);
    }, t.prototype.AT_LEAST_ONE_SEP7 = function(e) {
      this.atLeastOneSepFirstInternal(7, e);
    }, t.prototype.AT_LEAST_ONE_SEP8 = function(e) {
      this.atLeastOneSepFirstInternal(8, e);
    }, t.prototype.AT_LEAST_ONE_SEP9 = function(e) {
      this.atLeastOneSepFirstInternal(9, e);
    }, t.prototype.RULE = function(e, n, r) {
      if (r === void 0 && (r = Vn), fe(this.definedRulesNames, e)) {
        var i = Kn.buildDuplicateRuleNameError({
          topLevelRule: e,
          grammarName: this.className
        }), a = {
          message: i,
          type: Le.DUPLICATE_RULE_NAME,
          ruleName: e
        };
        this.definitionErrors.push(a);
      }
      this.definedRulesNames.push(e);
      var c = this.defineRule(e, n, r);
      return this[e] = c, c;
    }, t.prototype.OVERRIDE_RULE = function(e, n, r) {
      r === void 0 && (r = Vn);
      var i = [];
      i = i.concat(tu(e, this.definedRulesNames, this.className)), this.definitionErrors.push.apply(this.definitionErrors, i);
      var a = this.defineRule(e, n, r);
      return this[e] = a, a;
    }, t.prototype.BACKTRACK = function(e, n) {
      return function() {
        this.isBackTrackingStack.push(1);
        var r = this.saveRecogState();
        try {
          return e.apply(this, n), !0;
        } catch (i) {
          if (rn(i))
            return !1;
          throw i;
        } finally {
          this.reloadRecogState(r), this.isBackTrackingStack.pop();
        }
      };
    }, t.prototype.getGAstProductions = function() {
      return this.gastProductionsCache;
    }, t.prototype.getSerializedGastProductions = function() {
      return is(xe(this.gastProductionsCache));
    }, t;
  }()
), Mu = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.initRecognizerEngine = function(e, n) {
      if (this.className = Eu(this), this.shortRuleNameToFull = {}, this.fullRuleNameToShort = {}, this.ruleShortNameIdx = 256, this.tokenMatcher = Sn, this.definedRulesNames = [], this.tokensMap = {}, this.isBackTrackingStack = [], this.RULE_STACK = [], this.RULE_OCCURRENCE_STACK = [], this.gastProductionsCache = {}, $(n, "serializedGrammar"))
        throw Error(`The Parser's configuration can no longer contain a <serializedGrammar> property.
	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_6-0-0
	For Further details.`);
      if (it(e)) {
        if (ee(e))
          throw Error(`A Token Vocabulary cannot be empty.
	Note that the first argument for the parser constructor
	is no longer a Token vector (since v4.0).`);
        if (typeof e[0].startOffset == "number")
          throw Error(`The Parser constructor no longer accepts a token vector as the first argument.
	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_4-0-0
	For Further details.`);
      }
      if (it(e))
        this.tokensMap = Ne(e, function(c, h) {
          return c[h.name] = h, c;
        }, {});
      else if ($(e, "modes") && He(Ve(xe(e.modes)), ml)) {
        var r = Ve(xe(e.modes)), i = Dr(r);
        this.tokensMap = Ne(i, function(c, h) {
          return c[h.name] = h, c;
        }, {});
      } else if (Vr(e))
        this.tokensMap = on(e);
      else
        throw new Error("<tokensDictionary> argument must be An Array of Token constructors, A dictionary of Token constructors or an IMultiModeLexerDefinition");
      this.tokensMap.EOF = wt;
      var a = He(xe(e), function(c) {
        return ee(c.categoryMatches);
      });
      this.tokenMatcher = a ? Sn : Wn, cn(xe(this.tokensMap));
    }, t.prototype.defineRule = function(e, n, r) {
      if (this.selfAnalysisDone)
        throw Error("Grammar rule <" + e + `> may not be defined after the 'performSelfAnalysis' method has been called'
Make sure that all grammar rule definitions are done before 'performSelfAnalysis' is called.`);
      var i = $(r, "resyncEnabled") ? r.resyncEnabled : Vn.resyncEnabled, a = $(r, "recoveryValueFunc") ? r.recoveryValueFunc : Vn.recoveryValueFunc, c = this.ruleShortNameIdx << pu + It;
      this.ruleShortNameIdx++, this.shortRuleNameToFull[c] = e, this.fullRuleNameToShort[e] = c;
      function h(o) {
        try {
          if (this.outputCst === !0) {
            n.apply(this, o);
            var s = this.CST_STACK[this.CST_STACK.length - 1];
            return this.cstPostRule(s), s;
          } else
            return n.apply(this, o);
        } catch (l) {
          return this.invokeRuleCatch(l, i, a);
        } finally {
          this.ruleFinallyStateUpdate();
        }
      }
      var p;
      p = function(o, s) {
        return o === void 0 && (o = 0), this.ruleInvocationStateUpdate(c, e, o), h.call(this, s);
      };
      var u = "ruleName";
      return p[u] = e, p.originalGrammarAction = n, p;
    }, t.prototype.invokeRuleCatch = function(e, n, r) {
      var i = this.RULE_STACK.length === 1, a = n && !this.isBackTracking() && this.recoveryEnabled;
      if (rn(e)) {
        var c = e;
        if (a) {
          var h = this.findReSyncTokenType();
          if (this.isInCurrentRuleReSyncSet(h))
            if (c.resyncedTokens = this.reSyncTo(h), this.outputCst) {
              var p = this.CST_STACK[this.CST_STACK.length - 1];
              return p.recoveredNode = !0, p;
            } else
              return r();
          else {
            if (this.outputCst) {
              var p = this.CST_STACK[this.CST_STACK.length - 1];
              p.recoveredNode = !0, c.partialCstResult = p;
            }
            throw c;
          }
        } else {
          if (i)
            return this.moveToTerminatedState(), r();
          throw c;
        }
      } else
        throw e;
    }, t.prototype.optionInternal = function(e, n) {
      var r = this.getKeyForAutomaticLookahead(Ms, n);
      return this.optionInternalLogic(e, n, r);
    }, t.prototype.optionInternalLogic = function(e, n, r) {
      var i = this, a = this.getLaFuncFromCache(r), c, h;
      if (e.DEF !== void 0) {
        if (c = e.DEF, h = e.GATE, h !== void 0) {
          var p = a;
          a = function() {
            return h.call(i) && p.call(i);
          };
        }
      } else
        c = e;
      if (a.call(this) === !0)
        return c.call(this);
    }, t.prototype.atLeastOneInternal = function(e, n) {
      var r = this.getKeyForAutomaticLookahead(xr, e);
      return this.atLeastOneInternalLogic(e, n, r);
    }, t.prototype.atLeastOneInternalLogic = function(e, n, r) {
      var i = this, a = this.getLaFuncFromCache(r), c, h;
      if (n.DEF !== void 0) {
        if (c = n.DEF, h = n.GATE, h !== void 0) {
          var p = a;
          a = function() {
            return h.call(i) && p.call(i);
          };
        }
      } else
        c = n;
      if (a.call(this) === !0)
        for (var u = this.doSingleRepetition(c); a.call(this) === !0 && u === !0; )
          u = this.doSingleRepetition(c);
      else
        throw this.raiseEarlyExitException(e, j.REPETITION_MANDATORY, n.ERR_MSG);
      this.attemptInRepetitionRecovery(this.atLeastOneInternal, [e, n], a, xr, e, Vl);
    }, t.prototype.atLeastOneSepFirstInternal = function(e, n) {
      var r = this.getKeyForAutomaticLookahead(Un, e);
      this.atLeastOneSepFirstInternalLogic(e, n, r);
    }, t.prototype.atLeastOneSepFirstInternalLogic = function(e, n, r) {
      var i = this, a = n.DEF, c = n.SEP, h = this.getLaFuncFromCache(r);
      if (h.call(this) === !0) {
        a.call(this);
        for (var p = function() {
          return i.tokenMatcher(i.LA(1), c);
        }; this.tokenMatcher(this.LA(1), c) === !0; )
          this.CONSUME(c), a.call(this);
        this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
          e,
          c,
          p,
          a,
          Fi
        ], p, Un, e, Fi);
      } else
        throw this.raiseEarlyExitException(e, j.REPETITION_MANDATORY_WITH_SEPARATOR, n.ERR_MSG);
    }, t.prototype.manyInternal = function(e, n) {
      var r = this.getKeyForAutomaticLookahead(kr, e);
      return this.manyInternalLogic(e, n, r);
    }, t.prototype.manyInternalLogic = function(e, n, r) {
      var i = this, a = this.getLaFuncFromCache(r), c, h;
      if (n.DEF !== void 0) {
        if (c = n.DEF, h = n.GATE, h !== void 0) {
          var p = a;
          a = function() {
            return h.call(i) && p.call(i);
          };
        }
      } else
        c = n;
      for (var u = !0; a.call(this) === !0 && u === !0; )
        u = this.doSingleRepetition(c);
      this.attemptInRepetitionRecovery(
        this.manyInternal,
        [e, n],
        a,
        kr,
        e,
        Dl,
        // The notStuck parameter is only relevant when "attemptInRepetitionRecovery"
        // is invoked from manyInternal, in the MANY_SEP case and AT_LEAST_ONE[_SEP]
        // An infinite loop cannot occur as:
        // - Either the lookahead is guaranteed to consume something (Single Token Separator)
        // - AT_LEAST_ONE by definition is guaranteed to consume something (or error out).
        u
      );
    }, t.prototype.manySepFirstInternal = function(e, n) {
      var r = this.getKeyForAutomaticLookahead(Sr, e);
      this.manySepFirstInternalLogic(e, n, r);
    }, t.prototype.manySepFirstInternalLogic = function(e, n, r) {
      var i = this, a = n.DEF, c = n.SEP, h = this.getLaFuncFromCache(r);
      if (h.call(this) === !0) {
        a.call(this);
        for (var p = function() {
          return i.tokenMatcher(i.LA(1), c);
        }; this.tokenMatcher(this.LA(1), c) === !0; )
          this.CONSUME(c), a.call(this);
        this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
          e,
          c,
          p,
          a,
          Bi
        ], p, Sr, e, Bi);
      }
    }, t.prototype.repetitionSepSecondInternal = function(e, n, r, i, a) {
      for (; r(); )
        this.CONSUME(n), i.call(this);
      this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
        e,
        n,
        r,
        i,
        a
      ], r, Un, e, a);
    }, t.prototype.doSingleRepetition = function(e) {
      var n = this.getLexerPosition();
      e.call(this);
      var r = this.getLexerPosition();
      return r > n;
    }, t.prototype.orInternal = function(e, n) {
      var r = this.getKeyForAutomaticLookahead(Os, n), i = it(e) ? e : e.DEF, a = this.getLaFuncFromCache(r), c = a.call(this, i);
      if (c !== void 0) {
        var h = i[c];
        return h.ALT.call(this);
      }
      this.raiseNoAltException(n, e.ERR_MSG);
    }, t.prototype.ruleFinallyStateUpdate = function() {
      if (this.RULE_STACK.pop(), this.RULE_OCCURRENCE_STACK.pop(), this.cstFinallyStateUpdate(), this.RULE_STACK.length === 0 && this.isAtEndOfInput() === !1) {
        var e = this.LA(1), n = this.errorMessageProvider.buildNotAllInputParsedMessage({
          firstRedundant: e,
          ruleName: this.getCurrRuleFullName()
        });
        this.SAVE_ERROR(new Ts(n, e));
      }
    }, t.prototype.subruleInternal = function(e, n, r) {
      var i;
      try {
        var a = r !== void 0 ? r.ARGS : void 0;
        return i = e.call(this, n, a), this.cstPostNonTerminal(i, r !== void 0 && r.LABEL !== void 0 ? r.LABEL : e.ruleName), i;
      } catch (c) {
        this.subruleInternalError(c, r, e.ruleName);
      }
    }, t.prototype.subruleInternalError = function(e, n, r) {
      throw rn(e) && e.partialCstResult !== void 0 && (this.cstPostNonTerminal(e.partialCstResult, n !== void 0 && n.LABEL !== void 0 ? n.LABEL : r), delete e.partialCstResult), e;
    }, t.prototype.consumeInternal = function(e, n, r) {
      var i;
      try {
        var a = this.LA(1);
        this.tokenMatcher(a, e) === !0 ? (this.consumeToken(), i = a) : this.consumeInternalError(e, a, r);
      } catch (c) {
        i = this.consumeInternalRecovery(e, n, c);
      }
      return this.cstPostTerminal(r !== void 0 && r.LABEL !== void 0 ? r.LABEL : e.name, i), i;
    }, t.prototype.consumeInternalError = function(e, n, r) {
      var i, a = this.LA(0);
      throw r !== void 0 && r.ERR_MSG ? i = r.ERR_MSG : i = this.errorMessageProvider.buildMismatchTokenMessage({
        expected: e,
        actual: n,
        previous: a,
        ruleName: this.getCurrRuleFullName()
      }), this.SAVE_ERROR(new Xr(i, n, a));
    }, t.prototype.consumeInternalRecovery = function(e, n, r) {
      if (this.recoveryEnabled && // TODO: more robust checking of the exception type. Perhaps Typescript extending expressions?
      r.name === "MismatchedTokenException" && !this.isBackTracking()) {
        var i = this.getFollowsForInRuleRecovery(e, n);
        try {
          return this.tryInRuleRecovery(e, i);
        } catch (a) {
          throw a.name === Cs ? r : a;
        }
      } else
        throw r;
    }, t.prototype.saveRecogState = function() {
      var e = this.errors, n = Se(this.RULE_STACK);
      return {
        errors: e,
        lexerState: this.exportLexerState(),
        RULE_STACK: n,
        CST_STACK: this.CST_STACK
      };
    }, t.prototype.reloadRecogState = function(e) {
      this.errors = e.errors, this.importLexerState(e.lexerState), this.RULE_STACK = e.RULE_STACK;
    }, t.prototype.ruleInvocationStateUpdate = function(e, n, r) {
      this.RULE_OCCURRENCE_STACK.push(r), this.RULE_STACK.push(e), this.cstInvocationStateUpdate(n, e);
    }, t.prototype.isBackTracking = function() {
      return this.isBackTrackingStack.length !== 0;
    }, t.prototype.getCurrRuleFullName = function() {
      var e = this.getLastExplicitRuleShortName();
      return this.shortRuleNameToFull[e];
    }, t.prototype.shortRuleNameToFullName = function(e) {
      return this.shortRuleNameToFull[e];
    }, t.prototype.isAtEndOfInput = function() {
      return this.tokenMatcher(this.LA(1), wt);
    }, t.prototype.reset = function() {
      this.resetLexerState(), this.isBackTrackingStack = [], this.errors = [], this.RULE_STACK = [], this.CST_STACK = [], this.RULE_OCCURRENCE_STACK = [];
    }, t;
  }()
), Uu = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.initErrorHandler = function(e) {
      this._errors = [], this.errorMessageProvider = $(e, "errorMessageProvider") ? e.errorMessageProvider : dt.errorMessageProvider;
    }, t.prototype.SAVE_ERROR = function(e) {
      if (rn(e))
        return e.context = {
          ruleStack: this.getHumanReadableRuleStack(),
          ruleOccurrenceStack: Se(this.RULE_OCCURRENCE_STACK)
        }, this._errors.push(e), e;
      throw Error("Trying to save an Error which is not a RecognitionException");
    }, Object.defineProperty(t.prototype, "errors", {
      get: function() {
        return Se(this._errors);
      },
      set: function(e) {
        this._errors = e;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.raiseEarlyExitException = function(e, n, r) {
      for (var i = this.getCurrRuleFullName(), a = this.getGAstProductions()[i], c = Yr(e, a, n, this.maxLookahead), h = c[0], p = [], u = 1; u <= this.maxLookahead; u++)
        p.push(this.LA(u));
      var o = this.errorMessageProvider.buildEarlyExitMessage({
        expectedIterationPaths: h,
        actual: p,
        previous: this.LA(0),
        customUserDescription: r,
        ruleName: i
      });
      throw this.SAVE_ERROR(new ws(o, this.LA(1), this.LA(0)));
    }, t.prototype.raiseNoAltException = function(e, n) {
      for (var r = this.getCurrRuleFullName(), i = this.getGAstProductions()[r], a = qr(e, i, this.maxLookahead), c = [], h = 1; h <= this.maxLookahead; h++)
        c.push(this.LA(h));
      var p = this.LA(0), u = this.errorMessageProvider.buildNoViableAltMessage({
        expectedPathsPerAlt: a,
        actual: c,
        previous: p,
        customUserDescription: n,
        ruleName: this.getCurrRuleFullName()
      });
      throw this.SAVE_ERROR(new ys(u, this.LA(1), p));
    }, t;
  }()
), Lu = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.initContentAssist = function() {
    }, t.prototype.computeContentAssist = function(e, n) {
      var r = this.gastProductionsCache[e];
      if (ht(r))
        throw Error("Rule ->" + e + "<- does not exist in this grammar.");
      return cs([r], n, this.tokenMatcher, this.maxLookahead);
    }, t.prototype.getNextPossibleTokenTypes = function(e) {
      var n = Ze(e.ruleStack), r = this.getGAstProductions(), i = r[n], a = new bl(i, e).startWalking();
      return a;
    }, t;
  }()
), Zn = {
  description: "This Object indicates the Parser is during Recording Phase"
};
Object.freeze(Zn);
var $i = !0, Hi = Math.pow(2, It) - 1, Ls = Hr({ name: "RECORDING_PHASE_TOKEN", pattern: Xe.NA });
cn([Ls]);
var _s = qn(
  Ls,
  `This IToken indicates the Parser is in Recording Phase
	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details`,
  // Using "-1" instead of NaN (as in EOF) because an actual number is less likely to
  // cause errors if the output of LA or CONSUME would be (incorrectly) used during the recording phase.
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
);
Object.freeze(_s);
var _u = {
  name: `This CSTNode indicates the Parser is in Recording Phase
	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details`,
  children: {}
}, Pu = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.initGastRecorder = function(e) {
      this.recordingProdStack = [], this.RECORDING_PHASE = !1;
    }, t.prototype.enableRecording = function() {
      var e = this;
      this.RECORDING_PHASE = !0, this.TRACE_INIT("Enable Recording", function() {
        for (var n = function(i) {
          var a = i > 0 ? i : "";
          e["CONSUME" + a] = function(c, h) {
            return this.consumeInternalRecord(c, i, h);
          }, e["SUBRULE" + a] = function(c, h) {
            return this.subruleInternalRecord(c, i, h);
          }, e["OPTION" + a] = function(c) {
            return this.optionInternalRecord(c, i);
          }, e["OR" + a] = function(c) {
            return this.orInternalRecord(c, i);
          }, e["MANY" + a] = function(c) {
            this.manyInternalRecord(i, c);
          }, e["MANY_SEP" + a] = function(c) {
            this.manySepFirstInternalRecord(i, c);
          }, e["AT_LEAST_ONE" + a] = function(c) {
            this.atLeastOneInternalRecord(i, c);
          }, e["AT_LEAST_ONE_SEP" + a] = function(c) {
            this.atLeastOneSepFirstInternalRecord(i, c);
          };
        }, r = 0; r < 10; r++)
          n(r);
        e.consume = function(i, a, c) {
          return this.consumeInternalRecord(a, i, c);
        }, e.subrule = function(i, a, c) {
          return this.subruleInternalRecord(a, i, c);
        }, e.option = function(i, a) {
          return this.optionInternalRecord(a, i);
        }, e.or = function(i, a) {
          return this.orInternalRecord(a, i);
        }, e.many = function(i, a) {
          this.manyInternalRecord(i, a);
        }, e.atLeastOne = function(i, a) {
          this.atLeastOneInternalRecord(i, a);
        }, e.ACTION = e.ACTION_RECORD, e.BACKTRACK = e.BACKTRACK_RECORD, e.LA = e.LA_RECORD;
      });
    }, t.prototype.disableRecording = function() {
      var e = this;
      this.RECORDING_PHASE = !1, this.TRACE_INIT("Deleting Recording methods", function() {
        for (var n = 0; n < 10; n++) {
          var r = n > 0 ? n : "";
          delete e["CONSUME" + r], delete e["SUBRULE" + r], delete e["OPTION" + r], delete e["OR" + r], delete e["MANY" + r], delete e["MANY_SEP" + r], delete e["AT_LEAST_ONE" + r], delete e["AT_LEAST_ONE_SEP" + r];
        }
        delete e.consume, delete e.subrule, delete e.option, delete e.or, delete e.many, delete e.atLeastOne, delete e.ACTION, delete e.BACKTRACK, delete e.LA;
      });
    }, t.prototype.ACTION_RECORD = function(e) {
    }, t.prototype.BACKTRACK_RECORD = function(e, n) {
      return function() {
        return !0;
      };
    }, t.prototype.LA_RECORD = function(e) {
      return Dn;
    }, t.prototype.topLevelRuleRecord = function(e, n) {
      try {
        var r = new kt({ definition: [], name: e });
        return r.name = e, this.recordingProdStack.push(r), n.call(this), this.recordingProdStack.pop(), r;
      } catch (i) {
        if (i.KNOWN_RECORDER_ERROR !== !0)
          try {
            i.message = i.message + `
	 This error was thrown during the "grammar recording phase" For more info see:
	https://chevrotain.io/docs/guide/internals.html#grammar-recording`;
          } catch {
            throw i;
          }
        throw i;
      }
    }, t.prototype.optionInternalRecord = function(e, n) {
      return zt.call(this, ye, e, n);
    }, t.prototype.atLeastOneInternalRecord = function(e, n) {
      zt.call(this, We, n, e);
    }, t.prototype.atLeastOneSepFirstInternalRecord = function(e, n) {
      zt.call(this, qe, n, e, $i);
    }, t.prototype.manyInternalRecord = function(e, n) {
      zt.call(this, ce, n, e);
    }, t.prototype.manySepFirstInternalRecord = function(e, n) {
      zt.call(this, Ge, n, e, $i);
    }, t.prototype.orInternalRecord = function(e, n) {
      return ku.call(this, e, n);
    }, t.prototype.subruleInternalRecord = function(e, n, r) {
      if (bn(n), !e || $(e, "ruleName") === !1) {
        var i = new Error("<SUBRULE" + Wi(n) + "> argument is invalid" + (" expecting a Parser method reference but got: <" + JSON.stringify(e) + ">") + (`
 inside top level rule: <` + this.recordingProdStack[0].name + ">"));
        throw i.KNOWN_RECORDER_ERROR = !0, i;
      }
      var a = kn(this.recordingProdStack), c = e.ruleName, h = new Ue({
        idx: n,
        nonTerminalName: c,
        // The resolving of the `referencedRule` property will be done once all the Rule's GASTs have been created
        referencedRule: void 0
      });
      return a.definition.push(h), this.outputCst ? _u : Zn;
    }, t.prototype.consumeInternalRecord = function(e, n, r) {
      if (bn(n), !ts(e)) {
        var i = new Error("<CONSUME" + Wi(n) + "> argument is invalid" + (" expecting a TokenType reference but got: <" + JSON.stringify(e) + ">") + (`
 inside top level rule: <` + this.recordingProdStack[0].name + ">"));
        throw i.KNOWN_RECORDER_ERROR = !0, i;
      }
      var a = kn(this.recordingProdStack), c = new ne({
        idx: n,
        terminalType: e
      });
      return a.definition.push(c), _s;
    }, t;
  }()
);
function zt(t, e, n, r) {
  r === void 0 && (r = !1), bn(n);
  var i = kn(this.recordingProdStack), a = Ct(e) ? e : e.DEF, c = new t({ definition: [], idx: n });
  return r && (c.separator = e.SEP), $(e, "MAX_LOOKAHEAD") && (c.maxLookahead = e.MAX_LOOKAHEAD), this.recordingProdStack.push(c), a.call(this), i.definition.push(c), this.recordingProdStack.pop(), Zn;
}
function ku(t, e) {
  var n = this;
  bn(e);
  var r = kn(this.recordingProdStack), i = it(t) === !1, a = i === !1 ? t : t.DEF, c = new $e({
    definition: [],
    idx: e,
    ignoreAmbiguities: i && t.IGNORE_AMBIGUITIES === !0
  });
  $(t, "MAX_LOOKAHEAD") && (c.maxLookahead = t.MAX_LOOKAHEAD);
  var h = $o(a, function(p) {
    return Ct(p.GATE);
  });
  return c.hasPredicates = h, r.definition.push(c), V(a, function(p) {
    var u = new Te({ definition: [] });
    c.definition.push(u), $(p, "IGNORE_AMBIGUITIES") ? u.ignoreAmbiguities = p.IGNORE_AMBIGUITIES : $(p, "GATE") && (u.ignoreAmbiguities = !0), n.recordingProdStack.push(u), p.ALT.call(n), n.recordingProdStack.pop();
  }), Zn;
}
function Wi(t) {
  return t === 0 ? "" : "" + t;
}
function bn(t) {
  if (t < 0 || t > Hi) {
    var e = new Error(
      // The stack trace will contain all the needed details
      "Invalid DSL Method idx value: <" + t + `>
	` + ("Idx value must be a none negative value smaller than " + (Hi + 1))
    );
    throw e.KNOWN_RECORDER_ERROR = !0, e;
  }
}
var xu = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.initPerformanceTracer = function(e) {
      if ($(e, "traceInitPerf")) {
        var n = e.traceInitPerf, r = typeof n == "number";
        this.traceInitMaxIdent = r ? n : 1 / 0, this.traceInitPerf = r ? n > 0 : n;
      } else
        this.traceInitMaxIdent = 0, this.traceInitPerf = dt.traceInitPerf;
      this.traceInitIndent = -1;
    }, t.prototype.TRACE_INIT = function(e, n) {
      if (this.traceInitPerf === !0) {
        this.traceInitIndent++;
        var r = new Array(this.traceInitIndent + 1).join("	");
        this.traceInitIndent < this.traceInitMaxIdent && console.log(r + "--> <" + e + ">");
        var i = qo(n), a = i.time, c = i.value, h = a > 10 ? console.warn : console.log;
        return this.traceInitIndent < this.traceInitMaxIdent && h(r + "<-- <" + e + "> time: " + a + "ms"), this.traceInitIndent--, c;
      } else
        return n();
    }, t;
  }()
), Ps = globalThis && globalThis.__extends || function() {
  var t = function(e, n) {
    return t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, i) {
      r.__proto__ = i;
    } || function(r, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (r[a] = i[a]);
    }, t(e, n);
  };
  return function(e, n) {
    t(e, n);
    function r() {
      this.constructor = e;
    }
    e.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
  };
}(), Dn = qn(wt, "", NaN, NaN, NaN, NaN, NaN, NaN);
Object.freeze(Dn);
var dt = Object.freeze({
  recoveryEnabled: !1,
  maxLookahead: 3,
  dynamicTokensEnabled: !1,
  outputCst: !0,
  errorMessageProvider: Wr,
  nodeLocationTracking: "none",
  traceInitPerf: !1,
  skipValidations: !1
}), Vn = Object.freeze({
  recoveryValueFunc: function() {
  },
  resyncEnabled: !0
}), Le;
(function(t) {
  t[t.INVALID_RULE_NAME = 0] = "INVALID_RULE_NAME", t[t.DUPLICATE_RULE_NAME = 1] = "DUPLICATE_RULE_NAME", t[t.INVALID_RULE_OVERRIDE = 2] = "INVALID_RULE_OVERRIDE", t[t.DUPLICATE_PRODUCTIONS = 3] = "DUPLICATE_PRODUCTIONS", t[t.UNRESOLVED_SUBRULE_REF = 4] = "UNRESOLVED_SUBRULE_REF", t[t.LEFT_RECURSION = 5] = "LEFT_RECURSION", t[t.NONE_LAST_EMPTY_ALT = 6] = "NONE_LAST_EMPTY_ALT", t[t.AMBIGUOUS_ALTS = 7] = "AMBIGUOUS_ALTS", t[t.CONFLICT_TOKENS_RULES_NAMESPACE = 8] = "CONFLICT_TOKENS_RULES_NAMESPACE", t[t.INVALID_TOKEN_NAME = 9] = "INVALID_TOKEN_NAME", t[t.NO_NON_EMPTY_LOOKAHEAD = 10] = "NO_NON_EMPTY_LOOKAHEAD", t[t.AMBIGUOUS_PREFIX_ALTS = 11] = "AMBIGUOUS_PREFIX_ALTS", t[t.TOO_MANY_ALTS = 12] = "TOO_MANY_ALTS";
})(Le || (Le = {}));
function Su(t) {
  return t === void 0 && (t = void 0), function() {
    return t;
  };
}
var Qr = (
  /** @class */
  function() {
    function t(e, n) {
      this.definitionErrors = [], this.selfAnalysisDone = !1;
      var r = this;
      if (r.initErrorHandler(n), r.initLexerAdapter(), r.initLooksAhead(n), r.initRecognizerEngine(e, n), r.initRecoverable(n), r.initTreeBuilder(n), r.initContentAssist(), r.initGastRecorder(n), r.initPerformanceTracer(n), $(n, "ignoredIssues"))
        throw new Error(`The <ignoredIssues> IParserConfig property has been deprecated.
	Please use the <IGNORE_AMBIGUITIES> flag on the relevant DSL method instead.
	See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#IGNORING_AMBIGUITIES
	For further details.`);
      this.skipValidations = $(n, "skipValidations") ? n.skipValidations : dt.skipValidations;
    }
    return t.performSelfAnalysis = function(e) {
      throw Error("The **static** `performSelfAnalysis` method has been deprecated.	\nUse the **instance** method with the same name instead.");
    }, t.prototype.performSelfAnalysis = function() {
      var e = this;
      this.TRACE_INIT("performSelfAnalysis", function() {
        var n;
        e.selfAnalysisDone = !0;
        var r = e.className;
        e.TRACE_INIT("toFastProps", function() {
          Wo(e);
        }), e.TRACE_INIT("Grammar Recording", function() {
          try {
            e.enableRecording(), V(e.definedRulesNames, function(a) {
              var c = e[a], h = c.originalGrammarAction, p = void 0;
              e.TRACE_INIT(a + " Rule", function() {
                p = e.topLevelRuleRecord(a, h);
              }), e.gastProductionsCache[a] = p;
            });
          } finally {
            e.disableRecording();
          }
        });
        var i = [];
        if (e.TRACE_INIT("Grammar Resolving", function() {
          i = vs({
            rules: xe(e.gastProductionsCache)
          }), e.definitionErrors.push.apply(e.definitionErrors, i);
        }), e.TRACE_INIT("Grammar Validations", function() {
          if (ee(i) && e.skipValidations === !1) {
            var a = gs({
              rules: xe(e.gastProductionsCache),
              maxLookahead: e.maxLookahead,
              tokenTypes: xe(e.tokensMap),
              errMsgProvider: Kn,
              grammarName: r
            });
            e.definitionErrors.push.apply(e.definitionErrors, a);
          }
        }), ee(e.definitionErrors) && (e.recoveryEnabled && e.TRACE_INIT("computeAllProdsFollows", function() {
          var a = Pl(xe(e.gastProductionsCache));
          e.resyncFollows = a;
        }), e.TRACE_INIT("ComputeLookaheadFunctions", function() {
          e.preComputeLookaheadFunctions(xe(e.gastProductionsCache));
        })), !t.DEFER_DEFINITION_ERRORS_HANDLING && !ee(e.definitionErrors))
          throw n = x(e.definitionErrors, function(a) {
            return a.message;
          }), new Error(`Parser Definition Errors detected:
 ` + n.join(`
-------------------------------
`));
      });
    }, t.DEFER_DEFINITION_ERRORS_HANDLING = !1, t;
  }()
);
Sc(Qr, [
  fu,
  du,
  Cu,
  Iu,
  Mu,
  Ou,
  Uu,
  Lu,
  Pu,
  xu
]);
var Bu = (
  /** @class */
  function(t) {
    Ps(e, t);
    function e(n, r) {
      r === void 0 && (r = dt);
      var i = this, a = on(r);
      return a.outputCst = !0, i = t.call(this, n, a) || this, i;
    }
    return e;
  }(Qr)
), Fu = (
  /** @class */
  function(t) {
    Ps(e, t);
    function e(n, r) {
      r === void 0 && (r = dt);
      var i = this, a = on(r);
      return a.outputCst = !1, i = t.call(this, n, a) || this, i;
    }
    return e;
  }(Qr)
);
function bu(t, e) {
  var n = e === void 0 ? {} : e, r = n.resourceBase, i = r === void 0 ? "https://unpkg.com/chevrotain@" + Or + "/diagrams/" : r, a = n.css, c = a === void 0 ? "https://unpkg.com/chevrotain@" + Or + "/diagrams/diagrams.css" : a, h = `
<!-- This is a generated file -->
<!DOCTYPE html>
<meta charset="utf-8">
<style>
  body {
    background-color: hsl(30, 20%, 95%)
  }
</style>

`, p = `
<link rel='stylesheet' href='` + c + `'>
`, u = `
<script src='` + i + `vendor/railroad-diagrams.js'><\/script>
<script src='` + i + `src/diagrams_builder.js'><\/script>
<script src='` + i + `src/diagrams_behavior.js'><\/script>
<script src='` + i + `src/main.js'><\/script>
`, o = `
<div id="diagrams" align="center"></div>    
`, s = `
<script>
    window.serializedGrammar = ` + JSON.stringify(t, null, "  ") + `;
<\/script>
`, l = `
<script>
    var diagramsDiv = document.getElementById("diagrams");
    main.drawDiagramsFromSerializedGrammar(serializedGrammar, diagramsDiv);
<\/script>
`;
  return h + p + u + o + s + l;
}
var ve = `
`;
function Du(t) {
  return `
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['chevrotain'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('chevrotain'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.b);
    }
}(typeof self !== 'undefined' ? self : this, function (chevrotain) {

` + ks(t) + `
    
return {
    ` + t.name + ": " + t.name + ` 
}
}));
`;
}
function Vu(t) {
  return `    
` + ks(t) + `
return new ` + t.name + `(tokenVocabulary, config)    
`;
}
function ks(t) {
  var e = `
function ` + t.name + `(tokenVocabulary, config) {
    // invoke super constructor
    // No support for embedded actions currently, so we can 'hardcode'
    // The use of CstParser.
    chevrotain.CstParser.call(this, tokenVocabulary, config)

    const $ = this

    ` + Gu(t.rules) + `

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis(this)
}

// inheritance as implemented in javascript in the previous decade... :(
` + t.name + `.prototype = Object.create(chevrotain.CstParser.prototype)
` + t.name + ".prototype.constructor = " + t.name + `    
    `;
  return e;
}
function Gu(t) {
  var e = x(t, function(n) {
    return $u(n, 1);
  });
  return e.join(`
`);
}
function $u(t, e) {
  var n = Me(e, '$.RULE("' + t.name + '", function() {') + ve;
  return n += Jn(t.definition, e + 1), n += Me(e + 1, "})") + ve, n;
}
function Hu(t, e) {
  var n = t.terminalType.name;
  return Me(e, "$.CONSUME" + t.idx + "(this.tokensMap." + n + ")" + ve);
}
function Wu(t, e) {
  return Me(e, "$.SUBRULE" + t.idx + "($." + t.nonTerminalName + ")" + ve);
}
function qu(t, e) {
  var n = Me(e, "$.OR" + t.idx + "([") + ve, r = x(t.definition, function(i) {
    return Yu(i, e + 1);
  });
  return n += r.join("," + ve), n += ve + Me(e, "])" + ve), n;
}
function Yu(t, e) {
  var n = Me(e, "{") + ve;
  return n += Me(e + 1, "ALT: function() {") + ve, n += Jn(t.definition, e + 1), n += Me(e + 1, "}") + ve, n += Me(e, "}"), n;
}
function Ku(t, e) {
  if (t instanceof Ue)
    return Wu(t, e);
  if (t instanceof ye)
    return Xt("OPTION", t, e);
  if (t instanceof We)
    return Xt("AT_LEAST_ONE", t, e);
  if (t instanceof qe)
    return Xt("AT_LEAST_ONE_SEP", t, e);
  if (t instanceof Ge)
    return Xt("MANY_SEP", t, e);
  if (t instanceof ce)
    return Xt("MANY", t, e);
  if (t instanceof $e)
    return qu(t, e);
  if (t instanceof ne)
    return Hu(t, e);
  if (t instanceof Te)
    return Jn(t.definition, e);
  throw Error("non exhaustive match");
}
function Xt(t, e, n) {
  var r = Me(n, "$." + (t + e.idx) + "(");
  return e.separator ? (r += "{" + ve, r += Me(n + 1, "SEP: this.tokensMap." + e.separator.name) + "," + ve, r += "DEF: " + qi(e.definition, n + 2) + ve, r += Me(n, "}") + ve) : r += qi(e.definition, n + 1), r += Me(n, ")") + ve, r;
}
function qi(t, e) {
  var n = "function() {" + ve;
  return n += Jn(t, e), n += Me(e, "}") + ve, n;
}
function Jn(t, e) {
  var n = "";
  return V(t, function(r) {
    n += Ku(r, e + 1);
  }), n;
}
function Me(t, e) {
  var n = Array(t * 4 + 1).join(" ");
  return n + e;
}
function zu(t) {
  var e = Vu({
    name: t.name,
    rules: t.rules
  }), n = new Function("tokenVocabulary", "config", "chevrotain", e);
  return function(r) {
    return n(
      t.tokenVocabulary,
      r,
      // TODO: check how the require is transpiled/webpacked
      require("../api")
    );
  };
}
function Xu(t) {
  return Du({ name: t.name, rules: t.rules });
}
function Qu() {
  console.warn(`The clearCache function was 'soft' removed from the Chevrotain API.
	 It performs no action other than printing this message.
	 Please avoid using it as it will be completely removed in the future`);
}
var Zu = (
  /** @class */
  function() {
    function t() {
      throw new Error(`The Parser class has been deprecated, use CstParser or EmbeddedActionsParser instead.	
See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_7-0-0`);
    }
    return t;
  }()
);
const Ju = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Alternation: $e,
  Alternative: Te,
  CstParser: Bu,
  EMPTY_ALT: Su,
  EOF: wt,
  EarlyExitException: ws,
  EmbeddedActionsParser: Fu,
  GAstVisitor: xt,
  Lexer: Xe,
  get LexerDefinitionErrorType() {
    return se;
  },
  MismatchedTokenException: Xr,
  NoViableAltException: ys,
  NonTerminal: Ue,
  NotAllInputParsedException: Ts,
  Option: ye,
  Parser: Zu,
  get ParserDefinitionErrorType() {
    return Le;
  },
  Repetition: ce,
  RepetitionMandatory: We,
  RepetitionMandatoryWithSeparator: qe,
  RepetitionWithSeparator: Ge,
  Rule: kt,
  Terminal: ne,
  VERSION: Or,
  assignOccurrenceIndices: uu,
  clearCache: Qu,
  createSyntaxDiagramsCode: bu,
  createToken: Hr,
  createTokenInstance: qn,
  defaultGrammarResolverErrorProvider: as,
  defaultGrammarValidatorErrorProvider: Kn,
  defaultLexerErrorProvider: ns,
  defaultParserErrorProvider: Wr,
  generateParserFactory: zu,
  generateParserModule: Xu,
  isRecognitionException: rn,
  resolveGrammar: vs,
  serializeGrammar: is,
  serializeProduction: en,
  tokenLabel: Pt,
  tokenMatcher: yl,
  tokenName: Rl,
  validateGrammar: gs
}, Symbol.toStringTag, { value: "Module" })), Zr = /* @__PURE__ */ pa(Ju), { createToken: z, Lexer: xs } = Zr, ju = he(), Ss = {}, ef = z({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: xs.SKIPPED
}), tf = z({
  name: "String",
  pattern: /"(""|[^"])*"/
}), nf = z({
  name: "SingleQuotedString",
  pattern: /'(''|[^'])*'/
}), rf = z({
  name: "SheetQuoted",
  pattern: /'((?![\\\/\[\]*?:]).)+?'!/
}), of = z({
  name: "Function",
  pattern: /[A-Za-z_]+[A-Za-z_0-9.]*\(/
}), sf = z({
  name: "FormulaErrorT",
  pattern: /#NULL!|#DIV\/0!|#VALUE!|#NAME\?|#NUM!|#N\/A/
}), af = z({
  name: "RefError",
  pattern: /#REF!/
}), Jr = z({
  name: "Name",
  pattern: /[a-zA-Z_][a-zA-Z0-9_.?]*/
  // longer_alt: RangeColumn // e.g. A:AA
}), cf = z({
  name: "Sheet",
  pattern: /[A-Za-z_.\d\u007F-\uFFFF]+!/
}), lf = z({
  name: "Cell",
  pattern: /[$]?[A-Za-z]{1,3}[$]?[1-9][0-9]*/,
  longer_alt: Jr
}), uf = z({
  name: "Number",
  pattern: /[0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?/
}), ff = z({
  name: "Boolean",
  pattern: /TRUE|FALSE/i
}), hf = z({
  name: "Column",
  pattern: /[$]?[A-Za-z]{1,3}/,
  longer_alt: Jr
}), pf = z({
  name: "At",
  pattern: /@/
}), df = z({
  name: "Comma",
  pattern: /,/
}), vf = z({
  name: "Colon",
  pattern: /:/
}), gf = z({
  name: "Semicolon",
  pattern: /;/
}), Ef = z({
  name: "OpenParen",
  pattern: /\(/
}), mf = z({
  name: "CloseParen",
  pattern: /\)/
}), Rf = z({
  name: "OpenSquareParen",
  pattern: /\[/
}), Nf = z({
  name: "CloseSquareParen",
  pattern: /]/
});
z({
  name: "exclamationMark",
  pattern: /!/
});
const Af = z({
  name: "OpenCurlyParen",
  pattern: /{/
}), yf = z({
  name: "CloseCurlyParen",
  pattern: /}/
}), Tf = z({
  name: "QuoteS",
  pattern: /'/
}), Yi = z({
  name: "MulOp",
  pattern: /\*/
}), wf = z({
  name: "PlusOp",
  pattern: /\+/
}), Cf = z({
  name: "DivOp",
  pattern: /\//
}), If = z({
  name: "MinOp",
  pattern: /-/
}), Of = z({
  name: "ConcatOp",
  pattern: /&/
}), Mf = z({
  name: "ExOp",
  pattern: /\^/
}), Uf = z({
  name: "PercentOp",
  pattern: /%/
}), Lf = z({
  name: "GtOp",
  pattern: />/
}), _f = z({
  name: "EqOp",
  pattern: /=/
}), Pf = z({
  name: "LtOp",
  pattern: /</
}), kf = z({
  name: "NeqOp",
  pattern: /<>/
}), xf = z({
  name: "GteOp",
  pattern: />=/
}), Sf = z({
  name: "LteOp",
  pattern: /<=/
}), Bs = [
  ef,
  tf,
  rf,
  nf,
  of,
  sf,
  af,
  cf,
  lf,
  ff,
  hf,
  Jr,
  uf,
  pf,
  df,
  vf,
  gf,
  Ef,
  mf,
  Rf,
  Nf,
  // ExclamationMark,
  Af,
  yf,
  Tf,
  Yi,
  wf,
  Cf,
  If,
  Of,
  Mf,
  Yi,
  Uf,
  kf,
  xf,
  Sf,
  Lf,
  _f,
  Pf
], Bf = new xs(Bs, { ensureOptimizations: !0 });
Bs.forEach((t) => {
  Ss[t.name] = t;
});
var jr = {
  tokenVocabulary: Ss,
  lex: function(t) {
    const e = Bf.tokenize(t);
    if (e.errors.length > 0) {
      const n = e.errors[0], r = n.line, i = n.column;
      let a = `
` + t.split(`
`)[r - 1] + `
`;
      throw a += Array(i - 1).fill(" ").join("") + `^
`, n.message = a + `Error at position ${r}:${i}
` + n.message, n.errorLocation = { line: r, column: i }, ju.ERROR(n.message, n);
    }
    return e;
  }
};
const Fs = jr, { EmbeddedActionsParser: Ff } = Zr, bf = Fs.tokenVocabulary, {
  String: Ki,
  SheetQuoted: Df,
  ExcelRefFunction: qh,
  ExcelConditionalRefFunction: Yh,
  Function: Vf,
  FormulaErrorT: zi,
  RefError: Xi,
  Cell: Gf,
  Sheet: $f,
  Name: Hf,
  Number: Qi,
  Boolean: Zi,
  Column: Wf,
  // At,
  Comma: Tn,
  Colon: qf,
  Semicolon: Yf,
  OpenParen: Kf,
  CloseParen: Ji,
  // OpenSquareParen,
  // CloseSquareParen,
  // ExclamationMark,
  OpenCurlyParen: zf,
  CloseCurlyParen: Xf,
  MulOp: Qf,
  PlusOp: Nr,
  DivOp: Zf,
  MinOp: Ar,
  ConcatOp: Jf,
  ExOp: jf,
  PercentOp: eh,
  NeqOp: th,
  GteOp: nh,
  LteOp: rh,
  GtOp: ih,
  EqOp: oh,
  LtOp: sh
} = Fs.tokenVocabulary;
class ah extends Ff {
  /**
   *
   * @param {FormulaParser|DepParser} context
   * @param {Utils} utils
   */
  constructor(e, n) {
    super(bf, {
      outputCst: !1,
      maxLookahead: 1,
      skipValidations: !0
      // traceInitPerf: true,
    }), this.utils = n, this.binaryOperatorsPrecedence = [
      ["^"],
      ["*", "/"],
      ["+", "-"],
      ["&"],
      ["<", ">", "=", "<>", "<=", ">="]
    ];
    const r = this;
    r.RULE("formulaWithBinaryOp", () => {
      const i = [], a = [r.SUBRULE(r.formulaWithPercentOp)];
      return r.MANY(() => {
        i.push(r.OR(r.c1 || (r.c1 = [
          { ALT: () => r.CONSUME(ih).image },
          { ALT: () => r.CONSUME(oh).image },
          { ALT: () => r.CONSUME(sh).image },
          { ALT: () => r.CONSUME(th).image },
          { ALT: () => r.CONSUME(nh).image },
          { ALT: () => r.CONSUME(rh).image },
          { ALT: () => r.CONSUME(Jf).image },
          { ALT: () => r.CONSUME(Nr).image },
          { ALT: () => r.CONSUME(Ar).image },
          { ALT: () => r.CONSUME(Qf).image },
          { ALT: () => r.CONSUME(Zf).image },
          { ALT: () => r.CONSUME(jf).image }
        ]))), a.push(r.SUBRULE2(r.formulaWithPercentOp));
      }), r.ACTION(() => {
        for (const c of this.binaryOperatorsPrecedence)
          for (let h = 0, p = i.length; h < p; h++) {
            const u = i[h];
            c.includes(u) && (i.splice(h, 1), a.splice(h, 2, this.utils.applyInfix(a[h], u, a[h + 1])), h--, p--);
          }
      }), a[0];
    }), r.RULE("plusMinusOp", () => r.OR([
      { ALT: () => r.CONSUME(Nr).image },
      { ALT: () => r.CONSUME(Ar).image }
    ])), r.RULE("formulaWithPercentOp", () => {
      let i = r.SUBRULE(r.formulaWithUnaryOp);
      return r.OPTION(() => {
        const a = r.CONSUME(eh).image;
        i = r.ACTION(() => this.utils.applyPostfix(i, a));
      }), i;
    }), r.RULE("formulaWithUnaryOp", () => {
      const i = [];
      r.MANY(() => {
        const c = r.OR([
          { ALT: () => r.CONSUME(Nr).image },
          { ALT: () => r.CONSUME(Ar).image }
        ]);
        i.push(c);
      });
      const a = r.SUBRULE(r.formulaWithIntersect);
      return i.length > 0 ? r.ACTION(() => this.utils.applyPrefix(i, a)) : a;
    }), r.RULE("formulaWithIntersect", () => {
      let i = r.SUBRULE(r.formulaWithRange);
      const a = [i];
      return r.MANY({
        GATE: () => {
          const c = r.LA(0);
          return r.LA(1).startOffset > c.endOffset + 1;
        },
        DEF: () => {
          a.push(r.SUBRULE3(r.formulaWithRange));
        }
      }), a.length > 1 ? r.ACTION(() => r.ACTION(() => this.utils.applyIntersect(a))) : i;
    }), r.RULE("formulaWithRange", () => {
      const i = r.SUBRULE(r.formula), a = [i];
      return r.MANY(() => {
        r.CONSUME(qf), a.push(r.SUBRULE2(r.formula));
      }), a.length > 1 ? r.ACTION(() => r.ACTION(() => this.utils.applyRange(a))) : i;
    }), r.RULE("formula", () => r.OR9([
      { ALT: () => r.SUBRULE(r.referenceWithoutInfix) },
      { ALT: () => r.SUBRULE(r.paren) },
      { ALT: () => r.SUBRULE(r.constant) },
      { ALT: () => r.SUBRULE(r.functionCall) },
      { ALT: () => r.SUBRULE(r.constantArray) }
    ])), r.RULE("paren", () => {
      r.CONSUME(Kf);
      let i;
      const a = [];
      return a.push(r.SUBRULE(r.formulaWithBinaryOp)), r.MANY(() => {
        r.CONSUME(Tn), a.push(r.SUBRULE2(r.formulaWithBinaryOp));
      }), a.length > 1 ? i = r.ACTION(() => this.utils.applyUnion(a)) : i = a[0], r.CONSUME(Ji), i;
    }), r.RULE("constantArray", () => {
      const i = [[]];
      let a = 0;
      return r.CONSUME(zf), i[a].push(r.SUBRULE(r.constantForArray)), r.MANY(() => {
        const c = r.OR([
          { ALT: () => r.CONSUME(Tn).image },
          { ALT: () => r.CONSUME(Yf).image }
        ]), h = r.SUBRULE2(r.constantForArray);
        c === "," || (a++, i[a] = []), i[a].push(h);
      }), r.CONSUME(Xf), r.ACTION(() => this.utils.toArray(i));
    }), r.RULE("constantForArray", () => r.OR([
      {
        ALT: () => {
          const i = r.OPTION(() => r.SUBRULE(r.plusMinusOp)), a = r.CONSUME(Qi).image, c = r.ACTION(() => this.utils.toNumber(a));
          return i ? r.ACTION(() => this.utils.applyPrefix([i], c)) : c;
        }
      },
      {
        ALT: () => {
          const i = r.CONSUME(Ki).image;
          return r.ACTION(() => this.utils.toString(i));
        }
      },
      {
        ALT: () => {
          const i = r.CONSUME(Zi).image;
          return r.ACTION(() => this.utils.toBoolean(i));
        }
      },
      {
        ALT: () => {
          const i = r.CONSUME(zi).image;
          return r.ACTION(() => this.utils.toError(i));
        }
      },
      {
        ALT: () => {
          const i = r.CONSUME(Xi).image;
          return r.ACTION(() => this.utils.toError(i));
        }
      }
    ])), r.RULE("constant", () => r.OR([
      {
        ALT: () => {
          const i = r.CONSUME(Qi).image;
          return r.ACTION(() => this.utils.toNumber(i));
        }
      },
      {
        ALT: () => {
          const i = r.CONSUME(Ki).image;
          return r.ACTION(() => this.utils.toString(i));
        }
      },
      {
        ALT: () => {
          const i = r.CONSUME(Zi).image;
          return r.ACTION(() => this.utils.toBoolean(i));
        }
      },
      {
        ALT: () => {
          const i = r.CONSUME(zi).image;
          return r.ACTION(() => this.utils.toError(i));
        }
      }
    ])), r.RULE("functionCall", () => {
      const i = r.CONSUME(Vf).image.slice(0, -1), a = r.SUBRULE(r.arguments);
      return r.CONSUME(Ji), r.ACTION(() => e.callFunction(i, a));
    }), r.RULE("arguments", () => {
      r.MANY2(() => {
        r.CONSUME2(Tn);
      });
      const i = [];
      return r.OPTION(() => {
        i.push(r.SUBRULE(r.formulaWithBinaryOp)), r.MANY(() => {
          r.CONSUME1(Tn), i.push(null), r.OPTION3(() => {
            i.pop(), i.push(r.SUBRULE2(r.formulaWithBinaryOp));
          });
        });
      }), i;
    }), r.RULE("referenceWithoutInfix", () => r.OR([
      { ALT: () => r.SUBRULE(r.referenceItem) },
      {
        // sheet name prefix
        ALT: () => {
          const i = r.SUBRULE(r.prefixName), a = r.SUBRULE2(r.formulaWithRange);
          return r.ACTION(() => {
            if (this.utils.isFormulaError(a))
              return a;
            a.ref.sheet = i;
          }), a;
        }
      }
      // {ALT: () => $.SUBRULE('dynamicDataExchange')},
    ])), r.RULE("referenceItem", () => r.OR([
      {
        ALT: () => {
          const i = r.CONSUME(Gf).image;
          return r.ACTION(() => this.utils.parseCellAddress(i));
        }
      },
      {
        ALT: () => {
          const i = r.CONSUME(Hf).image;
          return r.ACTION(() => e.getVariable(i));
        }
      },
      {
        ALT: () => {
          const i = r.CONSUME(Wf).image;
          return r.ACTION(() => this.utils.parseCol(i));
        }
      },
      // A row check should be here, but the token is same with Number,
      // In other to resolve ambiguities, I leave this empty, and
      // parse the number to row number when needed.
      {
        ALT: () => {
          const i = r.CONSUME(Xi).image;
          return r.ACTION(() => this.utils.toError(i));
        }
      }
      // {ALT: () => $.SUBRULE($.udfFunctionCall)},
      // {ALT: () => $.SUBRULE($.structuredReference)},
    ])), r.RULE("prefixName", () => r.OR([
      { ALT: () => r.CONSUME($f).image.slice(0, -1) },
      { ALT: () => r.CONSUME(Df).image.slice(1, -2).replace(/''/g, "'") }
    ])), this.performSelfAnalysis();
  }
}
var bs = {
  Parser: ah
};
const Qt = he(), { Address: ch } = ge(), { Prefix: lh, Postfix: uh, Infix: yr, Operators: Tr } = br, fh = Gn, ji = 1048576, eo = 16384, { NotAllInputParsedException: hh } = Zr;
let ph = class {
  constructor(e) {
    this.context = e;
  }
  columnNameToNumber(e) {
    return ch.columnNameToNumber(e);
  }
  /**
   * Parse the cell address only.
   * @param {string} cellAddress
   * @return {{ref: {col: number, address: string, row: number}}}
   */
  parseCellAddress(e) {
    const n = e.match(/([$]?)([A-Za-z]{1,3})([$]?)([1-9][0-9]*)/);
    return {
      ref: {
        address: n[0],
        col: this.columnNameToNumber(n[2]),
        row: +n[4]
      }
    };
  }
  parseRow(e) {
    const n = +e;
    if (!Number.isInteger(n))
      throw Error("Row number must be integer.");
    return {
      ref: {
        col: void 0,
        row: +e
      }
    };
  }
  parseCol(e) {
    return {
      ref: {
        col: this.columnNameToNumber(e),
        row: void 0
      }
    };
  }
  parseColRange(e, n) {
    return e = this.columnNameToNumber(e), n = this.columnNameToNumber(n), {
      ref: {
        from: {
          col: Math.min(e, n),
          row: null
        },
        to: {
          col: Math.max(e, n),
          row: null
        }
      }
    };
  }
  parseRowRange(e, n) {
    return {
      ref: {
        from: {
          col: null,
          row: Math.min(e, n)
        },
        to: {
          col: null,
          row: Math.max(e, n)
        }
      }
    };
  }
  _applyPrefix(e, n, r) {
    return this.isFormulaError(n) ? n : lh.unaryOp(e, n, r);
  }
  async applyPrefixAsync(e, n) {
    const { val: r, isArray: i } = this.extractRefValue(await n);
    return this._applyPrefix(e, r, i);
  }
  /**
   * Apply + or - unary prefix.
   * @param {Array.<string>} prefixes
   * @param {*} value
   * @return {*}
   */
  applyPrefix(e, n) {
    if (this.context.async)
      return this.applyPrefixAsync(e, n);
    {
      const { val: r, isArray: i } = this.extractRefValue(n);
      return this._applyPrefix(e, r, i);
    }
  }
  _applyPostfix(e, n, r) {
    return this.isFormulaError(e) ? e : uh.percentOp(e, r, n);
  }
  async applyPostfixAsync(e, n) {
    const { val: r, isArray: i } = this.extractRefValue(await e);
    return this._applyPostfix(r, i, n);
  }
  applyPostfix(e, n) {
    if (this.context.async)
      return this.applyPostfixAsync(e, n);
    {
      const { val: r, isArray: i } = this.extractRefValue(e);
      return this._applyPostfix(r, i, n);
    }
  }
  _applyInfix(e, n, r) {
    const i = e.val, a = e.isArray, c = r.val, h = r.isArray;
    if (this.isFormulaError(i))
      return i;
    if (this.isFormulaError(c))
      return c;
    if (Tr.compareOp.includes(n))
      return yr.compareOp(i, n, c, a, h);
    if (Tr.concatOp.includes(n))
      return yr.concatOp(i, n, c, a, h);
    if (Tr.mathOp.includes(n))
      return yr.mathOp(i, n, c, a, h);
    throw new Error(`Unrecognized infix: ${n}`);
  }
  async applyInfixAsync(e, n, r) {
    const i = this.extractRefValue(await e), a = this.extractRefValue(await r);
    return this._applyInfix(i, n, a);
  }
  applyInfix(e, n, r) {
    if (this.context.async)
      return this.applyInfixAsync(e, n, r);
    {
      const i = this.extractRefValue(e), a = this.extractRefValue(r);
      return this._applyInfix(i, n, a);
    }
  }
  applyIntersect(e) {
    if (this.isFormulaError(e[0]))
      return e[0];
    if (!e[0].ref)
      throw Error(`Expecting a reference, but got ${e[0]}.`);
    let n, r, i, a, c, h;
    const p = e.shift().ref;
    if (c = p.sheet, p.from)
      n = Math.max(p.from.row, p.to.row), i = Math.min(p.from.row, p.to.row), r = Math.max(p.from.col, p.to.col), a = Math.min(p.from.col, p.to.col);
    else {
      if (p.row === void 0 || p.col === void 0)
        throw Error("Cannot intersect the whole row or column.");
      n = i = p.row, r = a = p.col;
    }
    let u;
    return e.forEach((o) => {
      if (this.isFormulaError(o))
        return o;
      if (o = o.ref, !o)
        throw Error(`Expecting a reference, but got ${o}.`);
      if (o.from) {
        const s = Math.max(o.from.row, o.to.row), l = Math.min(o.from.row, o.to.row), f = Math.max(o.from.col, o.to.col), v = Math.min(o.from.col, o.to.col);
        (l > n || s < i || v > r || f < a || c !== o.sheet) && (u = Qt.NULL), n = Math.min(n, s), i = Math.max(i, l), r = Math.min(r, f), a = Math.max(a, v);
      } else {
        if (o.row === void 0 || o.col === void 0)
          throw Error("Cannot intersect the whole row or column.");
        (o.row > n || o.row < i || o.col > r || o.col < a || c !== o.sheet) && (u = Qt.NULL), n = i = o.row, r = a = o.col;
      }
    }), u || (n === i && r === a ? h = {
      ref: {
        sheet: c,
        row: n,
        col: r
      }
    } : h = {
      ref: {
        sheet: c,
        from: { row: i, col: a },
        to: { row: n, col: r }
      }
    }, h.ref.sheet || delete h.ref.sheet, h);
  }
  applyUnion(e) {
    const n = new fh();
    for (let r = 0; r < e.length; r++) {
      if (this.isFormulaError(e[r]))
        return e[r];
      n.add(this.extractRefValue(e[r]).val, e[r]);
    }
    return n;
  }
  /**
   * Apply multiple references, e.g. A1:B3:C8:A:1:.....
   * @param refs
   // * @return {{ref: {from: {col: number, row: number}, to: {col: number, row: number}}}}
   */
  applyRange(e) {
    let n, r = -1, i = -1, a = ji + 1, c = eo + 1;
    return e.forEach((h) => {
      if (this.isFormulaError(h))
        return h;
      typeof h == "number" && (h = this.parseRow(h)), h = h.ref, h.row === void 0 && (a = 1, r = ji), h.col === void 0 && (c = 1, i = eo), h.row > r && (r = h.row), h.row < a && (a = h.row), h.col > i && (i = h.col), h.col < c && (c = h.col);
    }), r === a && i === c ? n = {
      ref: {
        row: r,
        col: i
      }
    } : n = {
      ref: {
        from: { row: a, col: c },
        to: { row: r, col: i }
      }
    }, n;
  }
  /**
   * Throw away the refs, and retrieve the value.
   * @return {{val: *, isArray: boolean}}
   */
  extractRefValue(e) {
    let n = e, r = !1;
    return Array.isArray(n) && (r = !0), e.ref ? { val: this.context.retrieveRef(e), isArray: r } : { val: n, isArray: r };
  }
  /**
   *
   * @param array
   * @return {Array}
   */
  toArray(e) {
    return e;
  }
  /**
   * @param {string} number
   * @return {number}
   */
  toNumber(e) {
    return Number(e);
  }
  /**
   * @param {string} string
   * @return {string}
   */
  toString(e) {
    return e.substring(1, e.length - 1).replace(/""/g, '"');
  }
  /**
   * @param {string} bool
   * @return {boolean}
   */
  toBoolean(e) {
    return e === "TRUE";
  }
  /**
   * Parse an error.
   * @param {string} error
   * @return {string}
   */
  toError(e) {
    return new Qt(e.toUpperCase());
  }
  isFormulaError(e) {
    return e instanceof Qt;
  }
  static formatChevrotainError(e, n) {
    let r, i, a = "";
    return e instanceof hh ? (r = e.token.startLine, i = e.token.startColumn) : (r = e.previousToken.startLine, i = e.previousToken.startColumn + 1), a += `
` + n.split(`
`)[r - 1] + `
`, a += Array(i - 1).fill(" ").join("") + `^
`, a += `Error at position ${r}:${i}
` + e.message, e.errorLocation = { line: r, column: i }, Qt.ERROR(a, e);
  }
};
var Ds = ph;
const dh = Po, to = So, no = Fa, ro = Va, io = Ka, oo = Za, so = nc, ao = uc, co = yc, vh = Mc, be = he(), { FormulaHelpers: Ut } = ge(), { Parser: gh, allTokens: Eh } = bs, lo = jr, wr = Ds;
let mh = class {
  /**
   * @param {{functions: {}, functionsNeedContext: {}, onVariable: function, onCell: function, onRange: function}} [config]
   * @param isTest - is in testing environment
   */
  constructor(e, n = !1) {
    this.logs = [], this.isTest = n, this.utils = new wr(this), e = Object.assign({
      functions: {},
      functionsNeedContext: {},
      onVariable: () => null,
      onCell: () => 0,
      onRange: () => [[0]]
    }, e), this.onVariable = e.onVariable, this.functions = Object.assign(
      {},
      co,
      ao,
      so,
      oo,
      io,
      ro,
      dh,
      to,
      no,
      vh,
      e.functions,
      e.functionsNeedContext
    ), this.onRange = e.onRange, this.onCell = e.onCell, this.funsNullAs0 = Object.keys(to).concat(Object.keys(no)).concat(Object.keys(ro)).concat(Object.keys(io)).concat(Object.keys(oo)).concat(Object.keys(ao)).concat(Object.keys(co)), this.funsNeedContextAndNoDataRetrieve = ["ROW", "ROWS", "COLUMN", "COLUMNS", "SUMIF", "INDEX", "AVERAGEIF", "IF"], this.funsNeedContext = [
      ...Object.keys(e.functionsNeedContext),
      ...this.funsNeedContextAndNoDataRetrieve,
      "INDEX",
      "OFFSET",
      "INDIRECT",
      "IF",
      "CHOOSE",
      "WEBSERVICE"
    ], this.funsPreserveRef = Object.keys(so), this.parser = new gh(this, this.utils);
  }
  /**
   * Get all lexing token names. Webpack needs this.
   * @return {Array.<string>} - All token names that should not be minimized.
   */
  static get allTokens() {
    return Eh;
  }
  /**
   * Get value from the cell reference
   * @param ref
   * @return {*}
   */
  getCell(e) {
    return e.sheet == null && (e.sheet = this.position ? this.position.sheet : void 0), this.onCell(e);
  }
  /**
   * Get values from the range reference.
   * @param ref
   * @return {*}
   */
  getRange(e) {
    return e.sheet == null && (e.sheet = this.position ? this.position.sheet : void 0), this.onRange(e);
  }
  /**
   * TODO:
   * Get references or values from a user defined variable.
   * @param name
   * @return {*}
   */
  getVariable(e) {
    const n = { ref: this.onVariable(e, this.position.sheet, this.position) };
    return n.ref == null ? be.NAME : n;
  }
  /**
   * Retrieve values from the given reference.
   * @param valueOrRef
   * @return {*}
   */
  retrieveRef(e) {
    return Ut.isRangeRef(e) ? this.getRange(e.ref) : Ut.isCellRef(e) ? this.getCell(e.ref) : e;
  }
  /**
   * Call an excel function.
   * @param name - Function name.
   * @param args - Arguments that pass to the function.
   * @return {*}
   */
  _callFunction(e, n) {
    e.indexOf("_xlfn.") === 0 && (e = e.slice(6)), e = e.toUpperCase();
    const r = this.funsNullAs0.includes(e) ? 0 : "";
    if (this.funsNeedContextAndNoDataRetrieve.includes(e) || (n = n.map((i) => {
      if (i === null)
        return { value: r, isArray: !1, omitted: !0 };
      const a = this.utils.extractRefValue(i);
      return this.funsPreserveRef.includes(e) ? { value: a.val, isArray: a.isArray, ref: i.ref } : {
        value: a.val,
        isArray: a.isArray,
        isRangeRef: !!Ut.isRangeRef(i),
        isCellRef: !!Ut.isCellRef(i)
      };
    })), this.functions[e]) {
      let i;
      try {
        !this.funsNeedContextAndNoDataRetrieve.includes(e) && !this.funsNeedContext.includes(e) ? i = this.functions[e](...n) : i = this.functions[e](this, ...n);
      } catch (a) {
        if (a instanceof be)
          return a;
        throw a;
      }
      if (i === void 0) {
        if (this.isTest)
          return this.logs.includes(e) || this.logs.push(e), { value: 0, ref: {} };
        throw be.NOT_IMPLEMENTED(e);
      }
      return i;
    } else {
      if (this.isTest)
        return this.logs.includes(e) || this.logs.push(e), { value: 0, ref: {} };
      throw be.NOT_IMPLEMENTED(e);
    }
  }
  async callFunctionAsync(e, n) {
    const r = [];
    for (const a of n)
      r.push(await a);
    const i = await this._callFunction(e, r);
    return Ut.checkFunctionResult(i);
  }
  callFunction(e, n) {
    if (this.async)
      return this.callFunctionAsync(e, n);
    {
      const r = this._callFunction(e, n);
      return Ut.checkFunctionResult(r);
    }
  }
  /**
   * Return currently supported functions.
   * @return {this}
   */
  supportedFunctions() {
    const e = [];
    return Object.keys(this.functions).forEach((r) => {
      try {
        if (this.functions[r](0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0) === void 0)
          return;
        e.push(r);
      } catch (i) {
        i instanceof Error && e.push(r);
      }
    }), e.sort();
  }
  /**
   * Check and return the appropriate formula result.
   * @param result
   * @param {boolean} [allowReturnArray] - If the formula can return an array
   * @return {*}
   */
  checkFormulaResult(e, n = !1) {
    const r = typeof e;
    if (r === "number") {
      if (isNaN(e))
        return be.VALUE;
      if (!isFinite(e))
        return be.NUM;
      e += 0;
    } else if (r === "object") {
      if (e instanceof be)
        return e;
      if (n) {
        if (e.ref && (e = this.retrieveRef(e)), typeof e == "object" && !Array.isArray(e) && e != null)
          return be.VALUE;
      } else if (e.ref && e.ref.row && !e.ref.from)
        e = this.retrieveRef(e);
      else if (e.ref && e.ref.from && e.ref.from.col === e.ref.to.col)
        e = this.retrieveRef({
          ref: {
            row: e.ref.from.row,
            col: e.ref.from.col
          }
        });
      else if (Array.isArray(e))
        e = e[0][0];
      else
        return be.VALUE;
    }
    return e;
  }
  /**
   * Parse an excel formula.
   * @param {string} inputText
   * @param {{row: number, col: number}} [position] - The position of the parsed formula
   *              e.g. {row: 1, col: 1}
   * @param {boolean} [allowReturnArray] - If the formula can return an array. Useful when parsing array formulas,
   *                                      or data validation formulas.
   * @returns {*}
   */
  parse(e, n, r = !1) {
    if (e.length === 0)
      throw Error("Input must not be empty.");
    this.position = n, this.async = !1;
    const i = lo.lex(e);
    this.parser.input = i.tokens;
    let a;
    try {
      if (a = this.parser.formulaWithBinaryOp(), a = this.checkFormulaResult(a, r), a instanceof be)
        return a;
    } catch (c) {
      throw be.ERROR(c.message, c);
    }
    if (this.parser.errors.length > 0) {
      const c = this.parser.errors[0];
      throw wr.formatChevrotainError(c, e);
    }
    return a;
  }
  /**
   * Parse an excel formula asynchronously.
   * Use when providing custom async functions.
   * @param {string} inputText
   * @param {{row: number, col: number}} [position] - The position of the parsed formula
   *              e.g. {row: 1, col: 1}
   * @param {boolean} [allowReturnArray] - If the formula can return an array. Useful when parsing array formulas,
   *                                      or data validation formulas.
   * @returns {*}
   */
  async parseAsync(e, n, r = !1) {
    if (e.length === 0)
      throw Error("Input must not be empty.");
    this.position = n, this.async = !0;
    const i = lo.lex(e);
    this.parser.input = i.tokens;
    let a;
    try {
      if (a = await this.parser.formulaWithBinaryOp(), a = this.checkFormulaResult(a, r), a instanceof be)
        return a;
    } catch (c) {
      throw be.ERROR(c.message, c);
    }
    if (this.parser.errors.length > 0) {
      const c = this.parser.errors[0];
      throw wr.formatChevrotainError(c, e);
    }
    return a;
  }
};
var Rh = {
  FormulaParser: mh,
  FormulaHelpers: Ut
};
const wn = he(), { FormulaHelpers: Xh, Types: Qh, Address: Nh } = ge(), Ah = Gn, uo = 1048576, fo = 16384;
let yh = class {
  constructor(e) {
    this.context = e;
  }
  columnNameToNumber(e) {
    return Nh.columnNameToNumber(e);
  }
  /**
   * Parse the cell address only.
   * @param {string} cellAddress
   * @return {{ref: {col: number, address: string, row: number}}}
   */
  parseCellAddress(e) {
    const n = e.match(/([$]?)([A-Za-z]{1,3})([$]?)([1-9][0-9]*)/);
    return {
      ref: {
        col: this.columnNameToNumber(n[2]),
        row: +n[4]
      }
    };
  }
  parseRow(e) {
    const n = +e;
    if (!Number.isInteger(n))
      throw Error("Row number must be integer.");
    return {
      ref: {
        col: void 0,
        row: +e
      }
    };
  }
  parseCol(e) {
    return {
      ref: {
        col: this.columnNameToNumber(e),
        row: void 0
      }
    };
  }
  /**
   * Apply + or - unary prefix.
   * @param {Array.<string>} prefixes
   * @param {*} value
   * @return {*}
   */
  applyPrefix(e, n) {
    return this.extractRefValue(n), 0;
  }
  applyPostfix(e, n) {
    return this.extractRefValue(e), 0;
  }
  applyInfix(e, n, r) {
    return this.extractRefValue(e), this.extractRefValue(r), 0;
  }
  applyIntersect(e) {
    if (this.isFormulaError(e[0]))
      return e[0];
    if (!e[0].ref)
      throw Error(`Expecting a reference, but got ${e[0]}.`);
    let n, r, i, a, c, h;
    const p = e.shift().ref;
    if (c = p.sheet, p.from)
      n = Math.max(p.from.row, p.to.row), i = Math.min(p.from.row, p.to.row), r = Math.max(p.from.col, p.to.col), a = Math.min(p.from.col, p.to.col);
    else {
      if (p.row === void 0 || p.col === void 0)
        throw Error("Cannot intersect the whole row or column.");
      n = i = p.row, r = a = p.col;
    }
    let u;
    return e.forEach((o) => {
      if (this.isFormulaError(o))
        return o;
      if (o = o.ref, !o)
        throw Error(`Expecting a reference, but got ${o}.`);
      if (o.from) {
        const s = Math.max(o.from.row, o.to.row), l = Math.min(o.from.row, o.to.row), f = Math.max(o.from.col, o.to.col), v = Math.min(o.from.col, o.to.col);
        (l > n || s < i || v > r || f < a || c !== o.sheet) && (u = wn.NULL), n = Math.min(n, s), i = Math.max(i, l), r = Math.min(r, f), a = Math.max(a, v);
      } else {
        if (o.row === void 0 || o.col === void 0)
          throw Error("Cannot intersect the whole row or column.");
        (o.row > n || o.row < i || o.col > r || o.col < a || c !== o.sheet) && (u = wn.NULL), n = i = o.row, r = a = o.col;
      }
    }), u || (n === i && r === a ? h = {
      ref: {
        sheet: c,
        row: n,
        col: r
      }
    } : h = {
      ref: {
        sheet: c,
        from: { row: i, col: a },
        to: { row: n, col: r }
      }
    }, h.ref.sheet || delete h.ref.sheet, h);
  }
  applyUnion(e) {
    const n = new Ah();
    for (let r = 0; r < e.length; r++) {
      if (this.isFormulaError(e[r]))
        return e[r];
      n.add(this.extractRefValue(e[r]).val, e[r]);
    }
    return n;
  }
  /**
   * Apply multiple references, e.g. A1:B3:C8:A:1:.....
   * @param refs
   // * @return {{ref: {from: {col: number, row: number}, to: {col: number, row: number}}}}
   */
  applyRange(e) {
    let n, r = -1, i = -1, a = uo + 1, c = fo + 1;
    return e.forEach((h) => {
      if (this.isFormulaError(h))
        return h;
      typeof h == "number" && (h = this.parseRow(h)), h = h.ref, h.row === void 0 && (a = 1, r = uo), h.col === void 0 && (c = 1, i = fo), h.row > r && (r = h.row), h.row < a && (a = h.row), h.col > i && (i = h.col), h.col < c && (c = h.col);
    }), r === a && i === c ? n = {
      ref: {
        row: r,
        col: i
      }
    } : n = {
      ref: {
        from: { row: a, col: c },
        to: { row: r, col: i }
      }
    }, n;
  }
  /**
   * Throw away the refs, and retrieve the value.
   * @return {{val: *, isArray: boolean}}
   */
  extractRefValue(e) {
    const n = Array.isArray(e);
    return e.ref ? { val: this.context.retrieveRef(e), isArray: n } : { val: e, isArray: n };
  }
  /**
   *
   * @param array
   * @return {Array}
   */
  toArray(e) {
    return e;
  }
  /**
   * @param {string} number
   * @return {number}
   */
  toNumber(e) {
    return Number(e);
  }
  /**
   * @param {string} string
   * @return {string}
   */
  toString(e) {
    return e.substring(1, e.length - 1).replace(/""/g, '"');
  }
  /**
   * @param {string} bool
   * @return {boolean}
   */
  toBoolean(e) {
    return e === "TRUE";
  }
  /**
   * Parse an error.
   * @param {string} error
   * @return {FormulaError}
   */
  toError(e) {
    return new wn(e.toUpperCase());
  }
  isFormulaError(e) {
    return e instanceof wn;
  }
};
var Th = yh;
const ho = he(), { FormulaHelpers: Cr } = ge(), { Parser: wh } = bs, Ch = jr, po = Th, { formatChevrotainError: Ih } = Ds;
let Oh = class {
  /**
   *
   * @param {{onVariable: Function}} [config]
   */
  constructor(e) {
    this.data = [], this.utils = new po(this), e = Object.assign({
      onVariable: () => null
    }, e), this.utils = new po(this), this.onVariable = e.onVariable, this.functions = {}, this.parser = new wh(this, this.utils);
  }
  /**
   * Get value from the cell reference
   * @param ref
   * @return {*}
   */
  getCell(e) {
    return e.row != null && (e.sheet == null && (e.sheet = this.position ? this.position.sheet : void 0), this.data.findIndex((r) => r.from && r.from.row <= e.row && r.to.row >= e.row && r.from.col <= e.col && r.to.col >= e.col || r.row === e.row && r.col === e.col && r.sheet === e.sheet) === -1 && this.data.push(e)), 0;
  }
  /**
   * Get values from the range reference.
   * @param ref
   * @return {*}
   */
  getRange(e) {
    return e.from.row != null && (e.sheet == null && (e.sheet = this.position ? this.position.sheet : void 0), this.data.findIndex((r) => r.from && r.from.row === e.from.row && r.from.col === e.from.col && r.to.row === e.to.row && r.to.col === e.to.col) === -1 && this.data.push(e)), [[0]];
  }
  /**
   * TODO:
   * Get references or values from a user defined variable.
   * @param name
   * @return {*}
   */
  getVariable(e) {
    const n = { ref: this.onVariable(e, this.position.sheet) };
    return n.ref == null ? ho.NAME : (Cr.isCellRef(n) ? this.getCell(n.ref) : this.getRange(n.ref), 0);
  }
  /**
   * Retrieve values from the given reference.
   * @param valueOrRef
   * @return {*}
   */
  retrieveRef(e) {
    return Cr.isRangeRef(e) ? this.getRange(e.ref) : Cr.isCellRef(e) ? this.getCell(e.ref) : e;
  }
  /**
   * Call an excel function.
   * @param name - Function name.
   * @param args - Arguments that pass to the function.
   * @return {*}
   */
  callFunction(e, n) {
    return n.forEach((r) => {
      r != null && this.retrieveRef(r);
    }), { value: 0, ref: {} };
  }
  /**
   * Check and return the appropriate formula result.
   * @param result
   * @return {*}
   */
  checkFormulaResult(e) {
    this.retrieveRef(e);
  }
  /**
   * Parse an excel formula and return the dependencies
   * @param {string} inputText
   * @param {{row: number, col: number, sheet: string}} position
   * @param {boolean} [ignoreError=false] if true, throw FormulaError when error occurred.
   *                                      if false, the parser will return partial dependencies.
   * @returns {Array.<{}>}
   */
  parse(e, n, r = !1) {
    if (e.length === 0)
      throw Error("Input must not be empty.");
    this.data = [], this.position = n;
    const i = Ch.lex(e);
    this.parser.input = i.tokens;
    try {
      const a = this.parser.formulaWithBinaryOp();
      this.checkFormulaResult(a);
    } catch (a) {
      if (!r)
        throw ho.ERROR(a.message, a);
    }
    if (this.parser.errors.length > 0 && !r) {
      const a = this.parser.errors[0];
      throw Ih(a, e);
    }
    return this.data;
  }
};
var Mh = {
  DepParser: Oh
};
const { FormulaParser: Vs } = Rh, { DepParser: Uh } = Mh, Lh = Mo, _h = he();
Object.assign(Vs, {
  MAX_ROW: 1048576,
  MAX_COLUMN: 16384,
  SSF: Lh,
  DepParser: Uh,
  FormulaError: _h,
  ...ge()
});
var Gs = Vs;
const Ph = /* @__PURE__ */ ha(Gs);
class kh {
  constructor(e) {
    U(this, "parser");
    U(this, "depParser");
    U(this, "root");
    this.root = e, this.parser = new Ph({
      onCell: ({ col: n, row: r }) => {
        const i = this.root.data[r - 1][n - 1], a = i.resultValue.length > 0 ? i.resultValue : i.value;
        return a && isNaN(Number(a)) === !1 ? Number(a) : this.root.data[r - 1][n - 1].resultValue ?? "";
      }
    }), this.depParser = new Gs.DepParser({}), this.depParser;
  }
}
const Wt = "modern_sc_";
class xh {
  constructor(e, n) {
    U(this, "table");
    U(this, "scroller");
    U(this, "toolbar");
    U(this, "rowsBar");
    U(this, "columnsBar");
    U(this, "sheet");
    U(this, "editor");
    U(this, "styles");
    U(this, "config");
    U(this, "data");
    U(this, "viewport");
    U(this, "selection");
    U(this, "cache");
    U(this, "events");
    U(this, "clipboard");
    U(this, "formulaParser");
    const r = oa(40, 40), i = this.makeConfigFromData(
      r,
      (n == null ? void 0 : n.view) ?? { height: 600, width: 800 }
    );
    n != null && n.view && (i.view = n.view), this.config = new ri(i), this.config.onCellClick = (n == null ? void 0 : n.onCellClick) ?? null, this.config.onSelectonChange = (n == null ? void 0 : n.onSelectionChange) ?? null, this.config.onCellChange = (n == null ? void 0 : n.onCellChange) ?? null, this.config.onCopy = (n == null ? void 0 : n.onCopy) ?? null, this.rowsBar = new ua(this), this.columnsBar = new la(this), this.sheet = new js(this), this.table = new ea(this), this.scroller = new Qs(this), this.toolbar = new ta(this), this.editor = new Xs(this), this.cache = this.getInitialCache(), this.viewport = new ii(
      this,
      this.scroller.getViewportBoundlingRect()
    ), this.selection = new Fr(), this.events = new zs(this), this.clipboard = new fa(this), this.formulaParser = new kh(this), this.data = r, this.styles = new na(), this.buildComponent(), this.setElementsPositions(), this.appendTableToTarget(e), this.renderSheet(), this.renderColumnsBar(), this.renderRowsBar();
  }
  setRowsBarPosition() {
    const e = this.columnsBar.height + this.toolbar.height, n = 0;
    this.rowsBar.setElementPosition(e, n);
  }
  setColumnsBarPosition() {
    const e = this.toolbar.height, n = this.rowsBar.width;
    this.columnsBar.setElementPosition(e, n);
  }
  setElementsPositions() {
    this.setRowsBarPosition(), this.setColumnsBarPosition();
  }
  getInitialCache() {
    const e = [];
    let n = 0;
    for (let c = 0; c <= this.config.columns.length - 1; c++) {
      const h = this.config.columns[c];
      n += h.width;
      const p = new sa({
        xPos: n,
        colIdx: c
      });
      e.push(p);
    }
    const r = [];
    let i = 0;
    for (let c = 0; c <= this.config.rows.length - 1; c++) {
      const h = this.config.rows[c];
      i += h.height;
      const p = new aa({
        yPos: i,
        rowIdx: c
      });
      r.push(p);
    }
    return new ca({
      columns: e,
      rows: r
    });
  }
  buildComponent() {
    const e = document.createElement("div");
    e.style.top = this.columnsBarHeight + "px", e.style.left = this.rowsBarWidth + "px", e.appendChild(this.sheet.element), e.classList.add(Wt + "content"), this.table.element.appendChild(this.toolbar.element), this.table.element.appendChild(this.rowsBar.element), this.table.element.appendChild(this.columnsBar.element), this.table.element.appendChild(e), this.table.element.appendChild(this.scroller.element), this.table.element.append(this.editor.element);
  }
  /**Destroy spreadsheet DOM element.
   *
   * May be usefull when need to rerender component.
   */
  destroy() {
    this.table.element.remove();
  }
  appendTableToTarget(e) {
    if (typeof e == "string") {
      const n = document.querySelector(e);
      if (!n)
        throw new Error(
          `Element with selector ${e} is not finded in DOM.
 Make sure it exists.`
        );
      n == null || n.appendChild(this.table.element);
    }
    e instanceof HTMLElement && e.append(this.table.element);
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
  getCellByCoords(e, n) {
    return this.sheet.getCellByCoords(e, n);
  }
  getCell(e) {
    const { column: n, row: r } = e;
    return this.data[r][n];
  }
  changeCellValues(e, n, r = !0) {
    const { column: i, row: a } = e;
    this.data[a][i].changeValues(n), this.events.dispatch({
      type: yt.CELL_CHANGE,
      cell: this.data[a][i],
      enableCallback: r
    }), this.renderCell(a, i);
  }
  changeCellStyles(e, n) {
    const { column: r, row: i } = e;
    this.data[i][r].changeStyles(n), this.renderCell(i, r);
  }
  applyActionToRange(e, n) {
    const r = Math.min(e.from.row, e.to.row), i = Math.max(e.from.row, e.to.row), a = Math.min(e.from.column, e.to.column), c = Math.max(e.from.column, e.to.column);
    for (let h = r; h <= i; h++)
      for (let p = a; p <= c; p++) {
        const u = this.data[h][p];
        n(u);
      }
  }
  deleteSelectedCellsValues() {
    if (this.selection.selectedRange !== null)
      this.applyActionToRange(this.selection.selectedRange, (e) => {
        this.changeCellValues(e.position, {
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
  showEditor(e, n) {
    this.editor.show(e, n);
  }
  renderSheet() {
    this.sheet.renderSheet();
  }
  renderSelection() {
    this.sheet.renderSelection();
  }
  renderColumnsBar() {
    this.columnsBar.renderBar();
  }
  renderRowsBar() {
    this.rowsBar.renderBar();
  }
  renderCell(e, n) {
    this.data[e][n].render(this);
  }
  loadData(e) {
    const n = e.length, r = e[0] ? e[0].length : 0;
    this.data = [];
    const i = [];
    for (let c = 0; c < n; c++) {
      const h = [];
      for (let p = 0; p < r; p++) {
        const u = e[c][p];
        h.push(
          new Br({
            displayValue: u.displayValue,
            position: u.position,
            resultValue: u.resultValue,
            value: u.value,
            style: u.style
          })
        );
      }
      i.push(h);
    }
    const a = this.makeConfigFromData(i, this.config.view);
    return a.onCellChange = this.config.onCellChange, a.onCellClick = this.config.onCellClick, a.onCopy = this.config.onCopy, a.onSelectonChange = this.config.onSelectonChange, this.data = i, this.selection.selectedCell = null, this.selection.selectedRange = null, this.config = a, this.cache = this.getInitialCache(), this.scroller.updateScrollerSize(), this.viewport = new ii(
      this,
      this.scroller.getViewportBoundlingRect()
    ), this.renderSheet(), this;
  }
  makeConfigFromData(e, n) {
    const r = e.length - 1, i = e[0] ? e[0].length : 0, a = [];
    for (let p = 0; p < r; p++)
      a.push(
        new ia({
          height: 40,
          title: String(p)
        })
      );
    const c = [];
    for (let p = 0; p < i; p++)
      c.push(
        new ra({
          width: 150,
          title: String(p)
        })
      );
    return new ri({
      view: n,
      rows: a,
      columns: c,
      onCellClick: null
    });
  }
  serializeData() {
    const e = this.data.length, n = this.data[0] ? this.data[0].length : 0, r = [];
    for (let i = 0; i < e; i++) {
      const a = [];
      for (let c = 0; c < n; c++)
        a.push(this.data[i][c].getSerializableCell());
      r.push(a);
    }
    return r;
  }
}
const Sh = {
  onCellClick: (t, e) => {
    console.log("Cell click", t, e);
  },
  onSelectionChange: (t) => {
    console.log("Changed selection: ", t);
  },
  onCellChange(t) {
    console.log("Cell changed: ", t);
  },
  onCopy: (t, e, n) => {
    console.log("Copy event: ", t, e, n);
  }
}, $s = new xh("#spreadsheet", Sh);
function Bh() {
  const t = $s.serializeData();
  localStorage.setItem("sheet", JSON.stringify(t));
}
function Fh() {
  const t = localStorage.getItem("sheet");
  if (!t)
    return;
  const e = JSON.parse(t);
  $s.loadData(e);
}
const Hs = document.querySelector("#save_button"), Ws = document.querySelector("#load_button");
if (!Hs || !Ws)
  throw new Error("LOST");
Hs.addEventListener("click", Bh);
Ws.addEventListener("click", Fh);
//# sourceMappingURL=demo.js.map

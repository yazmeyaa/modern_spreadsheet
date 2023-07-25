"use strict";var E=Object.defineProperty;var I=(r,e,t)=>e in r?E(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var o=(r,e,t)=>(I(r,typeof e!="symbol"?e+"":e,t),t);Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});class w{constructor(e,t){o(this,"x");o(this,"y");o(this,"width");o(this,"height");this.x=this.getXCoord(t.column,e),this.y=this.getYCoord(t.row,e),this.width=e.columns[t.column].width,this.height=e.rows[t.row].height}getXCoord(e,t){let s=0;for(let l=0;l<e;l++)s+=t.columns[l].width;return s}getYCoord(e,t){let s=0;for(let l=0;l<e;l++)s+=t.rows[l].height;return s}}class L{constructor(e){o(this,"element");o(this,"root");o(this,"handleKeydown",e=>{const{key:t}=e;switch(t){case"Escape":{this.hide();break}case"Enter":this.root.changeCellValues(this.root.selection.selectedCell,{value:this.element.value,displayValue:this.element.value}),this.hide()}});o(this,"handleClickOutside",e=>{const t=e.target;this.element.contains(t)||this.hide()});this.root=e;const t=document.createElement("input");t.classList.add("editor"),this.element=t,this.hide()}hide(){this.element.style.display="none",this.element.classList.add("hide"),this.element.blur(),window.removeEventListener("click",this.handleClickOutside),this.element.removeEventListener("keydown",this.handleKeydown),this.root.focusTable()}show(e){const{height:t,width:s,x:l,y:n}=new w(this.root.config,e),i=this.root.getCell(e);this.element.classList.remove("hide"),this.element.style.top=n-this.root.viewport.top+"px",this.element.style.left=l-this.root.viewport.left+"px",this.element.style.width=s+"px",this.element.style.height=t+"px",this.element.style.display="block",window.addEventListener("click",this.handleClickOutside),this.element.addEventListener("keydown",this.handleKeydown),this.element.value=i.value,this.element.focus(),this.element.select()}}class A{constructor(e){o(this,"element");o(this,"root");this.root=e;const t=document.createElement("header");t.classList.add(),this.element=t}}class B{constructor(e){o(this,"element");o(this,"verticalScroller");o(this,"horizontalScroller");o(this,"root");o(this,"isSelecting",!1);o(this,"handleMouseMove",e=>{if(!this.isSelecting)return;const{offsetX:t,offsetY:s}=e,l=this.root.getCellByCoords(t,s);this.root.selection.selectedRange&&(this.root.selection.selectedRange.to=l),this.root.renderSheet()});o(this,"handleMouseUp",()=>{this.isSelecting=!1,this.root.selection.selectedRange&&this.root.selection.selectedRange.from.row===this.root.selection.selectedRange.to.row&&this.root.selection.selectedRange.from.column===this.root.selection.selectedRange.to.column&&(this.root.selection.selectedRange=null),this.root.renderSheet()});o(this,"handleDoubleClick",e=>{e.preventDefault();const t=this.root.getCellByCoords(e.offsetX,e.offsetY);this.root.showEditor(t)});o(this,"handleKeydown",e=>{if(console.log(e),["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key))switch(e.preventDefault(),this.root.selection.selectedRange=null,e.key){case"ArrowLeft":{this.root.selection.selectedCell&&this.root.selection.selectedCell.column>0&&(console.log("tick"),this.root.selection.selectedCell.column-=1,this.root.renderSheet());break}case"ArrowRight":{this.root.selection.selectedCell&&this.root.selection.selectedCell.column<this.root.config.columns.length-1&&(this.root.selection.selectedCell.column+=1,this.root.renderSheet());break}case"ArrowUp":{this.root.selection.selectedCell&&this.root.selection.selectedCell.row>0&&(this.root.selection.selectedCell.row-=1,this.root.renderSheet());break}case"ArrowDown":{this.root.selection.selectedCell&&this.root.selection.selectedCell.row<this.root.config.rows.length-1&&(this.root.selection.selectedCell.row+=1,this.root.renderSheet());break}}if(!e.metaKey&&!e.ctrlKey&&(e.key==="F2"||/^([a-z]|[а-я])$/.test(e.key.toLowerCase()))){if(e.preventDefault(),!this.root.selection.selectedCell)return;this.root.showEditor(this.root.selection.selectedCell)}e.key==="Delete"&&(e.preventDefault(),this.root.deleteSelectedCellsValues(),this.root.renderSheet())});o(this,"handleClick",e=>{if(e.button!==0)return;const{offsetX:t,offsetY:s}=e,l=this.root.getCellByCoords(t,s);this.isSelecting=!0,this.root.selection.selectedRange={from:l,to:l},this.root.selection.selectedCell=l,this.root.renderSheet()});o(this,"handleScroll",()=>{const e=this.getViewportBoundlingRect();this.root.viewport.updateValues(e),this.root.renderSheet()});this.root=e;const{horizontalScroller:t,scroller:s,verticalScroller:l}=this.buildComponent();this.element=s,this.verticalScroller=l,this.horizontalScroller=t,this.element.style.height=this.root.config.view.height+"px",this.element.style.width=this.root.config.view.width+"px",this.element.tabIndex=-1,this.updateScrollerSize(),this.element.addEventListener("scroll",this.handleScroll),this.element.addEventListener("mousedown",this.handleClick),this.element.addEventListener("mousemove",this.handleMouseMove),this.element.addEventListener("mouseup",this.handleMouseUp),this.element.addEventListener("dblclick",this.handleDoubleClick),this.element.addEventListener("keydown",this.handleKeydown)}getViewportBoundlingRect(){const{scrollTop:e,scrollLeft:t}=this.element,{height:s,width:l}=this.element.getBoundingClientRect(),n=e+s,i=t+l;return{top:e,left:t,bottom:n,right:i}}buildComponent(){const e=document.createElement("div"),t=document.createElement("div"),s=document.createElement("div"),l=document.createElement("div"),n=document.createElement("div");return t.style.width="0px",t.style.pointerEvents="none",s.style.pointerEvents="none",l.style.display="flex",n.appendChild(t),n.appendChild(s),l.appendChild(n),this.verticalScroller=t,this.horizontalScroller=s,e.appendChild(l),e.classList.add("scroller"),{scroller:e,verticalScroller:t,horizontalScroller:s}}getActualHeight(){return this.root.config.rows.reduce((e,t)=>(e+=t.height,e),0)}getActualWidth(){return this.root.config.columns.reduce((e,t)=>(e+=t.width,e),0)}updateScrollerSize(){const e=this.getActualHeight(),t=this.getActualWidth();this.setScrollerHeight(e),this.setScrollerWidth(t)}setScrollerHeight(e){this.verticalScroller.style.height=e+"px"}setScrollerWidth(e){this.horizontalScroller.style.width=e+"px"}}class p{constructor(e){o(this,"fontSize",16);o(this,"fontColor","black");o(this,"background","white");o(this,"borderColor","black");o(this,"selectedBackground","#4287f5");o(this,"selectedFontColor","#ffffff");e&&Object.assign(this,e)}}class y{constructor(e,t){o(this,"row");o(this,"column");this.row=e,this.column=t}}class S{constructor(e){o(this,"value");o(this,"displayValue");o(this,"resultValue");o(this,"position");o(this,"style");this.value=e.value,this.displayValue=e.displayValue,this.resultValue=e.resultValue,this.position=e.position,this.style=e.style}}class g{constructor(e){o(this,"value");o(this,"displayValue");o(this,"resultValue");o(this,"position");o(this,"style",new p);this.value=e.value,this.displayValue=e.displayValue,this.resultValue=e.resultValue,this.position=e.position}getSerializableCell(){return new S({displayValue:this.displayValue,position:this.position,resultValue:this.resultValue,style:this.style,value:this.value})}changeValues(e){Object.assign(this,e)}isCellInRange(e){const{column:t,row:s}=this.position,{selectedRange:l}=e.selection;if(!l)return!1;const n=s>=Math.min(l.from.row,l.to.row)&&s<=Math.max(l.to.row,l.from.row);return t>=Math.min(l.from.column,l.to.column)&&t<=Math.max(l.to.column,l.from.column)&&n}render(e){var a;let{height:t,width:s,x:l,y:n}=new w(e.config,this.position);const{ctx:i}=e,c=((a=e.selection.selectedCell)==null?void 0:a.row)===this.position.row&&e.selection.selectedCell.column===this.position.column,h=this.isCellInRange(e);n-=e.viewport.top,l-=e.viewport.left,i.clearRect(l,n,s,t),i.fillStyle=c||h?this.style.selectedBackground:this.style.background,i.strokeStyle="black",i.fillRect(l,n,s-1,t-1),i.strokeRect(l,n,s,t),i.fillStyle=c||h?this.style.selectedFontColor:this.style.fontColor,i.textAlign="left",i.font=`${this.style.fontSize}px Arial`,i.textBaseline="middle",i.fillText(this.displayValue,l+2,n+t/2)}}class D{constructor(e){o(this,"element");o(this,"ctx");o(this,"root");this.root=e;const t=document.createElement("canvas");t.classList.add("sheet"),t.height=this.root.config.view.height,t.width=this.root.config.view.width,t.style.width=this.root.config.view.width+"px",t.style.height=this.root.config.view.height+"px",this.element=t;const s=this.element.getContext("2d");if(!s)throw new Error("Enable hardware acceleration");this.ctx=s}getCellByCoords(e,t){let s=0,l=0;for(;l<=t&&(l+=this.root.config.rows[s].height,!(l>=t));)s++;let n=0,i=0;for(;i<=e&&(i+=this.root.config.columns[n].width,!(i>=e));)n++;return new y(s,n)}renderCell(e){const{column:t,row:s}=e;this.root.data[s][t].render(this.root)}renderSheet(){const e=this.root.viewport.firstRow,t=this.root.viewport.lastCol+3,s=this.root.viewport.lastRow+3,l=this.root.viewport.firstCol;for(let n=e;n<=s;n++)for(let i=l;i<=t&&!(!this.root.config.columns[i]||!this.root.config.rows[n]);i++)this.renderCell({column:i,row:n})}}class z{constructor(e){o(this,"element");o(this,"root");this.root=e;const t=document.createElement("div");t.classList.add("spreadsheet_container"),this.element=t,this.changeElementSizes(this.root.viewProps)}changeElementSizes(e){const{height:t,width:s}=e;this.element.style.width=s+"px",this.element.style.height=t+"px"}}class M{constructor(e){o(this,"element");o(this,"root");this.root=e;const t=document.createElement("div");t.classList.add("toolbar"),this.element=t}}class d{constructor(e){o(this,"rows");o(this,"columns");o(this,"view",{width:800,height:600});this.columns=e.columns,this.rows=e.rows,this.view=e.view}}class v{constructor(){o(this,"selectedCell",null);o(this,"selectedRange",null)}}class x{}class u{constructor(e,t){o(this,"root");o(this,"top");o(this,"left");o(this,"right");o(this,"bottom");o(this,"firstRow");o(this,"lastRow");o(this,"firstCol");o(this,"lastCol");this.root=e,this.top=t.top,this.left=t.left,this.right=t.right,this.bottom=t.bottom,this.firstRow=this.getFirstRow(),this.lastCol=this.getFirstRow();//!Temp
this.firstCol=this.getFirstRow();//!Temp
this.lastRow=this.getLastRow(),this.updateValues({top:0,left:0,right:this.root.viewProps.width,bottom:this.root.viewProps.height})}updateValues(e){this.top=e.top,this.left=e.left,this.right=e.right,this.bottom=e.bottom,this.firstRow=this.getFirstRow(),this.lastRow=this.getLastRow(),this.firstCol=this.getFirstCol(),this.lastCol=this.getLastCol()}getFirstRow(){return this.root.cache.getRowByYCoord(this.top)}getLastRow(){return this.root.cache.getRowByYCoord(this.bottom)}getFirstCol(){return this.root.cache.getColumnByXCoord(this.left)}getLastCol(){return this.root.cache.getColumnByXCoord(this.right)}}class m{constructor(e){o(this,"width");o(this,"title");this.width=e.width,this.title=e.title}}class f{constructor(e){o(this,"height");o(this,"title");this.height=e.height,this.title=e.title}}function C(r,e,t=!1){const s=[];for(let l=0;l<=r;l++){const n=[];for(let i=0;i<=e;i++){const c=t?`${l}:${i}`:"",h=new g({displayValue:c,resultValue:c,value:c,position:{column:i,row:l}});n.push(h)}s.push(n)}return s}function R(r,e){const t=[];for(let n=0;n<=r;n++){const i=new f({height:40,title:String(n)});t.push(i)}const s=[];for(let n=0;n<=e;n++){const i=new m({title:String(n),width:150});s.push(i)}return new d({columns:s,rows:t,view:{height:600,width:800}})}function T(r,e){const t=C(r,e),s=R(r,e);return{data:t,config:s}}class b{constructor(e){o(this,"xPos");o(this,"colIdx");this.xPos=e.xPos,this.colIdx=e.colIdx}}class k{constructor(e){o(this,"yPos");o(this,"rowIdx");this.yPos=e.yPos,this.rowIdx=e.rowIdx}}class V{constructor(e){o(this,"columns");o(this,"rows");this.columns=e.columns,this.rows=e.rows}getRowByYCoord(e){let t=0;for(let s=0;s<this.rows.length;s++)if(e<=this.rows[s].yPos){t=s;break}return t}getColumnByXCoord(e){let t=0;for(let s=0;s<this.columns.length;s++)if(e<=this.columns[s].xPos){t=s;break}return t}}class F{constructor(e,t){o(this,"table");o(this,"scroller");o(this,"toolbar");o(this,"header");o(this,"sheet");o(this,"editor");o(this,"styles");o(this,"config");o(this,"data");o(this,"viewport");o(this,"selection");o(this,"cache");const s=C(40,40),l=this.makeConfigFromData(s,(t==null?void 0:t.view)??{height:600,width:800});t!=null&&t.view&&(l.view=t.view),this.config=new d(l),this.sheet=new D(this),this.table=new z(this),this.scroller=new B(this),this.toolbar=new M(this),this.header=new A(this),this.editor=new L(this),this.cache=this.getInitialCache(),this.viewport=new u(this,this.scroller.getViewportBoundlingRect()),this.selection=new v,this.data=s,this.styles=new x,this.buildComponent(),this.appendTableToTarget(e),this.renderSheet()}getInitialCache(){const e=[];let t=0;for(let i=0;i<=this.config.columns.length-1;i++){const c=this.config.columns[i];t+=c.width;const h=new b({xPos:t,colIdx:i});e.push(h)}const s=[];let l=0;for(let i=0;i<=this.config.rows.length-1;i++){const c=this.config.rows[i];l+=c.height;const h=new k({yPos:l,rowIdx:i});s.push(h)}const n=new V({columns:e,rows:s});return console.log("CACHE: ",n),console.log("CONFIG: ",this.config),n}buildComponent(){const e=document.createElement("div");e.appendChild(this.header.element),e.appendChild(this.sheet.element),e.classList.add("content"),this.table.element.appendChild(this.toolbar.element),this.table.element.appendChild(e),this.table.element.appendChild(this.scroller.element),this.table.element.append(this.editor.element)}appendTableToTarget(e){if(typeof e=="string"){const t=document.querySelector(e);if(!t)throw new Error(`Element with selector ${e} is not finded in DOM.
 Make sure it exists.`);t==null||t.appendChild(this.table.element)}e instanceof HTMLElement&&e.append(this.table.element)}get ctx(){return this.sheet.ctx}get viewProps(){return this.config.view}focusTable(){this.scroller.element.focus()}getCellByCoords(e,t){return this.sheet.getCellByCoords(e,t)}getCell(e){const{column:t,row:s}=e;return this.data[s][t]}changeCellValues(e,t){const{column:s,row:l}=e;this.data[l][s].changeValues(t),this.renderCell(l,s)}applyActionToRange(e,t){const s=Math.min(e.from.row,e.to.row),l=Math.max(e.from.row,e.to.row),n=Math.min(e.from.column,e.to.column),i=Math.max(e.from.column,e.to.column);for(let c=s;c<=l;c++)for(let h=n;h<=i;h++){const a=this.data[c][h];t(a)}}deleteSelectedCellsValues(){if(this.selection.selectedRange!==null)this.applyActionToRange(this.selection.selectedRange,e=>{this.changeCellValues(e.position,{displayValue:"",resultValue:"",value:""})});else{if(!this.selection.selectedCell)return;this.changeCellValues(this.selection.selectedCell,{displayValue:"",resultValue:"",value:""})}}showEditor(e){this.editor.show(e)}renderSheet(){this.sheet.renderSheet()}renderCell(e,t){this.data[e][t].render(this)}loadData(e){const t=e.length,s=e[0]?this.data[0].length:0;this.data=[];const l=[];for(let n=0;n<t;n++){const i=[];for(let c=0;c<s;c++){const h=e[n][c];i.push(new g({displayValue:h.displayValue,position:h.position,resultValue:h.resultValue,value:h.value}))}l.push(i)}return this.data=l,this.selection.selectedCell=null,this.selection.selectedRange=null,this.config=this.makeConfigFromData(l,this.config.view),this.cache=this.getInitialCache(),this.scroller.updateScrollerSize(),this.viewport=new u(this,this.scroller.getViewportBoundlingRect()),this.renderSheet(),this}makeConfigFromData(e,t){const s=e.length-1,l=e[0]?e[0].length:0,n=[];for(let h=0;h<s;h++)n.push(new f({height:40,title:String(h)}));const i=[];for(let h=0;h<l;h++)i.push(new m({width:150,title:String(h)}));return new d({view:t,rows:n,columns:i})}serializeData(){const e=this.data.length,t=this.data[0]?this.data[0].length:0,s=[];for(let l=0;l<e;l++){const n=[];for(let i=0;i<t;i++)n.push(this.data[l][i].getSerializableCell());s.push(n)}return s}}exports.Cache=V;exports.CachedColumn=b;exports.CachedRow=k;exports.Cell=g;exports.CellStyles=p;exports.Column=m;exports.Config=d;exports.Position=y;exports.RenderBox=w;exports.Row=f;exports.Selection=v;exports.SerializableCell=S;exports.Styles=x;exports.Viewport=u;exports.createSampleConfig=R;exports.createSampleData=C;exports.default=F;exports.makeSpreadsheetConfigAndData=T;
//# sourceMappingURL=main.cjs.map

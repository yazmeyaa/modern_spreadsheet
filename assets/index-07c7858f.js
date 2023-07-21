var m=Object.defineProperty;var g=(n,t,e)=>t in n?m(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var i=(n,t,e)=>(g(n,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function e(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=e(o);fetch(o.href,l)}})();class d{constructor(t,e){i(this,"x");i(this,"y");i(this,"width");i(this,"height");this.x=this.getXCoord(e.column,t),this.y=this.getYCoord(e.row,t),this.width=t.columns[e.column].width,this.height=t.rows[e.row].height}getXCoord(t,e){let s=0;for(let o=0;o<t;o++)s+=e.columns[o].width;return s}getYCoord(t,e){let s=0;for(let o=0;o<t;o++)s+=e.rows[o].height;return s}}class f{constructor(t){i(this,"element");i(this,"root");i(this,"handleKeydown",t=>{const{key:e}=t;switch(e){case"Escape":{this.hide();break}case"Enter":this.root.changeCellValues(this.root.selection.selectedCell,{value:this.element.value,displayValue:this.element.value}),this.hide()}});i(this,"handleClickOutside",t=>{const e=t.target;this.element.contains(e)||this.hide()});this.root=t;const e=document.createElement("input");e.classList.add("editor"),this.element=e,this.hide()}hide(){this.element.style.display="none",this.element.classList.add("hide"),this.element.blur(),window.removeEventListener("click",this.handleClickOutside)}show(t){const{height:e,width:s,x:o,y:l}=new d(this.root.config,t),r=this.root.getCell(t);this.element.classList.remove("hide"),this.element.style.top=l-this.root.viewport.top+"px",this.element.style.left=o-this.root.viewport.left+"px",this.element.style.width=s+"px",this.element.style.height=e+"px",this.element.style.display="block",window.addEventListener("click",this.handleClickOutside),this.element.addEventListener("keydown",this.handleKeydown),this.element.value=r.value,this.element.focus()}}class p{constructor(t){i(this,"element");i(this,"root");this.root=t;const e=document.createElement("header");e.classList.add(),this.element=e}}class C{constructor(t){i(this,"element");i(this,"verticalScroller");i(this,"horizontalScroller");i(this,"root");i(this,"isSelecting",!1);i(this,"handleClick",t=>{if(t.button!==0)return;const{offsetX:e,offsetY:s}=t,o=this.root.getCellByCoords(e,s);this.isSelecting=!0,this.root.selection.selectedRange={from:o,to:o},this.root.selection.selectedCell=o,this.root.renderSheet()});i(this,"handleScroll",()=>{const t=this.getViewportBoundlingRect();this.root.viewport.updateValues(t),this.root.renderSheet()});this.root=t;const{horizontalScroller:e,scroller:s,verticalScroller:o}=this.buildComponent();this.element=s,this.verticalScroller=o,this.horizontalScroller=e,this.element.style.height=this.root.config.view.height+"px",this.element.style.width=this.root.config.view.width+"px",this.updateScrollerSize(),this.element.addEventListener("scroll",this.handleScroll),this.element.addEventListener("mousedown",this.handleClick),this.element.addEventListener("mousemove",l=>{if(!this.isSelecting)return;const{offsetX:r,offsetY:h}=l,c=this.root.getCellByCoords(r,h);this.root.selection.selectedRange&&(this.root.selection.selectedRange.to=c),this.root.renderSheet()}),this.element.addEventListener("mouseup",()=>{this.isSelecting=!1,this.root.renderSheet()}),this.element.addEventListener("dblclick",l=>{l.preventDefault();const r=this.root.getCellByCoords(l.offsetX,l.offsetY);this.root.showEditor(r)})}getViewportBoundlingRect(){const{scrollTop:t,scrollLeft:e}=this.element,{height:s,width:o}=this.element.getBoundingClientRect(),l=t+s,r=e+o;return{top:t,left:e,bottom:l,right:r}}buildComponent(){const t=document.createElement("div"),e=document.createElement("div"),s=document.createElement("div"),o=document.createElement("div"),l=document.createElement("div");return e.style.width="0px",e.style.pointerEvents="none",s.style.pointerEvents="none",o.style.display="flex",l.appendChild(e),l.appendChild(s),o.appendChild(l),this.verticalScroller=e,this.horizontalScroller=s,t.appendChild(o),t.classList.add("scroller"),{scroller:t,verticalScroller:e,horizontalScroller:s}}getActualHeight(){return this.root.config.rows.reduce((t,e)=>(t+=e.height,t),0)}getActualWidth(){return this.root.config.columns.reduce((t,e)=>(t+=e.width,t),0)}updateScrollerSize(){const t=this.getActualHeight(),e=this.getActualWidth();this.setScrollerHeight(t),this.setScrollerWidth(e)}setScrollerHeight(t){this.verticalScroller.style.height=t+"px"}setScrollerWidth(t){this.horizontalScroller.style.width=t+"px"}}class v{constructor(){i(this,"fontSize",16);i(this,"fontColor","black");i(this,"background","white");i(this,"borderColor","black");i(this,"selectedBackground","#4287f5");i(this,"selectedFontColor","#ffffff")}}class y{constructor(t,e){i(this,"row");i(this,"column");this.row=t,this.column=e}}class S{constructor(t){i(this,"value");i(this,"displayValue");i(this,"resultValue");i(this,"position");i(this,"style",new v);this.value=t.value,this.displayValue=t.displayValue,this.resultValue=t.resultValue,this.position=t.position}changeValues(t){Object.assign(this,t)}isCellInRange(t){const{column:e,row:s}=this.position,{selectedRange:o}=t.selection;if(!o)return!1;const l=s>=Math.min(o.from.row,o.to.row)&&s<=Math.max(o.to.row,o.from.row);return e>=Math.min(o.from.column,o.to.column)&&e<=Math.max(o.to.column,o.from.column)&&l}render(t){var a;let{height:e,width:s,x:o,y:l}=new d(t.config,this.position);const{ctx:r}=t,h=((a=t.selection.selectedCell)==null?void 0:a.row)===this.position.row&&t.selection.selectedCell.column===this.position.column,c=this.isCellInRange(t);l-=t.viewport.top,o-=t.viewport.left,r.clearRect(o,l,s,e),r.fillStyle=h||c?this.style.selectedBackground:this.style.background,r.strokeStyle="black",r.fillRect(o,l,s-1,e-1),r.strokeRect(o,l,s,e),r.fillStyle=h||c?this.style.selectedFontColor:this.style.fontColor,r.textAlign="left",r.font=`${this.style.fontSize}px Arial`,r.textBaseline="middle",r.fillText(this.displayValue,o+2,l+e/2,s)}}class b{constructor(t){i(this,"element");i(this,"ctx");i(this,"root");this.root=t;const e=document.createElement("canvas");e.classList.add("sheet"),e.height=this.root.config.view.height,e.width=this.root.config.view.width,e.style.width=this.root.config.view.width+"px",e.style.height=this.root.config.view.height+"px",this.element=e;const s=this.element.getContext("2d");if(!s)throw new Error("Enable hardware acceleration");this.ctx=s}getCellByCoords(t,e){let s=0,o=0;for(;o<=e&&(o+=this.root.config.rows[s].height,!(o>=e));)s++;let l=0,r=0;for(;r<=t&&(r+=this.root.config.columns[l].width,!(r>=t));)l++;return new y(s,l)}renderCell(t){const{column:e,row:s}=t;this.root.data[s][e].render(this.root)}renderSheet(){const t=this.root.viewport.firstRow,e=this.root.viewport.lastCol+3,s=this.root.viewport.lastRow+3,o=this.root.viewport.firstCol;for(let l=t;l<=s;l++)for(let r=o;r<=e&&!(!this.root.config.columns[r]||!this.root.config.rows[l]);r++)this.renderCell({column:r,row:l})}}class x{constructor(t){i(this,"element");i(this,"root");this.root=t;const e=document.createElement("div");e.classList.add("spreadsheet_container"),this.element=e,this.changeElementSizes(this.root.viewProps)}changeElementSizes(t){const{height:e,width:s}=t;this.element.style.width=s+"px",this.element.style.height=e+"px"}}class R{constructor(t){i(this,"element");i(this,"root");this.root=t;const e=document.createElement("div");e.classList.add("toolbar"),this.element=e}}class u{constructor(t){i(this,"rows");i(this,"columns");i(this,"view",{width:800,height:600});this.columns=t.columns,this.rows=t.rows,this.view=t.view}}class E{constructor(){i(this,"selectedCell",null);i(this,"selectedRange",null)}}class L{}class k{constructor(t,e){i(this,"root");i(this,"top");i(this,"left");i(this,"right");i(this,"bottom");i(this,"firstRow");i(this,"lastRow");i(this,"firstCol");i(this,"lastCol");this.root=t,this.top=e.top,this.left=e.left,this.right=e.right,this.bottom=e.bottom,this.firstRow=this.getFirstRow(),this.lastCol=this.getFirstRow();//!Temp
this.firstCol=this.getFirstRow();//!Temp
this.lastRow=this.getLastRow(),this.updateValues({top:0,left:0,right:this.root.viewProps.width,bottom:this.root.viewProps.height})}updateValues(t){this.top=t.top,this.left=t.left,this.right=t.right,this.bottom=t.bottom,this.firstRow=this.getFirstRow(),this.lastRow=this.getLastRow(),this.firstCol=this.getFirstCol(),this.lastCol=this.getLastCol()}getFirstRow(){let t=0;for(let e=0,s=0;s<=this.top;e++)s+=this.root.config.rows[e].height,t=e;return t}getLastRow(){let t=this.getFirstRow(),e=this.top;for(;e<=this.bottom&&(e+=this.root.config.rows[t].height,!(e>=this.bottom));)t++;return t}getFirstCol(){let t=0,e=0;for(;e<=this.left&&(e+=this.root.config.columns[t].width,!(e>=this.left));)t+=1;return t}getLastCol(){let t=this.getFirstCol(),e=this.left;for(;e<=this.right&&(e+=this.root.config.columns[t].width,!(e>=this.right));)t++;return t}}class V{constructor(t){i(this,"width");i(this,"title");this.width=t.width,this.title=t.title}}class I{constructor(t){i(this,"height");i(this,"title");this.height=t.height,this.title=t.title}}function B(n,t){const e=[];for(let s=0;s<=n;s++){const o=[];for(let l=0;l<=t;l++){const r=`${s}:${l}`,h=new S({displayValue:r,resultValue:r,value:r,position:{column:l,row:s}});o.push(h)}e.push(o)}return e}function z(n,t){const e=[];for(let l=0;l<=n;l++){const r=new I({height:40,title:String(l)});e.push(r)}const s=[];for(let l=0;l<=t;l++){const r=new V({title:String(l),width:150});s.push(r)}return new u({columns:s,rows:e,view:{height:600,width:800}})}class F{constructor(t,e){i(this,"table");i(this,"scroller");i(this,"toolbar");i(this,"header");i(this,"sheet");i(this,"editor");i(this,"styles");i(this,"config");i(this,"data");i(this,"viewport");i(this,"selection");const s=z(750,750);e!=null&&e.view&&(s.view=e.view),this.config=new u(s),this.sheet=new b(this);const o=B(750,750);this.table=new x(this),this.scroller=new C(this),this.toolbar=new R(this),this.header=new p(this),this.editor=new f(this),this.viewport=new k(this,this.scroller.getViewportBoundlingRect()),this.selection=new E,this.data=o,this.styles=new L,this.buildComponent(),this.appendTableToTarget(t)}buildComponent(){const t=document.createElement("div");t.classList.add("content"),t.appendChild(this.header.element),t.appendChild(this.sheet.element),this.table.element.appendChild(this.toolbar.element),this.table.element.appendChild(t),this.table.element.appendChild(this.scroller.element),this.table.element.append(this.editor.element)}appendTableToTarget(t){if(typeof t=="string"){const e=document.querySelector(t);if(!e)throw new Error(`Element with selector ${t} is not finded in DOM.
 Make sure it exists.`);e==null||e.appendChild(this.table.element)}t instanceof HTMLElement&&t.append(this.table.element)}get ctx(){return this.sheet.ctx}get viewProps(){return this.config.view}getCellByCoords(t,e){return this.sheet.getCellByCoords(t,e)}getCell(t){const{column:e,row:s}=t;return this.data[s][e]}changeCellValues(t,e){const{column:s,row:o}=t;this.data[o][s].changeValues(e),this.renderCell(o,s)}showEditor(t){this.editor.show(t)}renderSheet(){this.sheet.renderSheet()}renderCell(t,e){this.data[t][e].render(this)}}const w=new F("#spreadsheet",{view:{height:600,width:800}});w.renderSheet();console.log(w);

# Modern Spreadsheet

- High performance spreadsheet based on CanvasAPI.
- TypeScript supported

## Basic usage

```ts
import Spreadsheet from "modern_spreadsheet";
import "modern_spreadsheet/style.css"; // <= this is required

const target = document.getElementById("spreadsheet");
const sheet = new Spreadsheet(target);
//...
```

## Save and load data

```ts
function saveData() {
  const serialized = sheet.serializeData();
  localStorage.setItem("sheet_data", JSON.stringify(serialized));
}

function loadData() {
  const data = localStorage.getItem("sheet_data");
  const json = JSON.parse(data);
  if (!json) return;
  sheet.loadData(json);
}
```

## Roadmap

- ~~Rows number and columns heading render~~
- Custom event functions (ex.: onSelectionChange, onCellEdit...). Full list of supported events will available on this page
- Rows and columns resizing
- Toolbar
- Context menu
- Formulas support
- Selected cell depends cells highlight
- Async formulas support
- Mutlisheets (?)
- Copy & Paste support

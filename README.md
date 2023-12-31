# Modern Spreadsheet

<img src="https://raw.githubusercontent.com/yazmeyaa/modern_spreadsheet/6dc20f92e769210c076600c7fcfacd4ed528f085/repo_assets/spreadsheet_preview.png?raw=true" alt="spreadsheet_preview">

## Features:
- High performance spreadsheet based on CanvasAPI.
- TypeScript supported
- Native scrolling
- Customizable
- Copy & Paste support

### Basic usage

```ts
import Spreadsheet from "modern_spreadsheet";
import "modern_spreadsheet/style.css"; // <= this is required

const target = document.getElementById("spreadsheet");
const sheet = new Spreadsheet(target);
//...
```

### Save and load data

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

#### Supported events
- onCellClick
- onSelectionChange
- onCellChange
- onCopy

### Using events examples
```ts
import Spreadsheet, { SpreadsheetConstructorProperties } from "./main";

const options: SpreadsheetConstructorProperties = {
  onCellClick: (event, cell) => {
    console.log("Cell click", event, cell);
  },
  onSelectionChange: (selection) => {
    console.log("Changed selection: ", selection);
  },
  onCellChange = (cell) => {
    console.log("Cell changed: ", cell);
  },
  onCopy: (range, data, dataAsString) => {
    console.log("Copy event: ", range, data, dataAsString)
  }
};

const sheet = new Spreadsheet("#spreadsheet", options);
```

### Roadmap

- ~~Rows number and columns heading render~~
- ~~Custom event functions (ex.: onSelectionChange, onCellEdit...). Full list of supported events will available on this page~~
- ~~Copy & Paste support~~
- Rows and columns resizing
- Toolbar
- Context menu
- Formulas support
- Selected cell depends cells highlight
- Async formulas support
- Mutlisheets (?)


# Modern Spreadsheet

  

-  High performance spreadsheet based on CanvasAPI.

-  TypeScript supported

  Basic usage

```js
import { Spreadsheet } from  'modern_spreadsheet'

import  'modern_spreadsheet/style.css'  // <= this is required

const  target = document.getElementById('spreadsheet')

const  sheet = new  Spreadsheet(target)
//...

```

Save and load data
```js
function saveData() {
	const serialized = sheet.serializeData()
	localStorage.setItem('sheet_data', JSON.stringify(serialized))
}

function loadData() {
	const data = localStorage.getItem('sheet_data')
	const json = JSON.parse(data)
	if(!json) return;
	sheet.loadData(json)
}
```
</div>

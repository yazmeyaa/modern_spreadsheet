import Spreadsheet, { createSampleData,  } from './main'

const sheet = new Spreadsheet('#spreadsheet').loadData(createSampleData(20, 20, true))

console.log(sheet)
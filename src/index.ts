import Spreadsheet, { SpreadsheetConstructorProperties } from "./main";

const options: SpreadsheetConstructorProperties = {
  onCellClick: (event, cell) => {
    console.log('Callback from instance', event, cell)
  },
  onSelectionChange: (selection) => {
    console.log("Changed selection: ", selection)
  }
}

const sheet = new Spreadsheet("#spreadsheet", options);


function saveDataToLS() {
  const serializableData = sheet.serializeData();
  localStorage.setItem("sheet", JSON.stringify(serializableData));
}

function loadDataFromLS() {
  const data = localStorage.getItem("sheet");
  if (!data) return;
  const json = JSON.parse(data);
  sheet.loadData(json);
}

const saveButton = document.querySelector("#save_button");
const loadButton = document.querySelector("#load_button");

if (!saveButton || !loadButton) throw new Error("LOST");

saveButton.addEventListener("click", saveDataToLS);
loadButton.addEventListener("click", loadDataFromLS);

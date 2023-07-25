import Spreadsheet from "./main";

const saveButton = document.querySelector("#save_button");
const loadButton = document.querySelector("#load_button");

if (!saveButton || !loadButton) throw new Error("LOST");

const sheet = new Spreadsheet("#spreadsheet");

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

saveButton.addEventListener("click", saveDataToLS);
loadButton.addEventListener("click", loadDataFromLS);

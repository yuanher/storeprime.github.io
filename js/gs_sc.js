$(function () {
  doShowAll();
});

function doShowAll() {
  populateTable("sc");
  populateTable("pn");
}

function Checkout() {
  alert("Checkout");
}

function populateTable(tableType) {
  var key = "";
  var list = "";
  var list_header = "";

  if (tableType == "sc") {
    list_header = `
        <thead>
            <tr style='border-top: hidden'>
                <th scope="col">Item</th>
                <th scope="col">Qty</th>
                <th scope="col" class="float-right" style='border-top: hidden;border-bottom: hidden'>Action</th>
            </tr>
        </thead>
        <tbody>
    `;
  } else {
    list_header = `
        <thead>
            <tr style='border-top: hidden'>
                <th scope="col">Product</th>
                <th scope="col">Note</th>
                <th scope="col" class="float-right" style='border-top: hidden;border-bottom: hidden'>Action</th>
            </tr>
        </thead>
        <tbody>
    `;
  }
  list += list_header;
  var i = 0;
  var noteEntry = "";

  //for more advance feature, you can set cap on max items in the cart
  for (i = 0; i <= localStorage.length - 1; i++) {
    key = localStorage.key(i);
    noteEntry = "txt" + key;

    if (key != "firebase:host:grocerystore-bf6d2.firebaseio.com") {
      if (tableType == "pn") {
        // Add row entry if key ends with "Note" i.e. all product note items
        if (key.endsWith("Note")) {
          list += `
            <tr>
                <td>${key.split("-")[0]}</td>
                <td><input type='text' class='text text-center' id='${noteEntry}' value='${localStorage.getItem(
            key
          )}'/></td>
                <td class="float-right">
                  <button class='btn btn-primary' id='${key}' onClick="return UpdateItem('${key}')">Update</button>
                  <button class='btn btn-primary' id='${key}' onClick="return RemoveItem('${key}')">Remove</button>
                </td>
            </tr>
          `;
        }
      } else if (tableType == "sc") {
        // Add row entry if key does not end with "Note" i.e. all shopping cart items
        if (!key.endsWith("Note")) {
          list += `
            <tr>
                <td>${key}</td>
                <td><input type="number" class='text text-center' min='1' max='100'  id='${noteEntry}' value='${localStorage.getItem(
            key
          )}'></td>
                <td class="float-right">
                  <button class='btn btn-primary' id='${key}' onClick="return UpdateItem('${key}')">Update</button>
                  <button class='btn btn-primary' id='${key}' onClick="return RemoveItem('${key}')">Remove</button>
                </td>
            </tr>
          `;
        }
      }
    }
  }
  //if no item exists in the cart
  if (list == list_header) {
  }
  //bind the data to html table
  //you can use jQuery too....
  document.getElementById(tableType).innerHTML = list;
}

//delete an existing key=>value from the HTML5 storage
function RemoveItem(name) {
  localStorage.removeItem(name);
  doShowAll();
}

//Update an existing key=>value from the HTML5 storage
function UpdateItem(name) {
  var noteEntry = "txt" + name;
  localStorage[name] = document.getElementById(noteEntry).value;
  doShowAll();
}

//-------------------------------------------------------------------------------------
//restart the local storage
function ClearAll() {
  localStorage.clear();
  doShowAll();
}

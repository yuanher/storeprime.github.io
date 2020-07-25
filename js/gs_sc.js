var orderRef;

var firebaseConfig = {
  apiKey: "AIzaSyCgcmhorEpf9bpdpN1uNnqEwsAUsSCXby4",
  authDomain: "gstore-e1ded.firebaseapp.com",
  databaseURL: "https://gstore-e1ded.firebaseio.com",
  projectId: "gstore-e1ded",
  storageBucket: "gstore-e1ded.appspot.com",
  messagingSenderId: "821419736295",
  appId: "1:821419736295:web:bbbe2b3649cf4d16c93642",
  measurementId: "G-B8G8CC555G",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get reference to products collection in Firebase database
const dbRef = firebase.firestore();
orderRef = dbRef.collection("orders");

$(function () {
  doShowAll();
});

function doShowAll() {
  populateTable("sc");
  populateTable("pn");

  //Check number of shopping cart items
  var itemQty = 0;
  for (i = 0; i <= localStorage.length - 1; i++) {
    key = localStorage.key(i);
    if (
      key !=
      "firestore_zombie_firestore/[DEFAULT]/gstore-e1ded/_nQW4oMhyZFPxaifRYgxo"
    ) {
      if (!key.endsWith("Note")) {
        itemQty += 1;
      }
    }
  }

  //Disable checkout button if no shopping cart items
  if (itemQty == 0) {
    $(".checkout").prop("disabled", true);
  } else {
    $(".checkout").prop("disabled", false);
  }
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

    if (
      key !=
      "firestore_zombie_firestore/[DEFAULT]/gstore-e1ded/_nQW4oMhyZFPxaifRYgxo"
    ) {
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

function Checkout() {
  var orderItems = [];

  // Get all shopping cart items from localStorage
  for (i = 0; i <= localStorage.length - 1; i++) {
    var key = localStorage.key(i);

    if (
      key !=
      "firestore_zombie_firestore/[DEFAULT]/gstore-e1ded/_nQW4oMhyZFPxaifRYgxo"
    ) {
      if (!key.endsWith("Note")) {
        const orderItem = {
          name: key,
          ingredients: localStorage.getItem(key),
        };

        orderItems.push(orderItem);
      }
    }
  }

  // Create new order from shopping cart items
  var order = {
    orderDT: new Date().toISOString(),
    items: orderItems,
  };

  // Add new order to Firestore database orders collection
  orderRef
    .add(order)
    .then(function () {
      // Remove checked out shopping cart items from localStorage
      for (var i = 0; i < orderItems.length; i++) {
        localStorage.removeItem(orderItems[i].name);
      }

      //Refresh Shopping Cart screen
      doShowAll();

      // Show checkout success message
      $("#msgCheckout").modal();
    })
    .catch(function (error) {
      console.log(error);
    });
}

var prodRef;
var orderRef;
var products = {};

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
prodRef = dbRef.collection("products");

// Document.onload events
$(function () {
  prodRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        //add product to TopProducts
        renderProduct(change.doc.data(), change.doc.id);
      }
      if (change.type === "removed") {
        //remove product from TopProducts
      }
    });
  });

  // Click Event handler for btnDec
  $(".minus-btn").on("click", function (e) {
    e.preventDefault();
    var $this = $(this);
    var $input = $this.closest("div").find("input");
    var value = parseInt($input.val());

    if (value > 1) {
      value = value - 1;
    } else {
      value = 0;
    }

    $input.val(value);
  });

  // Click Event handler for btnInc
  $(".plus-btn").on("click", function (e) {
    e.preventDefault();
    var $this = $(this);
    var $input = $this.closest("div").find("input");
    var value = parseInt($input.val());

    if (value < 100) {
      value = value + 1;
    } else {
      value = 100;
    }

    $input.val(value);
  });

  // Click Event handler for btnAddtoCart
  $(".add-btn").on("click", function (e) {
    e.preventDefault();
    var $this = $(this);
    var prodName = document.querySelector("#productName").innerHTML;
    var prodQty = $("#productQty").val();

    localStorage.setItem(prodName, prodQty);
  });

  // Click Event handler for btnAddNote
  $(".note-btn").on("click", function (e) {
    e.preventDefault();
    var $this = $(this);
    var prodName = document.querySelector("#productNameNote").innerHTML;
    var prodNote = $("#productNoteMsg").val();

    localStorage.setItem(prodName + "-Note", prodNote);
  });
});

// render product data
const renderProduct = (prod, id) => {
  let output = "";
  const container = document.querySelector(".card-deck");

  output += `
          <div class="col-lg-2 col-md-3 col-sm-4 px-0">
            <div class="card hover-higlight align-items-center">
                <img src="images/${id}.png" class="card-img-top img-responsive" alt="" style="max-width: 50%">
                <div class="card-body">
                    <h5 class="card-title text-center">${prod.name}</h5>
                    <p class="card-text text-center">${prod.new_price} <del>${prod.old_price}</del></p>
                </div>
                <div class="card-footer">
                   <button type="button" id="btnShowDetails" onClick="return showProductDetails('${id}')" class="btn btn-primary btn-sm">Show Details</button>
                </div>
            </div>
          </div>
  `;
  container.innerHTML += output;
};

/**
 * Show details of product when clicked
 * @param  {String} prodID  Product ID
 * @return None
 */
function showProductDetails(prodID) {
  var prodDetails = prodRef.doc(prodID);

  prodDetails
    .get()
    .then(function (product) {
      if (product.exists) {
        renderProductDetails(product.data(), product.id);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch(function (error) {
      console.log("Error getting document:", error);
    });
}

// render product data
const renderProductDetails = (prod, id) => {
  $("#productName").html(prod.name + " - Details");
  $("#productNameNote").html(prod.name + " - Note");
  $("#productDesc").html(prod.description);
  $("#productBrand").html(prod.brand);
  $("#productCategory").html(prod.category);
  $("#productImg").attr("src", "images/" + id + ".png");

  $("#msgProductDetails").modal();
};

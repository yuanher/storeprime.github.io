var prodRef;

// Document.onload events
$(function () {
  var config = {
    apiKey: "AIzaSyDRV_RnnWcHNSt0eJNp63MAIWVfnTqzU3o",
    authDomain: "grocerystore-bf6d2.firebaseapp.com",
    databaseURL: "https://grocerystore-bf6d2.firebaseio.com",
    projectId: "grocerystore-bf6d2",
    storageBucket: "grocerystore-bf6d2.appspot.com",
    messagingSenderId: "943686153725",
    appId: "1:943686153725:web:b89cc95f80347d8b225594",
  };

  // Initialize Firebase
  firebase.initializeApp(config);

  // Get reference to products collection in Firebase database
  const dbRef = firebase.database().ref();
  prodRef = dbRef.child("products");

  // Get list of top products from Firebase database
  getTopProducts();

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

/**
 * Get list of top products from Firebase database
 * @param  None
 * @return None
 */
function getTopProducts() {
  let output = "";
  let loopIndex = 1;
  const container = document.querySelector(".card-deck");

  prodRef.on("child_added", (snap) => {
    let prod = snap.val();
    var sName = prod.name;

    output += `
          <div class="col-lg-2 col-md-3 col-sm-4 px-0">
            <div class="card hover-higlight">
                <img src="images/${loopIndex}.png" class="card-img-top" alt="">
                <div class="card-body">
                    <h5 class="card-title">${prod.name}</h5>
                    <p class="card-text">${prod.new_price} <del>${prod.old_price}</del></p>
                </div>
                <div class="card-footer">
                   <button type="button" id="btnShowDetails" onClick="return showProductDetails('${sName}', '${loopIndex}')" class="btn btn-primary btn-sm">Show Details</button>
                </div>
            </div>
          </div>
        `;

    loopIndex += 1;
    container.innerHTML = output;
  });
}

/**
 * Show details of product when clicked
 * @param  {String} prodID  Product Name
 * @param  {Number} prodIdx Product Index
 * @return                  None
 */
function showProductDetails(prodID, prodIdx) {
  let output = "";

  prodRef
    .orderByChild("name")
    .equalTo(prodID)
    .on("child_added", function (snapshot) {
      var product = snapshot.toJSON();

      $("#productName").html(product.name);
      $("#productNameNote").html(product.name);
      $("#productDesc").html(product.description);
      $("#productBrand").html(product.brand);
      $("#productCategory").html(product.category);
      $("#productImg").attr("src", "images/" + prodIdx + ".png");

      //$("#topProducts").innerHTML = output;
      $("#msgProductDetails").modal();
    });
}

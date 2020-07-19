/*
   Javascript Functions

   Filename: gs_fb.js

*/

// Email format validation function
function ValidateEmail(inputText) {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return inputText.match(mailformat);
}

// Phone format validation fucntion
function ValidatePhone(inputText) {
  var phoneformat = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return inputText.match(phoneformat);
}

//Document.onload Events
$(function () {
  //Clear Feedback form Message field
  $("#Feedback_Message").val("");

  // onchange and onkeyup event handler for Newsletter Subscription form field
  $("#Email").keyup(function () {
    //Disable Submit button if email text field does not meet required email format
    if (ValidateEmail($(this).val())) {
      $("#Submit").prop("disabled", false);
    } else {
      //If there is text in the input, then enable the button
      $("#Submit").prop("disabled", true);
    }
  });

  // onchange event handler for Feedback form fields
  $(
    "input[type='text'], input[type='email'], input[type='checkbox'], textarea"
  ).bind("keyup change click", function () {
    var valid = true;
    var errMsg = "";
    $.each(
      $(
        "input[type='text'], input[type='email'], input[type='checkbox'], textarea"
      ),
      function (index, value) {
        var forms = document.getElementsByClassName("needs-validation");
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
          form.classList.add("was-validated");

          if ($("#Feedback_Email").val()) {
            if (!ValidateEmail($("#Feedback_Email").val())) {
              $("#Err_Email").html("Email address entered is not valid");
            }
          }
        });
      }
    );
  });
});

// Disable Feedback Form submit button when reset button is clicked
function disableSubmit() {
  $("#Feedback input[type='submit']").attr("disabled", true);
}

// Newsletter Subscription Form submit button event handler
function subscribeNewsletter() {
  $("#msgSubscribe").modal();
}

// Feedback Form submit button event handler
function sendFeedback() {
  alert(
    "We have received your valuable feedback, thank you and have a nice day!"
  );
}

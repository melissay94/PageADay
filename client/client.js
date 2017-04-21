
const sendAjax = (action, data) => {
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    dataType: "json",
    success: (result, status, xhr) => {
      window.location = result.redirect;
    },
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);
    }
  });        
}

$(document).ready(() => {

	// Prevent default action for submissions and handle errors
	$("#signupForm").on("submit", (e) => {
		e.preventDefault();

		if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
			return false;
		}

		if($("#pass").val() !== $("#pass2").val()) {
			return false;
		}

		sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

		return false;
	});

	// Will need this later
	// Prevent default action for submissions and handle errors
	$("#loginForm").on("submit", (e) => {
		e.preventDefault();

		if($("#user").val() == '' || $("#pass").val() == '') {
			return false;
		}

		sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

		return false;
	});

});
"use strict";

// Handles the request to change password
var handleChange = function handleChange(e) {
	e.preventDefault();

	if ($("#user").val() == '' || $("#old_pass") == '' || $("new_pass") == '') {
		handleError("Excuse me, I'mma need all that info");
		return false;
	}

	sendAjax('POST', $('#changeForm').attr("action"), $("#changeForm").serialize());

	// Reset all the fields
	document.querySelector("#user").value = "";
	document.querySelector("#old_pass").value = "";
	document.querySelector("#new_pass").value = "";

	// Using handleError to let them know it succeeded
	handleError("Password has been changed");

	return false;
};

// Set up form
var renderChangePass = function renderChangePass() {
	return React.createElement(
		"form",
		{ id: "changeForm", name: "changeForm",
			onSubmit: this.handleSubmit,
			action: "/options",
			method: "POST",
			className: "changeForm" },
		React.createElement(
			"div",
			{ className: "form-group row" },
			React.createElement(
				"label",
				{ htmlFor: "username", className: "col-md-2 col-form-label" },
				"Username: "
			),
			React.createElement(
				"div",
				{ className: "col-md-10" },
				React.createElement("input", { id: "user", className: "form-control", type: "text", name: "username", placeholder: "Username" })
			)
		),
		React.createElement(
			"div",
			{ className: "form-group row" },
			React.createElement(
				"label",
				{ htmlFor: "old_pass", className: "col-md-2 col-form-label" },
				"Current Password: "
			),
			React.createElement(
				"div",
				{ className: "col-md-10" },
				React.createElement("input", { id: "old_pass", className: "form-control", type: "password", name: "old_pass", placeholder: "Current Password" })
			)
		),
		React.createElement(
			"div",
			{ className: "form-group row" },
			React.createElement(
				"label",
				{ htmlFor: "new_pass", className: "col-md-2 col-form-label" },
				"New Password: "
			),
			React.createElement(
				"div",
				{ className: "col-md-10" },
				React.createElement("input", { id: "new_pass", className: "form-control", type: "password", name: "new_pass", placeholder: "New Password" })
			)
		),
		React.createElement(
			"div",
			{ className: "form-group row" },
			React.createElement(
				"div",
				{ className: "offset-md-10 col-md-10" },
				React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
				React.createElement("input", { className: "formSubmit btn", type: "submit", value: "Reset Password" })
			)
		)
	);
};

var setup = function setup(csrf) {
	var OptionsWindow = React.createClass({
		displayName: "OptionsWindow",

		handleSubmit: handleChange,
		render: renderChangePass
	});

	ReactDOM.render(React.createElement(OptionsWindow, { csrf: csrf }), document.querySelector("#changeArea"));
};
"use strict";

var handleError = function handleError(message) {
	$(".errorMessage").text(message);
};

var redirect = function redirect(response) {
	window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: success,
		error: function error(xhr, status, _error) {
			var msgObj = JSON.parse(xhr.responseText);
			handleError(msgObj.error);
		}
	});
};

// Gets a csrf token to be used
var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});

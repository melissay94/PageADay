"use strict";

// Handles the request to change password
var handlePassChange = function handlePassChange(e) {
	e.preventDefault();

	if ($("#user").val() == '' || $("#old_pass") == '' || $("new_pass") == '') {
		handleError("Excuse me, I'mma need all that info");
		return false;
	}

	sendAjax('POST', $('#changePass').attr("action"), $("#changePass").serialize());

	// Reset all the fields
	document.querySelector("#user").value = "";
	document.querySelector("#old_pass").value = "";
	document.querySelector("#new_pass").value = "";

	// Using handleError to let them know it succeeded
	handleError("Password has been changed");

	return false;
};

// Handles the request to change username
var handleUserChange = function handleUserChange(e) {
	e.preventDefault();

	if ($("#new_user").val() == '' || $("#pass") == '') {
		handleError("Excuse me, I'mma need all that info");
		return false;
	}

	sendAjax('POST', $('#changeUser').attr("action"), $("#changeUser").serialize());

	// Reset all the fields
	document.querySelector("#new_user").value = "";
	document.querySelector("#pass").value = "";

	// Using handleError to let them know it succeeded
	handleError("Username has been changed");

	return false;
};

// Set up form
var renderChangePass = function renderChangePass() {
	return React.createElement(
		"form",
		{ id: "changePass", name: "changePass",
			onSubmit: this.handleSubmit,
			action: "/changePass",
			method: "POST",
			className: "changePass" },
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

var renderChangeUsername = function renderChangeUsername() {
	return React.createElement(
		"form",
		{ id: "changeUser", name: "changeUser",
			onSubmit: this.handleSubmit,
			action: "/changeUser",
			method: "POST",
			className: "changeUser" },
		React.createElement(
			"div",
			{ className: "form-group row" },
			React.createElement(
				"label",
				{ htmlFor: "username", className: "col-md-2 col-form-label" },
				"New Username: "
			),
			React.createElement(
				"div",
				{ className: "col-md-10" },
				React.createElement("input", { id: "new_user", className: "form-control", type: "text", name: "username", placeholder: "Username" })
			)
		),
		React.createElement(
			"div",
			{ className: "form-group row" },
			React.createElement(
				"label",
				{ htmlFor: "old_pass", className: "col-md-2 col-form-label" },
				"Password: "
			),
			React.createElement(
				"div",
				{ className: "col-md-10" },
				React.createElement("input", { id: "pass", className: "form-control", type: "password", name: "old_pass", placeholder: "Current Password" })
			)
		),
		React.createElement(
			"div",
			{ className: "form-group row" },
			React.createElement(
				"div",
				{ className: "offset-md-10 col-md-10" },
				React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
				React.createElement("input", { className: "formSubmit btn", type: "submit", value: "Change Username" })
			)
		)
	);
};

var renderUsername = function renderUsername() {
	console.log(this.state.data);
};

var setup = function setup(csrf) {
	var OptionsWindow = React.createClass({
		displayName: "OptionsWindow",

		handleSubmit: handlePassChange,
		render: renderChangePass
	});

	var UserWindow = React.createClass({
		displayName: "UserWindow",

		handleSubmit: handleUserChange,
		render: renderChangeUsername
	});

	ReactDOM.render(React.createElement(OptionsWindow, { csrf: csrf }), document.querySelector("#changePass"));

	ReactDOM.render(React.createElement(UserWindow, { csrf: csrf }), document.querySelector("#changeUser"));
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

'use strict';

var handleLogin = function handleLogin(e) {
	e.preventDefault();

	if ($("#user").val() == '' || $('#pass').val() == '') {
		handleError("Excuse me super fan, you missed a field");
		return false;
	}

	sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

	return false;
};

var handleSignup = function handleSignup(e) {
	e.preventDefault();

	if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
		handleError("Excuse me super fan, you missed a field");
		return false;
	}

	if ($("#pass").val() !== $("#pass2").val()) {
		handleError("Your choice of secret word doesn't match the retype");
		return false;
	}

	sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

	return false;
};

// Oh boy react
var renderLogin = function renderLogin() {
	return React.createElement(
		'div',
		{ className: 'userOption' },
		React.createElement(
			'h3',
			null,
			'Login Here!'
		),
		React.createElement(
			'form',
			{ id: 'loginForm', name: 'loginForm',
				onSubmit: this.handleSubmit,
				action: '/login',
				method: 'POST',
				className: 'mainForm' },
			React.createElement(
				'div',
				{ className: 'form-group row' },
				React.createElement(
					'label',
					{ htmlFor: 'username', className: 'col-sm-2 col-form-label' },
					'Username: '
				),
				React.createElement(
					'div',
					{ className: 'col-sm-8' },
					React.createElement('input', { id: 'user', className: 'form-control', type: 'text', name: 'username', placeholder: 'username' })
				)
			),
			React.createElement(
				'div',
				{ className: 'form-group row' },
				React.createElement(
					'label',
					{ htmlFor: 'pass', className: 'col-sm-2 col-form-label' },
					'Password: '
				),
				React.createElement(
					'div',
					{ className: 'col-sm-8' },
					React.createElement('input', { id: 'pass', className: 'form-control', type: 'password', name: 'pass', placeholder: 'password' })
				)
			),
			React.createElement(
				'div',
				{ className: 'form-group row enterbtn' },
				React.createElement(
					'div',
					{ className: 'offset-sm-2 col-sm-4' },
					React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
					React.createElement('input', { className: 'formSubmit btn', type: 'submit', value: 'Start!' })
				)
			)
		)
	);
};

var renderSignup = function renderSignup() {
	return React.createElement(
		'div',
		{ className: 'userOption' },
		React.createElement(
			'h3',
			null,
			'Sign up Here!'
		),
		React.createElement(
			'form',
			{ id: 'signupForm', name: 'signupForm',
				onSubmit: this.handleSubmit,
				action: '/signup',
				method: 'POST',
				className: 'mainForm' },
			React.createElement(
				'div',
				{ className: 'form-group row' },
				React.createElement(
					'label',
					{ htmlFor: 'username', className: 'col-sm-2 col-form-label' },
					'Username: '
				),
				React.createElement(
					'div',
					{ className: 'col-sm-8' },
					React.createElement('input', { id: 'user', className: 'form-control', type: 'text', name: 'username', placeholder: 'username' })
				)
			),
			React.createElement(
				'div',
				{ className: 'form-group row' },
				React.createElement(
					'label',
					{ htmlFor: 'pass', className: 'col-sm-2 col-form-label' },
					'Password: '
				),
				React.createElement(
					'div',
					{ className: 'col-sm-8' },
					React.createElement('input', { id: 'pass', className: 'form-control', type: 'password', name: 'pass', placeholder: 'password' })
				)
			),
			React.createElement(
				'div',
				{ className: 'form-group row' },
				React.createElement(
					'label',
					{ htmlFor: 'pass2', className: 'col-sm-2 col-form-label' },
					'Retype: '
				),
				React.createElement(
					'div',
					{ className: 'col-sm-8' },
					React.createElement('input', { id: 'pass2', className: 'form-control', type: 'password', name: 'pass2', placeholder: 'retype password' })
				)
			),
			React.createElement(
				'div',
				{ className: 'form-group row enterbtn' },
				React.createElement(
					'div',
					{ className: 'offset-sm-2 col-sm-4' },
					React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
					React.createElement('input', { className: 'formSubmit btn', type: 'submit', value: 'Start!' })
				)
			)
		)
	);
};

var createLoginWindow = function createLoginWindow(csrf) {

	var LoginWindow = React.createClass({
		displayName: 'LoginWindow',

		handleSubmit: handleLogin,
		render: renderLogin
	});

	ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#userInfo"));
};

var createSignupWindow = function createSignupWindow(csrf) {

	var SignupWindow = React.createClass({
		displayName: 'SignupWindow',

		handleSubmit: handleSignup,
		render: renderSignup
	});

	ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#userInfo"));
};

var setup = function setup(csrf) {
	var loginButton = document.querySelector("#loginButton");
	var signupButton = document.querySelector("#signupButton");

	signupButton.addEventListener("click", function (e) {
		e.preventDefault();
		createSignupWindow(csrf);
		return false;
	});

	loginButton.addEventListener("click", function (e) {
		e.preventDefault();
		createLoginWindow(csrf);
		return false;
	});

	createSignupWindow(csrf);
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

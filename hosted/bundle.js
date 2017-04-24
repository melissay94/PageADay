"use strict";

var comicRenderer = void 0;
var comicForm = void 0;
var ComicFormClass = void 0;
var ComicListClass = void 0;

var handleComics = function handleComics(e) {
	e.preventDefault();

	if ($("#comicName").val() == '' || $("#comicLink").val() == '') {
		handleError("We need a name and link my dear");
		return false;
	}

	sendAjax('POST', $("#comicForm").attr("action"), $("#comicForm").serialize(), function () {
		comicRenderer.loadComicsFromServer();
	});

	return false;
};

var renderComicForm = function renderComicForm() {

	return React.createElement(
		"form",
		{ id: "comicForm",
			onSubmit: this.handleSubmit,
			name: "comicForm",
			action: "/profile",
			method: "POST",
			className: "comicForm"
		},
		React.createElement(
			"label",
			{ htmlFor: "name" },
			"Comic Name: "
		),
		React.createElement("input", { id: "comicName", type: "text", name: "name", placeholder: "Comic Name" }),
		React.createElement(
			"label",
			{ htmlFor: "link" },
			"Comic Link: "
		),
		React.createElement("input", { id: "comicLink", type: "text", name: "link", placeholder: "Comic Link" }),
		React.createElement(
			"label",
			{ htmlFor: "review" },
			"Review: "
		),
		React.createElement("textarea", { id: "comicReview", name: "review", placeholder: "Your review here...", rows: "8" }),
		React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
		React.createElement("input", { className: "makeNewComic btn", type: "submit", value: "Submit!" })
	);
};

var setup = function setup(csrf) {

	ComicFormClass = React.createClass({
		displayName: "ComicFormClass",

		handleSubmit: handleComics,
		render: renderComicForm
	});

	comicForm = ReactDOM.render(React.createElement(ComicFormClass, { csrf: csrf }), document.querySelector('#addComic'));
};

var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});
"use strict";

var handleError = function handleError(message) {
	$("#errorMessage").text(message);
};

var redirect = function redirect(response) {
	$("#domoMessage").animate({ width: 'hide' }, 350);
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

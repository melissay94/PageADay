"use strict";

var comicRenderer = void 0;
var comicForm = void 0;
var ComicFormClass = void 0;
var ComicListClass = void 0;

// Handles adding a comic to the user and overall db
var handleComics = function handleComics(e) {
	e.preventDefault();

	if ($("#comicName").val() == '' || $("#comicLink").val() == '') {
		handleError("We need a name and link my dear");
		return false;
	}

	sendAjax('POST', $("#comicFormer").attr("action"), $("#comicFormer").serialize(), function () {
		comicRenderer.loadComicsFromServer();
	});

	sendAjax('POST', '/archive', $("#comicFormer").serialize());

	// Resetting submissions to blank after making a new link
	document.querySelector("#comicName").value = "";
	document.querySelector("#comicLink").value = "";
	document.querySelector("#comicReview").value = "";

	// Just using handleError to let them know if succeeded
	handleError("Your new entry has been added.");

	return false;
};

// Handles deleting a comic from the user's list
var handleDeletes = function handleDeletes(e, comicId, csrf) {
	e.preventDefault();

	var data_url = "_id=" + comicId + "&_csrf=" + csrf;

	sendAjax('DELETE', '/comic/' + comicId, data_url, function () {
		comicRenderer.loadComicsFromServer();
	});

	handleError("Your comic has been deleted");

	return false;
};

// Renders the comic form for creating new entries
var renderComicForm = function renderComicForm() {

	return React.createElement(
		"form",
		{ id: "comicFormer", name: "comicFormer",
			onSubmit: this.handleSubmit,
			action: "/comic",
			method: "POST",
			className: "comicForm"
		},
		React.createElement(
			"div",
			{ className: "form-group row" },
			React.createElement(
				"label",
				{ htmlFor: "name", className: "col-md-2 col-form-label" },
				"Comic Name: "
			),
			React.createElement(
				"div",
				{ className: "col-md-10" },
				React.createElement("input", { id: "comicName", className: "form-control", type: "text", name: "name", placeholder: "Comic Name" })
			)
		),
		React.createElement(
			"div",
			{ className: "form-group row" },
			React.createElement(
				"label",
				{ htmlFor: "link", className: "col-md-2 col-form-label" },
				"Comic Link: "
			),
			React.createElement(
				"div",
				{ className: "col-md-10" },
				React.createElement("input", { id: "comicLink", className: "form-control", type: "text", name: "link", placeholder: "Comic Link" })
			)
		),
		React.createElement(
			"div",
			{ className: "form-group row" },
			React.createElement(
				"label",
				{ htmlFor: "review", className: "col-md-2 col-form-label" },
				"Review: "
			),
			React.createElement(
				"div",
				{ className: "col-md-10" },
				React.createElement("textarea", { id: "comicReview", className: "form-control", name: "review", placeholder: "Your review here...", rows: "8" })
			)
		),
		React.createElement(
			"div",
			{ className: "form-group row" },
			React.createElement(
				"div",
				{ className: "col-md-3 col-md-offset-6" },
				React.createElement(
					"button",
					{ type: "button", className: "btn btn-default", "data-dismiss": "modal" },
					"Close"
				)
			),
			React.createElement(
				"div",
				{ className: "col-md-3" },
				React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
				React.createElement("input", { className: "makeNewComic btn", type: "submit", value: "Submit!" })
			)
		)
	);
};

// Renders the list of comics the user has saved
var renderComicList = function renderComicList() {
	var _this = this;

	if (this.state.data.length === 0) {
		return React.createElement(
			"div",
			{ className: "comicList" },
			React.createElement(
				"h4",
				{ className: "emptyLibrary" },
				"You have no comics yet"
			)
		);
	}

	var comicNodes = this.state.data.map(function (comic) {
		return React.createElement(
			"div",
			{ key: comic._id, className: "comic" },
			React.createElement(
				"h3",
				{ className: "name" },
				React.createElement(
					"a",
					{ href: comic.link, target: "_blank" },
					comic.name,
					" "
				)
			),
			React.createElement(
				"button",
				{ className: "btn btn-default" },
				React.createElement("span", { className: "glyphicon glyphicon-pencil" })
			),
			React.createElement(
				"button",
				{ className: "btn btn-default", onClick: function onClick(e) {
						return handleDeletes(e, comic._id, _this.props.csrf);
					} },
				React.createElement("span", { className: "glyphicon glyphicon-remove" })
			),
			React.createElement(
				"p",
				{ className: "review" },
				comic.review
			)
		);
	});

	return React.createElement(
		"div",
		{ className: "comicList" },
		comicNodes
	);
};

// Sets up the page with all components
var setup = function setup(csrf) {

	ComicFormClass = React.createClass({
		displayName: "ComicFormClass",

		handleSubmit: handleComics,
		render: renderComicForm
	});

	ComicListClass = React.createClass({
		displayName: "ComicListClass",

		loadComicsFromServer: function loadComicsFromServer() {
			sendAjax('GET', '/comic', null, function (data) {
				this.setState({ data: data.comics });
			}.bind(this));
		},
		getInitialState: function getInitialState() {
			return { data: [] };
		},
		componentDidMount: function componentDidMount() {
			this.loadComicsFromServer();
		},
		render: renderComicList
	});

	comicForm = ReactDOM.render(React.createElement(ComicFormClass, { csrf: csrf }), document.querySelector('#addComic'));

	comicRenderer = ReactDOM.render(React.createElement(ComicListClass, { csrf: csrf }), document.querySelector("#comics"));
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

"use strict";

var comicRenderer = void 0;
var comicForm = void 0;
var ComicFormClass = void 0;
var ComicListClass = void 0;

// Handles adding a comic to the user and overall db
// TO DO: Only let you add a comic if its a new url
var handleComics = function handleComics(e) {
	e.preventDefault();

	if ($("#comicName").val() == '' || $("#comicLink").val() == '') {
		handleError("We need a name and link my dear");
		return false;
	}

	sendAjax('POST', $("#comicFormer").attr("action"), $("#comicFormer").serialize(), function () {
		comicRenderer.loadComicsFromServer();
	});

	// Resetting submissions to blank after making a new link
	undefined.name.value = '';
	undefined.link.value = '';
	undefined.review.value = '';

	return false;
};

// Handles deleting an entry to my code
// TO DO: Make it do that
var handleDeletes = function handleDeletes(e) {
	e.preventDefault();
};

// Renders the comic form for creating new entries
var renderComicForm = function renderComicForm() {
	var _this = this;

	return React.createElement(
		"form",
		{ id: "comicFormer", name: "comicFormer",
			onSubmit: this.handleSubmit,
			action: "/profile",
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
				React.createElement("input", { id: "comicName", className: "form-control", ref: function ref(c) {
						_this.name = c;
					}, type: "text", name: "name", placeholder: "Comic Name" })
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
				React.createElement("input", { id: "comicLink", className: "form-control", ref: function ref(c) {
						_this.link = c;
					}, type: "text", name: "link", placeholder: "Comic Link" })
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
				React.createElement("textarea", { id: "comicReview", className: "form-control", ref: function ref(c) {
						_this.review = c;
					}, name: "review", placeholder: "Your review here...", rows: "8" })
			)
		),
		React.createElement(
			"div",
			{ className: "form-group row" },
			React.createElement(
				"div",
				{ className: "offset-md-10 col-md-10" },
				React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
				React.createElement("input", { className: "makeNewComic btn", type: "submit", value: "Submit!" })
			)
		)
	);
};

// Renders the list of comics the user has saved
var renderComicList = function renderComicList() {
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
				{ className: "comicName" },
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
				React.createElement("span", { className: "glyphicon glyphicon-remove" })
			),
			React.createElement(
				"p",
				{ className: "comicReview" },
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
			sendAjax('GET', '/getComics', null, function (data) {
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

	comicRenderer = ReactDOM.render(React.createElement(ComicListClass, null), document.querySelector("#comics"));
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

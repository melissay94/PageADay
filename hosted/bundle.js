"use strict";
"use strict";

var archiveRenderer = void 0;
var ArchiveListClass = void 0;

// Renders the list from the archives
var renderArchiveList = function renderArchiveList() {
	if (this.state.data.length === 0) {
		return React.createElement(
			"div",
			{ className: "archiveList" },
			React.createElement(
				"h4",
				{ className: "emptyLibrary" },
				"There is no archive yet"
			)
		);
	}

	var archiveNodes = this.state.data.map(function (comic) {
		return React.createElement(
			"div",
			{ key: comic.name, className: "archive" },
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
		{ className: "archiveList" },
		archiveNodes
	);
};
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

	return false;
};

// Handles deleting an entry to my code
var handleDeletes = function handleDeletes(e) {
	e.preventDefault();
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

	ArchiveListClass = React.createClass({
		displayName: "ArchiveListClass",

		loadArchiveFromServer: function loadArchiveFromServer() {
			sendAjax('GET', '/getArchives', null, function (data) {
				this.setState({ data: data.archives });
			}.bind(this));
		},
		getInitialState: function getInitialState() {
			return { data: [] };
		},
		componentDidMount: function componentDidMount() {
			this.loadArchiveFromServer();
		},
		render: renderArchiveList
	});

	comicForm = ReactDOM.render(React.createElement(ComicFormClass, { csrf: csrf }), document.querySelector('#addComic'));

	comicRenderer = ReactDOM.render(React.createElement(ComicListClass, null), document.querySelector("#comics"));

	archiveRenderer = ReactDOM.render(React.createElement(ArchiveListClass, null), document.querySelector("#archives"));
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

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

	console.log("Got past step 1");

	sendAjax('POST', $("#comicForm").attr("action"), $("#comicForm").serialize(), function () {
		console.log("I'm being called");
		comicRenderer.loadComicsFromServer();
		console.log("Got past step 2");
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

var renderComicList = function renderComicList() {
	if (this.state.data.length === 0) {
		return React.createElement(
			"div",
			{ className: "comicList" },
			React.createElement(
				"h3",
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
					{ href: comic.link },
					"Name: ",
					comic.name,
					" "
				)
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
				console.log("Step 2: ", data);
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

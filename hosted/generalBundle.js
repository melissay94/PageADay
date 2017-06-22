"use strict";

var archiveRenderer = void 0;
var ArchiveListClass = void 0;

// If a user wants to add a comic from the archive to their own library
var handleAddComic = function handleAddComic(e, comic) {
	e.preventDefault();

	sendAjax('POST', "/profile", comic);

	// Have it let the user know it was added
	handleError("You've added a new comic to your library");

	return false;
};

// Renders the list from the archives
var renderArchiveList = function renderArchiveList() {
	var _this = this;

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
				{ className: "btn btn-default", onClick: function onClick(e) {
						return handleAddComic(e, { name: comic.name, link: comic.link, _csrf: _this.props.csrf });
					} },
				React.createElement("span", { className: "glyphicon glyphicon-plus" })
			)
		);
	});

	return React.createElement(
		"div",
		{ className: "archiveList" },
		archiveNodes
	);
};

// Set up the page
var setup = function setup(csrf) {

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

	archiveRenderer = ReactDOM.render(React.createElement(ArchiveListClass, { csrf: csrf }), document.querySelector("#archives"));
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

let archiveRenderer;
let ArchiveListClass;

// If a user wants to add a comic from the archive to their own library
const handleAddComic = (e, comic) => {
	e.preventDefault();

	sendAjax('POST', "/comic", comic);

	// Have it let the user know it was added
	handleError("You've added a new comic to your library");

	return false;
};

// Renders the list from the archives
const renderArchiveList = function() {
	if (this.state.data.length === 0) {
		return (
			<div className="archiveList">
				<h4 className="emptyLibrary">There is no archive yet</h4>
			</div>
		);
	}

	const archiveNodes = this.state.data.map((comic) => {
		return (
			<div key={comic.name} className="archive">
				<h3 className="name"><a href={comic.link} target="_blank">{comic.name} </a></h3>
				<button className="btn btn-default" onClick={(e) => handleAddComic(e, {name: comic.name, link: comic.link, _csrf: this.props.csrf })}>
					<span className="glyphicon glyphicon-plus"></span>
				</button>
			</div>
		);
	});

	return (
		<div className="archiveList">
			{archiveNodes}
		</div>
	);
};

// Set up the page
const setup = function(csrf) {

	ArchiveListClass = React.createClass({
		loadArchiveFromServer: function() {
			sendAjax('GET', '/archives', null, function(data) {
				this.setState({ data: data.archives });
			}.bind(this));
		},
		getInitialState: function() {
			return {data: []};
		},
		componentDidMount: function() {
			this.loadArchiveFromServer();
		},
		render: renderArchiveList
	});

	archiveRenderer = ReactDOM.render(
		<ArchiveListClass csrf={csrf} />, document.querySelector("#archives")
	);
};
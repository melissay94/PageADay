let comicRenderer;
let comicForm;
let ComicFormClass;
let ComicListClass;


// Handles adding a comic to the user and overall db
const handleComics = (e) => {
	e.preventDefault();

	if($("#comicName").val() == '' || $("#comicLink").val() == '') {
		handleError("We need a name and link my dear");
		return false;
	}

	console.log($("#comicFormer").serialize());

	sendAjax('POST', $("#comicFormer").attr("action"), $("#comicFormer").serialize(), function() {
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

// Handles deleting an entry to my code
const handleDeletes = (e) => {
	e.preventDefault();

};

// Renders the comic form for creating new entries
const renderComicForm = function() {

	return (
		<form id="comicFormer" name="comicFormer"
				onSubmit={this.handleSubmit}
				action="/profile"
				method="POST"
				className="comicForm"
			>
			<div className="form-group row">
					<label htmlFor="name" className="col-md-2 col-form-label">Comic Name: </label>
					<div className="col-md-10">
						<input id="comicName" className="form-control" type="text" name="name" placeholder="Comic Name" />
					</div>
			</div>
			<div className="form-group row">
					<label htmlFor="link" className="col-md-2 col-form-label">Comic Link: </label>
					<div className="col-md-10">
						<input id="comicLink" className="form-control" type="text" name="link" placeholder="Comic Link" />
					</div>
			</div>
			<div className="form-group row">
					<label htmlFor="review" className="col-md-2 col-form-label">Review: </label>
					<div className="col-md-10">
						<textarea id="comicReview" className="form-control" name="review" placeholder="Your review here..." rows="8"></textarea>
					</div>
			</div>
			<div className="form-group row">
				<div className="offset-md-10 col-md-10">
					<input type="hidden" name="_csrf" value={this.props.csrf} />
					<input className="makeNewComic btn" type="submit" value="Submit!" /> 
				</div>
			</div>        
		</form>
	);
};

// Renders the list of comics the user has saved
const renderComicList = function() {
	if(this.state.data.length === 0) {
		return (
			<div className="comicList">
				<h4 className="emptyLibrary">You have no comics yet</h4>
			</div>
		);
	}
	
	const comicNodes = this.state.data.map(function(comic) {
		return (
			<div key={comic._id} className="comic">
				<h3 className="name"><a href={comic.link} target="_blank">{comic.name} </a></h3>
				<button className="btn btn-default"><span className="glyphicon glyphicon-pencil"></span></button>
				<button className="btn btn-default"><span className="glyphicon glyphicon-remove"></span></button>
				<p className="review">{comic.review}</p>
			</div>
		);
	});
	
	return (
		<div className="comicList">
			{comicNodes}
		</div>
	);
};

// Sets up the page with all components
const setup = function(csrf) {

	ComicFormClass = React.createClass({
		handleSubmit: handleComics, 
		render: renderComicForm,
	});
	
	ComicListClass = React.createClass({
		loadComicsFromServer: function() {
			sendAjax('GET', '/getComics', null, function(data) {
				this.setState({ data: data.comics });
			}.bind(this));
		}, 
		getInitialState: function() {
			return {data: []};
		},
		componentDidMount: function() {
			this.loadComicsFromServer();
		},
		render: renderComicList
	});

	comicForm = ReactDOM.render(
		<ComicFormClass csrf={csrf} />, document.querySelector('#addComic')
		);
	
	comicRenderer = ReactDOM.render(
		<ComicListClass />, document.querySelector("#comics")
	);
};


let comicRenderer;
let comicForm;
let ComicFormClass;
let ComicListClass;

const handleComics = (e) => {
	e.preventDefault();

	if($("#comicName").val() == '' || $("#comicLink").val() == '') {
		handleError("We need a name and link my dear");
		return false;
	}
	
	console.log("Got past step 1");

	sendAjax('POST', $("#comicForm").attr("action"), $("#comicForm").serialize(), function() {
		comicRenderer.loadComicsFromServer();
	});

	return false;
};

const renderComicForm = function() {

	return (
		<form id="comicForm"
				onSubmit={this.handleSubmit}
				name="comicForm"
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
				<h3 className="comicName"><a href={comic.link}>Name: {comic.name} </a></h3>
				<p className="comicReview">{comic.review}</p>
			</div>
		);
	});
	
	return (
		<div className="comicList">
			{comicNodes}
		</div>
	);
};

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

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
}

$(document).ready(function() {
	getToken();
});
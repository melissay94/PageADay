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
				<label htmlFor="name">Comic Name: </label>
				<input id="comicName" type="text" name="name" placeholder="Comic Name" />
				<label htmlFor="link">Comic Link: </label>
				<input id="comicLink" type="text" name="link" placeholder="Comic Link" />
				<label htmlFor="review">Review: </label>
				<textarea id="comicReview" name="review" placeholder="Your review here..." rows="8"></textarea>
				<input type="hidden" name="_csrf" value={this.props.csrf} />
				<input className="makeNewComic btn" type="submit" value="Submit!" />            
		</form>
	);
};

const setup = function(csrf) {

	ComicFormClass = React.createClass({
		handleSubmit: handleComics, 
		render: renderComicForm,
	});

	comicForm = ReactDOM.render(
		<ComicFormClass csrf={csrf} />, document.querySelector('#addComic')
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
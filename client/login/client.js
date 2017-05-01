const handleLogin = (e) => {
	e.preventDefault();

	if($("#user").val() == '' || $('#pass').val() == '') {
		handleError("Excuse me super fan, you missed a field");
		return false;
	}

	sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

	return false;
};

const handleSignup = (e) => {
	e.preventDefault();

	if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
		handleError("Excuse me super fan, you missed a field");
		return false;
	}

	if($("#pass").val() !== $("#pass2").val()) {
		handleError("Your choice of secret word doesn't match the retype");
		return false;
	}

	sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

	return false;
};

// Oh boy react
const renderLogin = function() {
	return (
		<div className="userOption">
			<h3>Login Here!</h3>
			<form id="loginForm" name="loginForm" 
				onSubmit={this.handleSubmit}
				action="/login" 
				method="POST" 
				className="mainForm">
	            <div className="form-group row">
	              <label htmlFor="username" className="col-sm-1 col-form-label">Username: </label>
	              <div className="col-sm-3">
	                <input id="user" className="form-control" type="text" name="username" placeholder="username"/>
	              </div>
	            </div>
	            <div className="form-group row">
	              <label htmlFor="pass" className="col-sm-1 col-form-label">Password: </label>
	              <div className="col-sm-3">
	                <input id="pass" className="form-control" type="password" name="pass" placeholder="password"/>
	              </div>
	            </div>
	            <div className="form-group row">
	              <div  className="offset-sm-2 col-sm-4">
									<input type="hidden" name="_csrf" value={this.props.csrf} />
	                <input className="formSubmit btn" type="submit" value="Start!" />            
	              </div>
	            </div>
	        </form>
         </div>
	);
};

const renderSignup = function() {
	return (
		<div className="userOption">
			<h3>Sign up Here!</h3>
			<form id="signupForm" name="signupForm" 
				onSubmit={this.handleSubmit}
				action="/signup" 
				method="POST" 
				className="mainForm">
	            <div className="form-group row">
	              <label htmlFor="username" className="col-sm-1 col-form-label">Username: </label>
	              <div className="col-sm-3">
	                <input id="user" className="form-control" type="text" name="username" placeholder="username"/>
	              </div>
	            </div>
	            <div className="form-group row">
	              <label htmlFor="pass" className="col-sm-1 col-form-label">Password: </label>
	              <div className="col-sm-3">
	                <input id="pass" className="form-control" type="password" name="pass" placeholder="password"/>
	              </div>
	            </div>
	            <div className="form-group row">
	              <label htmlFor="pass2" className="col-sm-1 col-form-label">Password Again: </label>
	              <div className="col-sm-3">
	                <input id="pass2" className="form-control" type="password" name="pass2" placeholder="retype password"/>
	              </div>
	            </div>
	            <div className="form-group row">
	              <div  className="offset-sm-2 col-sm-4">
					<input type="hidden" name="_csrf" value={this.props.csrf} />
	                <input className="formSubmit btn" type="submit" value="Start!" />            
	              </div>
	            </div>
	          </form>
          </div>
	);
};

const createLoginWindow = function(csrf) {
	
	const LoginWindow = React.createClass({
		handleSubmit: handleLogin,
		render: renderLogin
	});

	ReactDOM.render(
		<LoginWindow csrf={csrf} />,
		document.querySelector("#userInfo")
	);
};

const createSignupWindow = function(csrf) {

	const SignupWindow = React.createClass({
		handleSubmit: handleSignup,
		render: renderSignup
	});

	ReactDOM.render(
		<SignupWindow csrf={csrf} />,
		document.querySelector("#userInfo")
	);
};

const setup = function(csrf) {
	const loginButton = document.querySelector("#loginButton");
	const signupButton = document.querySelector("#signupButton");

	signupButton.addEventListener("click", (e) => {
		e.preventDefault();
		createSignupWindow(csrf);
		return false;
	});

	loginButton.addEventListener("click", (e) => {
		e.preventDefault();
		createLoginWindow(csrf);
		return false;
	});

	createSignupWindow(csrf);
};
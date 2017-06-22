// Handles the request to change password
const handlePassChange = (e) => {
	e.preventDefault();

	if ($("#user").val() == '' || $("#old_pass") == '' || $("new_pass") == '') {
		handleError("Excuse me, I'mma need all that info");
		return false;
	}

	sendAjax('POST', $('#changePass').attr("action"), $("#changePass").serialize());

	// Reset all the fields
	document.querySelector("#user").value = "";
	document.querySelector("#old_pass").value = "";
	document.querySelector("#new_pass").value = "";

	// Using handleError to let them know it succeeded
	handleError("Password has been changed");

	return false;
};

// Handles the request to change username
const handleUserChange = (e) => {
	e.preventDefault();

	if ($("#new_user").val() == '' || $("#pass") == '') {
		handleError("Excuse me, I'mma need all that info");
		return false;
	}

	sendAjax('POST', $('#changeUser').attr("action"), $("#changeUser").serialize());

	// Reset all the fields
	document.querySelector("#new_user").value = "";
	document.querySelector("#pass").value = "";

	// Using handleError to let them know it succeeded
	handleError("Username has been changed");

	return false;
};

// Set up form
const renderChangePass = function () {
	return (
		<form id="changePass" name="changePass"
			onSubmit={this.handleSubmit}
			action="/changePass"
			method="POST"
			className="changePass">
			<div className="form-group row">
	              <label htmlFor="username" className="col-md-2 col-form-label">Username: </label>
	              <div className="col-md-10">
	                <input id="user" className="form-control" type="text" name="username" placeholder="Username"/>
	              </div>
	            </div>
	            <div className="form-group row">
	              <label htmlFor="old_pass" className="col-md-2 col-form-label">Current Password: </label>
	              <div className="col-md-10">
	                <input id="old_pass" className="form-control" type="password" name="old_pass" placeholder="Current Password"/>
	              </div>
	            </div>
	            <div className="form-group row">
	              <label htmlFor="new_pass" className="col-md-2 col-form-label">New Password: </label>
	              <div className="col-md-10">
	                <input id="new_pass" className="form-control" type="password" name="new_pass" placeholder="New Password"/>
	              </div>
	            </div>
	            <div className="form-group row">
	              <div  className="offset-md-10 col-md-10">
					<input type="hidden" name="_csrf" value={this.props.csrf} />
	                <input className="formSubmit btn" type="submit" value="Reset Password" />            
	              </div>
	            </div>
			</form>
	);	
};

const renderChangeUsername = function () {
	return (
		<form id="changeUser" name="changeUser"
			onSubmit={this.handleSubmit}
			action="/changeUser"
			method="POST"
			className="changeUser">
			<div className="form-group row">
	              <label htmlFor="username" className="col-md-2 col-form-label">New Username: </label>
	              <div className="col-md-10">
	                <input id="new_user" className="form-control" type="text" name="username" placeholder="Username"/>
	              </div>
	            </div>
	            <div className="form-group row">
	              <label htmlFor="old_pass" className="col-md-2 col-form-label">Password: </label>
	              <div className="col-md-10">
	                <input id="pass" className="form-control" type="password" name="old_pass" placeholder="Current Password"/>
	              </div>
	            </div>
	            <div className="form-group row">
	              <div  className="offset-md-10 col-md-10">
					<input type="hidden" name="_csrf" value={this.props.csrf} />
	                <input className="formSubmit btn" type="submit" value="Change Username" />            
	              </div>
	            </div>
			</form>
	);	
};

const renderUsername = function() {
	console.log(this.state.data);
};

const setup = function(csrf) {
	const OptionsWindow = React.createClass({
		handleSubmit: handlePassChange,
		render: renderChangePass
	});

	const UserWindow = React.createClass({
		handleSubmit: handleUserChange,
		render: renderChangeUsername
	});

	ReactDOM.render(
		<OptionsWindow csrf={csrf} />,
		document.querySelector("#changePass")
	);

	ReactDOM.render(
		<UserWindow csrf={csrf} />,
		document.querySelector("#changeUser")
	);
};
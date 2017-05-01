// Handles the request to change password
const handleChange = (e) => {
	e.preventDefault();

	if ($("#user").val() == '' || $("#old_pass") == '' || $("new_pass") == '') {
		handleError("Excuse me, I'mma need all that info");
		return false;
	}

	sendAjax('POST', $('#changeForm').attr("action"), $("#changeForm").serialize());

	// Reset all the fields
	document.querySelector("#user").value = "";
	document.querySelector("#old_pass").value = "";
	document.querySelector("#new_pass").value = "";

	// Using handleError to let them know it succeeded
	handleError("Password has been changed");

	return false;
};

// Set up form
const renderChangePass = function () {
	return (
		<form id="changeForm" name="changeForm"
			onSubmit={this.handleSubmit}
			action="/options"
			method="POST"
			className="changeForm">
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

const setup = function(csrf) {
	const OptionsWindow = React.createClass({
		handleSubmit: handleChange,
		render: renderChangePass
	});

	ReactDOM.render(
		<OptionsWindow csrf={csrf} />,
		document.querySelector("#changeArea")
	);
};
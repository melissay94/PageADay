const handleError = (message) => {
	$("#errorMessage").text(message);
};

const redirect = (response) => {
	$("#domoMessage").animate({width:'hide'}, 350);
	window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
	$.ajax({
		cache: false, 
		type: type, 
		url: action, 
		data: data,
		dataType: "json",
		success: success,
		error: function(xhr, status, error) {
			var msgObj = JSON.parse(xhr.responseText);
			handleError(msgObj.error);
		}
	});
};

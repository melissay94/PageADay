"use strict";

var handleError = function handleError(message) {
	$("#errorMessage").text(message);
};

var redirect = function redirect(response) {
	$("#domoMessage").animate({ width: 'hide' }, 350);
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

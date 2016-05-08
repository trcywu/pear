var TemplateApp = TemplateApp || {};

TemplateApp.ajaxRequest(method, url, data) {
	return $.ajax({
		method: method,
		url: 		"http://localhost:3000/api" + url,
		data: 	data
	}).done(function(data) {
		console.log(data);
	}).fail(function() {
		console.log(data.responseJSON.message);
	});
}

TemplateApp.submitForm = function() {
	event.preventDefault();

	var method	= $(this).attr("method");
	var url			= $(this).attr("action");
	var data		= $(this).serialize();

	return TemplateApp.ajaxRequest(method, url, data);
}

TemplateApp.getUsers = function() {
	return TemplateApp.ajaxRequest("get", "/users");
}

$(function(){
	TemplateApp.initialize();
});
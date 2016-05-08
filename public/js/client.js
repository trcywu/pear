var TemplateApp = TemplateApp || {};

TemplateApp.getToken = function() {
	return window.localStorage.getItem("token");
}

TemplateApp.setToken = function(token) {
	return window.localStorage.setItem("token", token);
}

TemplateApp.saveTokenIfPresent = function(data) {
	if (data.token) return this.setToken(data.token);
	return false;
}

TemplateApp.ajaxRequest(method, url, data) {
	return $.ajax({
		method: method,
		url: 		"http://localhost:3000/api" + url,
		data: 	data
	}).done(function(data) {
		console.log(data);
		return TemplateApp.saveTokenIfPresent(data);
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
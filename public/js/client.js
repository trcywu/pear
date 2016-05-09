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

TemplateApp.setRequestHeader = function(xhr, settings) {
	var token = TemplateApp.getToken();
	if (token) return xhr.setRequestHeader("Authorization", "Bearer " + token);
}

TemplateApp.ajaxRequest = function(method, url, data) {
	return $.ajax({
		method: 		method,
		url: 				"http://localhost:3000/api" + url,
		data: 			data,
		beforeSend: this.setRequestHeader
	}).done(function(data) {
		console.log(data);
		return TemplateApp.saveTokenIfPresent(data);
	}).fail(function() {
		// console.log(data.responseJSON.message); // Not working currently. Will need to be fixed.
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

TemplateApp.initialize = function() {
	$("form").on("submit", this.submitForm);
	$("#getUsers").on("click", this.getUsers);
}

$(function(){
	TemplateApp.initialize();
});
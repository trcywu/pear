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
	}).fail(function(data) {
		console.log(data.responseJSON.message); // Not working currently. Will need to be fixed.
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



// MapApp.home = function(){
//   this.apiAjaxRequest("/", "get", null, "home")
// }

// TemplateApp.apiAjaxRequest = function(url, method, data, tpl){
//   return $.ajax({
//     type: method,
//     url: 'http://localhost:3000/' + url,
//     data: data,
//   }).done(function(data){
//     if (!data) return console.log('Wat')// MapApp.home();
//     if (tpl) return TemplateApp.getTemplate(tpl, data, url)
//       console.log(url)
//   }).fail(function(){
//     console.log("Something has gone wrong here.")
//   })
// }


TemplateApp.getTemplate = function(tpl, data){
  var templateUrl = "http://localhost:3000/templates" + tpl + ".html";

  $.ajax({
    url: templateUrl,
    method: "GET",
    dataType: "html"
  }).done(function(templateData){
    var parsedTemplate   = _.template(templateData);
    var compiledTemplate = parsedTemplate(data);
    $("main").empty().append(compiledTemplate);
  })
}


TemplateApp.linkClick = function(){
  
  var external = $(this).data("external");
  if (external) return;
  event.preventDefault();
  var url = $(this).attr("href");
  var tpl = $(this).data("template");
  if (url)   //return 
    // TemplateApp.apiAjaxRequest(url, "get", null, tpl);
  // If there isn't a href, just load the template 
  return TemplateApp.getTemplate(tpl, null, url);
}

TemplateApp.formSubmit = function(){
  event.preventDefault();
  var method = $(this).attr("method");
  var url    = $(this).attr("action");
  var tpl    = $(this).data("template");
  var data   = $(this).serialize();
  return TemplateApp.apiAjaxRequest(url, method, data, tpl);
}

TemplateApp.bindLinkClicks = function(){
  // Event delegation
  $("nav").on("click", "a", this.linkClick);
}

TemplateApp.bindFormSubmits = function(){
  // Event delegation
  $("body").on("submit", "form", this.formSubmit);
}



TemplateApp.initialize = function(){
  this.bindLinkClicks();
  // this.bindFormSubmits();
};




$(function(){
	TemplateApp.initialize();
});
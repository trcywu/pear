var Pear = Pear || {};

Pear.getToken = function() {
	return window.localStorage.getItem("token");
}

Pear.setToken = function(token) {
	return window.localStorage.setItem("token", token);
}

Pear.saveTokenIfPresent = function(data) {
	if (data.token) return this.setToken(data.token);
	return false;
}

Pear.setRequestHeader = function(xhr, settings) {
	var token = Pear.getToken();
	if (token) return xhr.setRequestHeader("Authorization", "Bearer " + token);
}

Pear.ajaxRequest = function(method, url, data, tpl) {
	return $.ajax({
		method: 		method,
		url: 				"http://localhost:3000/api" + url,
		data: 			data,
		beforeSend: this.setRequestHeader
	}).done(function(data) {
		console.log(data);
		Pear.saveTokenIfPresent(data);
		if (tpl) return Pear.getTemplate(tpl, data, url)
	}).fail(function(data) {
		// // Not working currently. Will need to be fixed.
		// console.log(data.responseJSON.message);
	});
}


Pear.getUsers = function() {
  console.log("Now this should console log!!!!")
	return Pear.ajaxRequest("get", "/users");
}

Pear.getTemplate = function(tpl, data){
  var templateUrl = "http://localhost:3000/templates/" + tpl + ".html";

  $.ajax({
    url: templateUrl,
    method: "GET",
    dataType: "html"
  }).done(function(templateData){
    var parsedTemplate   = _.template(templateData);
    var compiledTemplate = parsedTemplate(data);
    $("main").html(compiledTemplate);
		if ($("#canvas-map").length > 0) Pear.initMap();
  })
}

Pear.linkClick = function(){
  var external = $(this).data("external");
  if (external) return;

  event.preventDefault();
  var url = $(this).attr("href");
  var tpl = $(this).data("template");
  // If there isn't a href, just load the template
  if (url) return Pear.ajaxRequest("get", url, null, tpl)
	return Pear.getTemplate(tpl, null);
}

Pear.formSubmit = function(){
  event.preventDefault();
  var method = $(this).attr("method");
  var url    = $(this).attr("action");
  var tpl    = $(this).data("template");
  var data   = $(this).serialize();
  return Pear.ajaxRequest(method, url, data, tpl);
}

Pear.bindLinkClicks = function(){
  // Event delegation
  $("nav").on("click", "a", this.linkClick);
  $("main").on("click", "#getUsers", this.getUsers);
}

Pear.bindFormSubmits = function(){
  // Event delegation
  $("body").on("submit", "form", this.formSubmit);
}

Pear.initialize = function() {
	$("form").on("submit", this.submitForm);
	$("#getUsers").on("click", this.getUsers);
}

Pear.initialize = function(){
  this.bindLinkClicks();
  this.bindFormSubmits();
  this.setSlider();
  this.listenForSliderChange();
};

$(function(){
	Pear.initialize();
});

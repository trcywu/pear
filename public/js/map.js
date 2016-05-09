var MapApp = MapApp || {};

MapApp.apiAjaxRequest = function(url, method, data, tpl){
  return $.ajax({
    type: method,
    url: 'http://localhost:3000/' + url,
    data: data,
  }).done(function(data){
    if (!data) return MapApp.home();
    if (tpl) return MapApp.getTemplate(tpl, data, url)
      console.log(url)
  }).fail(function(){
    console.log("Something has gone wrong here.")
  })
}

MapApp.getTemplate = function(tpl, data){
  var templateUrl = "http://localhost:3000/templates/" + tpl + ".html";

  $.ajax({
    url: templateUrl,
    method: "GET",
    dataType: "html"
  }).done(function(templateData){
    var parsedTemplate   = _.template(templateData);
    var compiledTemplate = parsedTemplate(data);
    $("main").empty().append(compiledTemplate);
    MapApp.showMap();
  })
}

MapApp.showMap = function(){
  this.canvas = document.getElementById('canvas-map');

  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map;
  map = new google.maps.Map(this.canvas, mapOptions);
  console.log(this.map)
}

MapApp.home = function(){
  event.preventDefault();
  return MapApp.apiAjaxRequest("/", "get", null, "home")
}

MapApp.initialize = function(){
  $('.navbar-brand').on('click', this.home);
}

$(function(){

  MapApp.initialize();
})




/*

var MapApp = MapApp || {};

MapApp.home = function(){
  this.apiAjaxRequest("/", "get", null, "home")
}

MapApp.apiAjaxRequest = function(url, method, data, tpl){
  return $.ajax({
    type: method,
    url: 'http://localhost:3000/' + url,
    data: data,
  }).done(function(data){
    if (!data) return console.log('Wat')// MapApp.home();
    if (tpl) return MapApp.getTemplate(tpl, data, url)
      console.log(url)
  }).fail(function(){
    console.log("Something has gone wrong here.")
  })
}


MapApp.getTemplate = function(tpl, data){
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


MapApp.linkClick = function(){
  // If it has a data attribute of external, then it's an external link
  var external = $(this).data("external");
  // Don't prevent the default and actually just follow the link
  if (external) return;

  // Stop the browser from following the link
  event.preventDefault();
  // Get the url from the link that we clicked
  var url = $(this).attr("href");
  // Get which template we need to render
  var tpl = $(this).data("template");
  // If there is a href defined on the a link, then get the data
  if (url) return MapApp.apiAjaxRequest(url, "get", null, tpl);
  // If there isn't a href, just load the template 
  return MapApp.getTemplate(tpl, null, url);
}

MapApp.formSubmit = function(){
  event.preventDefault();
  var method = $(this).attr("method");
  var url    = $(this).attr("action");
  // This is the template we want to go to AFTER the form submit
  var tpl    = $(this).data("template");
  // This gets all the data from the form, you MUST have names on the inputs
  var data   = $(this).serialize();
  return MapApp.apiAjaxRequest(url, method, data, tpl);
}

MapApp.bindLinkClicks = function(){
  // Event delegation
  $("body").on("click", "a", this.linkClick);
}

MapApp.bindFormSubmits = function(){
  // Event delegation
  $("body").on("submit", "form", this.formSubmit);
}



MapApp.initialize = function(){

  this.bindLinkClicks();
  // this.bindFormSubmits();
  this.home();
};



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





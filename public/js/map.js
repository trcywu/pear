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

MapApp.addInfoWindowForVenue = function(venue, marker){
  var self = this;
  google.maps.event.addListener(marker, "click", function(){
    if (typeof self.infowindow != "undefined") self.infowindow.close();
    self.infowindow = new google.maps.InfoWindow({
      content: venue.name
    });

    self.infowindow.open(self.map, this);
  })
}

MapApp.createMarkerForVenue = function(venue, timeout) {
  var self = this;
  var latlng = new google.maps.LatLng(venue.geometry.location.lat, venue.geometry.location.lng);
  var image = ("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|00D900");
  window.setTimeout(function(){
  var marker = new google.maps.Marker({
    position: latlng,
    map: self.map,
    icon: image
    // animation: google.maps.Animation.DROP
  })
  self.addInfoWindowForVenue(venue, marker);
}, timeout)
}


MapApp.loopThroughVenues = function(data){
  return $.each(data.results, function(i, venue) {
    MapApp.createMarkerForVenue(venue, i*10);
  })
}

MapApp.getVenues = function(lat, lng){
    if (!lat || !lng ) return false
    var self = this;
     return $.ajax({
      type: "GET",
      url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lng+"&radius=100&type=bar&key=AIzaSyCg9HSSgl7ERpRyl2AxSHZgrwAUoqXWUno"
    }).done(self.loopThroughVenues)

}

MapApp.showMap = function(){
  this.canvas = document.getElementById('canvas-map');

  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(this.canvas, mapOptions);
  this.getVenues();
  google.maps.event.addListener(this.map, 'mouseup', function(event) {
     var currentLat = MapApp.map.getCenter().lat();
     var currentLng = MapApp.map.getCenter().lng();
     MapApp.getVenues(currentLat, currentLng);
     console.log(currentLat, currentLng);
  });
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

*/

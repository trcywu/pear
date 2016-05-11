var Pear = Pear || {};

Pear.map;
Pear.canvas;
Pear.markers = [];
Pear.defaultCenter = { 
  lat: 51.506178, 
  lng: -0.088369 
}

Pear.addInfoWindowForVenue = function(venue, marker){
  var self = this;
  var contentString = 
  '<div id="iw-container">' +
  '<div class="iw-title">'+venue.name+'</div>' +
  '<div class="iw-subTitle">History</div>' +
  '<p>'+venue.photos.html_attributions+'</p>' +
  '<div class="iw-subTitle">Price</div>'+
  '<p>'+venue.price_level+'</p>' +
  '<div class="iw-content">Rating</div>' +
  '<div class="iw-bottom-gradient">'+venue.rating+'</div>' +
  '</div>';

  google.maps.event.addListener(marker, "click", function(){
    if (typeof self.infowindow != "undefined") self.infowindow.close();
    self.infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    self.infowindow.open(self.map, this);
  })
}

Pear.createMarkerForVenue = function(venue, timeout) {
  var self   = this;
  var latlng = new google.maps.LatLng(venue.geometry.location.lat, venue.geometry.location.lng);
  var image  = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|00D900";

  var marker = new google.maps.Marker({
    position: latlng,
    map: self.map,
    icon: image
  })
  
  Pear.markers.push(marker);
  self.addInfoWindowForVenue(venue, marker);
}

// Sets the map on all markers in the array.
Pear.setMapOnAll = function(map) {
  for (var i = 0; i < Pear.markers.length; i++) {
    Pear.markers[i].setMap(map);
  }
}

// Shows any markers currently in the array.
Pear.showMarkers = function() {
  Pear.setMapOnAll(Pear.map);
}

// Removes the markers from the map, but keeps them in the array.
Pear.clearMarkers = function() {
  Pear.setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
Pear.deleteMarkers = function() {
  Pear.clearMarkers();
  Pear.markers = [];
}

Pear.loopThroughVenues = function(data){
  Pear.deleteMarkers();

  return $.each(data.results, function(i, venue) {
    Pear.createMarkerForVenue(venue, i*10);
  })
}

Pear.getVenues = function(lat, lng){
  if (!lat || !lng ) return false;

  var self = this;
  return $.ajax({
    type: "GET",
    url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lng+"&radius=250&type=bar&key=AIzaSyCg9HSSgl7ERpRyl2AxSHZgrwAUoqXWUno"
  }).done(self.loopThroughVenues)
}

Pear.populateMarkersOnDrag = function() {
  google.maps.event.addListener(Pear.map, 'mouseup', function(event) {
    var currentLat = Pear.map.getCenter().lat();
    var currentLng = Pear.map.getCenter().lng();
    Pear.getVenues(currentLat, currentLng);
 });
}

Pear.geocodeAddress = function() {
  var geocoder = new google.maps.Geocoder();
  var address  = document.getElementById('address').value;

  geocoder.geocode({ 'address': address }, function(results, status) {
    if (status !== google.maps.GeocoderStatus.OK) return alert('Geocode was not successful for the following reason: ' + status);

    var marker = new google.maps.Marker({
      map: Pear.map,
      position: results[0].geometry.location
    });

    Pear.map.panTo(marker.position);
    Pear.map.setZoom(16);
    Pear.getVenues(results[0].geometry.location.lat(), results[0].geometry.location.lng());
  });
}

Pear.setupGeocodeSearch = function() {
  var submitButton = document.getElementById('submit');
  submitButton.addEventListener('click', Pear.geocodeAddress);
}

Pear.initMap = function() { 
  this.canvas = document.getElementById('canvas-map');

  this.map = new google.maps.Map(this.canvas, {
    zoom: 14,
    center: Pear.defaultCenter,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]
  });

  // Binds the submit function for the search
  this.setupGeocodeSearch();

  // Get position sets up the mouseEvent when you drag the map
  this.populateMarkersOnDrag(this.map);
}

var Pear = Pear || {};

Pear.map;
Pear.canvas;
Pear.markers = [];
Pear.defaultCenter = { 
  lat: 51.506178, 
  lng: -0.088369 
}
Pear.venueTypes = [
      "amusement_park",
      "aquarium",
      "art_gallery",
      "bar",
      "bowling_alley",
      "cafe",
      "casino",
      "movie_theater",
      "museum",
      "night_club",
      "park",
      "parking",
      "restaurant",
      "zoo"
]

Pear.addInfoWindowForVenue = function(venue, marker){
  // At this point in time, 'self' is the Pear object:
  var self = this;
  console.log("This is addInfoWindowForVenue")

  var var_infobox_props = {
       content: contentString,
       disableAutoPan: false,
       maxWidth: 0,
       pixelOffset: new google.maps.Size(-10, 0),
       zIndex: null,
       boxClass: "myInfobox",
       closeBoxMargin: "2px",
       closeBoxURL: "close_sm.png",
       infoBoxClearance: new google.maps.Size(1, 1),
       visible: true,
       pane: "floatPane",
       enableEventPropagation: false
    };

  var contentString = 
  '<div id="iw-container">' +
  '<div class="iw-title">'+venue.name+'</div>' +
  '<div class="iw-subTitle">Image</div>' +
  //'<p>'+venue.photos.html_attributions+'</p>' +
  '<div class="iw-subTitle">Price</div>'+
  '<p>'+venue.price_level+'</p>' +
  '<div class="iw-subTitle"">Rating</div>' +
  '<div class="iw-bottom-gradient">'+venue.rating+'</div>' +
  '<div class="iw-subTitle">Opening Hours</div>'+
  '<p>'+venue.opening_hours+'</p>' +
  '</div>';

  var var_infobox = new InfoBox(var_infobox_props);

  google.maps.event.addListener(marker, "click", function(){
    if (typeof self.var_infobox != "undefined") self.var_infobox.close();
    self.var_infobox = new google.maps.InfoWindow({
      content: contentString
    });

    self.var_infobox.open(self.map, this);
  })

  // var var_infobox = new InfoBox(var_infobox_props);
  console.log(var_infobox)
  var_infobox.open(self.map, marker)
}

Pear.getMarkerScore = function(types, price, rating) {
  var score = 0;

  if (price) {
    if (price <= 2) {
      score += price;
    }
    else {
      score += (price + 1);
    }
  }

  if (rating) { score += rating; }

  if ($.inArray("night_club", types)) {
    score += 1;
  } else if ($.inArray("restaurant", types)) {
    score += 5;
  } else {
    score += 3;
  }

  if (!price && !rating) {
    return Math.floor(score);
  } else if (!price || !rating) {
    return Math.floor(score/2);
  } else {
    return Math.floor(score/3);
  }
}

Pear.createMarkerForVenue = function(venue, timeout) {
  console.log("This is createMarkerForVenue")
  var self   = this;
  var latlng = new google.maps.LatLng(venue.geometry.location.lat, venue.geometry.location.lng);
  var image  = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|00D900";
  var types  = venue.types;
  var price  = venue.price_level;
  var rating = venue.rating;
  var score  = this.getMarkerScore(types, price, rating);

  var pin_red = './images/pin-red-solid-1.png';

  var marker = new google.maps.Marker({
    position: latlng,
    map: self.map,
    icon: pin_red
    types: types,
    price: price,
    rating: rating,
    score: score
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
  console.log("loopThroughVenues after deleteMarkers")
  return $.each(data.results, function(i, venue) {
    Pear.createMarkerForVenue(venue, i*10);
  });
}

Pear.getVenues = function(lat, lng){
  // if (!lat || !lng ) return false;
  if (!lat || !lng ) {
    console.log("returns false in getVenues")
    return false;
  }
  var self = this;

  Pear.deleteMarkers();

  $.each(Pear.venueTypes, function(i, venueType) {
    return $.ajax({
      type: "GET",
      url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lng+"&radius=500&type="+venueType+"&key=AIzaSyCg9HSSgl7ERpRyl2AxSHZgrwAUoqXWUno"
    }).done(self.loopThroughVenues)
  })

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
    marker.setMap(null)

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
    mapTypeControl: true,
    panControl:true,
    rotateControl:true,
    streetViewControl: true,
    styles: [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]
  });

  // Binds the submit function for the search
  this.setupGeocodeSearch();

  // Get position sets up the mouseEvent when you drag the map
  this.populateMarkersOnDrag(this.map);
}

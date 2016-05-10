var Pear = Pear || {};

Pear.addInfoWindowForVenue = function(venue, marker){
  var self = this;
  google.maps.event.addListener(marker, "click", function(){
    if (typeof self.infowindow != "undefined") self.infowindow.close();
    self.infowindow = new google.maps.InfoWindow({
      content: venue.name
    });

    self.infowindow.open(self.map, this);
  })
}

Pear.createMarkerForVenue = function(venue, timeout) {
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

Pear.loopThroughVenues = function(data){
  return $.each(data.results, function(i, venue) {
    Pear.createMarkerForVenue(venue, i*10);
  })
}

Pear.getVenues = function(lat, lng){
  if (!lat || !lng ) return false
  var self = this;
  return $.ajax({
    type: "GET",
    url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lng+"&radius=500&type=bar&key=AIzaSyCg9HSSgl7ERpRyl2AxSHZgrwAUoqXWUno"
  }).done(self.loopThroughVenues)
}

// Pear.showMap = function(){
//   Pear.canvas = document.getElementById('canvas-map');

//   var mapOptions = {
//     zoom: 14,
//     center: new google.maps.LatLng(51.506178,-0.088369),
//     mapTypeId: google.maps.MapTypeId.ROADMAP
//   };
//   Pear.map = new google.maps.Map(Pear.canvas, mapOptions);

//   var currentLat = Pear.map.getCenter().lat();
//   var currentLng = Pear.map.getCenter().lng();
//   Pear.getVenues(currentLat, currentLng);

//   google.maps.event.addListener(Pear.map, 'mouseup', function(event) {
//      var currentLat = Pear.map.getCenter().lat();
//      var currentLng = Pear.map.getCenter().lng();
//      Pear.getVenues(currentLat, currentLng);
//   });
// }

Pear.initMap = function() { 
  var self = this;
  Pear.canvas = new google.maps.Map(document.getElementById('canvas-map'), {
    zoom: 14,
    center: {lat: 51.5206519, lng: -0.0072648},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  var geocoder = new google.maps.Geocoder();
  // console.log(geocoder)

  document.getElementById('submit').addEventListener('click', function() {
    console.log(this)
    self.geocodeAddress(geocoder, self.canvas);
  });
}

Pear.geocodeAddress = function(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

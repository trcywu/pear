var Pear = Pear || {};

Pear.map;
Pear.canvas;
Pear.markers = [];
Pear.defaultCenter = {
  lat: 51.506178,
  lng: -0.088369
}
Pear.venueTypes = [
      // "art_gallery",
      "bar"
      // "bowling_alley",
      // "cafe",
      // "casino",
      // "movie_theater",
      // "museum",
      // "night_club",
      // "park",
      // "parking",
      // "restaurant"
]


Pear.addInfoWindowForVenue = function(venue, marker){
  // At this point in time, 'self' is the Pear object:
  // var self = this;

  // var var_infobox_props = {
  //      content: contentString,
  //      disableAutoPan: false,
  //      maxWidth: 0,
  //      pixelOffset: new google.maps.Size(-10, 0),
  //      zIndex: null,
  //      boxClass: "myInfobox",
  //      closeBoxMargin: "2px",
  //      closeBoxURL: "close_sm.png",
  //      infoBoxClearance: new google.maps.Size(1, 1),
  //      visible: true,
  //      pane: "floatPane",
  //      enableEventPropagation: false
  //   };

  google.maps.event.addListener(marker, "click", function(){
    var venueImage;
    var venueName = venue.name;
    if ("photos" in venue) {
    venueImage =
     "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+venue.photos[0].photo_reference+"&sensor=false&key=AIzaSyCg9HSSgl7ERpRyl2AxSHZgrwAUoqXWUno";
    console.log("There is a photo!")
  } else {
    venueImage = "http://esq.h-cdn.co/assets/cm/15/06/54d3cdbba4f40_-_esq-01-bar-lgn.jpg";
    console.log("There ain't no photo here.")
  }
    if (venue.price_level) {
    var venuePrice = venue.price_level;
  } else {
    var venuePrice = "Price not listed!";
  }
    var venueRating = venue.rating;
    if (venue.opening_hours) {
    var venueOpeningHours = venue.opening_hours.open_now;
  } else {
    var venueOpeningHours = "Not listed!";
  }
    if (venue.types[0]) {
    var venueType = venue.types[0];
  } else {
    var venueType = venue.types;
  }

    // This is for the sliding side bar
    	var $panel = $('#slide-panel');
      $panel.empty();
      $panel.append('<div class="info-box">' +
        '<div><h1 class="venue-name">'+venueName+'</div></h1>' +
        '<div><img src='+venueImage+' class="venue-image"></div>' +
        '<p><strong>Price:</strong> <span class="venue-price">'+venuePrice+'</span></p>' +
        '<p><strong>Rating:</strong> <span class="venue-rating">'+venueRating+'</span></p>' +
        '<p><strong>Opening Hours:</strong> <span class="venue-opening">'+venueOpeningHours+'</span></p>' +
        '<p><strong>Category:</strong> <span class="venue-category">'+venueType+'</span></p>' +
        '</div>');
    	if ($panel.hasClass("visible")) {
    		$panel.removeClass('visible').animate({'margin-left':'-300px'});
    	} else {
    		$panel.addClass('visible').animate({'margin-left':'0px'});
    	}
    	return false;
    });
    if ("photos" in venue){
      console.log(venue.photos[0].photo_reference);

    }
    //   if (typeof self.var_infobox != "undefined") self.var_infobox.close();
  //   self.var_infobox = new google.maps.InfoWindow({
  //     content: contentString
  //   });
  //
  //   self.var_infobox.open(self.map, this);
  // })

  // var var_infobox = new InfoBox(var_infobox_props);
  //
  // var_infobox.open(self.map, marker)

}

Pear.getMarkerScore = function(types, price, rating) {
  var score = 0;

  switch (types[0]) {
    case "art_gallery":
      if (rating && rating >= 2.5) {
        score = 5;
      } else {
        score = 4;
      }
      break;
    case "bar":
      if (price) {
        score = (price + 1);
      } else if (rating && rating >= 2.5) {
        score = 4;
      } else {
        score = 3;
      }
      break;
    case "bowling_alley":
      score = 3;
      break;
    case "cafe":
      if (rating && rating >= 3.3) {
        score = 4;
      } else if (rating && rating <= 1.6) {
        score = 2;
      } else {
        score = 3;
      }
      break;
    case "casino":
      if (rating && rating >= 2.5) {
        score = 4;
      } else {
        score = 3;
      }
      break;
    case "movie_theater":
      score = 3;
      break;
    case "museum":
      if (rating && rating >= 2.5) {
        score = 5;
      } else {
        score = 4;
      }
      break;
    case "night_club":
      if (price && price === 4) {
        score = 4;
      } else if (rating && rating >= 2.5) {
        score = 4;
      } else {
        score = 2;
      }
      break;
    case "park":
      score = 1;
      break;
    case "parking":
      score = 1;
      break;
    case "restaurant":
      if (price) {
        score = (price + 1);
      } else if (rating && rating <= 1.25) {
        score = 2;
      } else if (rating && rating <= 2.5) {
        score = 3;
      } else if (rating && rating <= 3.75) {
        score = 4;
      } else {
        score = 5;
      }
      break;
  }
  return score;
}

Pear.createMarkerForVenue = function(venue, timeout) {
  var self   = this;
  var latlng = new google.maps.LatLng(venue.geometry.location.lat, venue.geometry.location.lng);
  var image  = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|00D900";
  var types  = venue.types;
  var price  = venue.price_level;
  var rating = venue.rating;
  var score  = this.getMarkerScore(types, price, rating);
  var icon   = "./images/map_markers/" + venue.types[0] + "_marker.png";

  var marker = new google.maps.Marker({
    position: latlng,
    map: self.map,
    icon: icon,
    types: types,
    price: price,
    rating: rating,
    score: score,
    animation: google.maps.Animation.DROP
  });

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
  // Pear.deleteMarkers();
  return $.each(data.results, function(i, venue) {
    Pear.createMarkerForVenue(venue, i*10);
  });
}

Pear.getVenues = function(lat, lng){
  // if (!lat || !lng ) return false;
  if (!lat || !lng ) {
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
  Pear.resetSlider();
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
    minZoom: 11,
    zoom: 14,
    center: Pear.defaultCenter,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    // panControl:true,
    // rotateControl:true,
    // streetViewControl: true,
    styles: [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]
  });

  // Binds the submit function for the search
  this.setupGeocodeSearch();


  this.addYourLocationButton(Pear.map, Pear.userMarker);


  // Get position sets up the mouseEvent when you drag the map
  this.populateMarkersOnDrag(this.map);
}

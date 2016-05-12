var Pear = Pear || {};

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

Pear.createMarkerForClinic = function(clinic, timeout) {
  var self   = this;
  var latlng = new google.maps.LatLng(clinic.latitude, clinic.longitude);
  var name   = clinic.organisation_name;
  var types  = "Clinic";
  var score  = 1;
  var icon   = "./images/map_markers/clinic_marker.png";

  var marker = new google.maps.Marker({
    position: latlng,
    map: self.map,
    icon: icon,
    types: types,
    score: score
  });

  marker.setMap(null);

  Pear.clinicMarkers.push(marker);
}


Pear.createMarkerForVenue = function(venue, timeout) {
  var self   = this;
  var latlng = new google.maps.LatLng(venue.geometry.location.lat, venue.geometry.location.lng);
  var types  = venue.types;
  var price  = venue.price_level;
  var rating = venue.rating;
  var name   = venue.name;
  var score  = this.getMarkerScore(types, price, rating);
  var icon   = "./images/map_markers/" + venue.types[0] + "_marker.png";

  var marker = new google.maps.Marker({
    position: latlng,
    map: self.map,
    icon: icon,
    types: types,
    name: name,
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

Pear.loopThroughClinics = function(data) {
    return $.each(data.result, function(i, clinic) {
        Pear.createMarkerForClinic(clinic, i * 10);
    });
}

Pear.loopThroughVenues = function(data) {
    // Pear.deleteMarkers();
    return $.each(data.results, function(i, venue) {

        Pear.createMarkerForVenue(venue, i * 10);
    });
}

Pear.getClinics = function(lat, lng) {
  var self = this;

  $.each(Pear.venueTypes, function(i, venueType) {
      return $.ajax({
          type: "GET",
          url: "https://data.gov.uk/data/api/service/health/clinics?city=London"
          // &latitude=+ lat +&longitude=+ lng;
      }).done(self.loopThroughClinics)
  })

}

Pear.getVenues = function(lat, lng) {
    // if (!lat || !lng ) return false;
    if (!lat || !lng) {
        return false;
    }
    var self = this;

    Pear.deleteMarkers();

    $.each(Pear.venueTypes, function(i, venueType) {
        return $.ajax({
            type: "GET",
            url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lng + "&radius=500&type=" + venueType + "&key=AIzaSyCg9HSSgl7ERpRyl2AxSHZgrwAUoqXWUno"
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

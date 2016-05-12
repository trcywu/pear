var Pear = Pear || {};

Pear.map;
Pear.canvas;
Pear.markers = [];
Pear.clinicMarkers = [];
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

Pear.defaultCategoryImage = function(category) {
    switch (category) {
        case "bar":
            return "http://esq.h-cdn.co/assets/cm/15/06/54d3cdbba4f40_-_esq-01-bar-lgn.jpg";
        case "restaurant":
            return "http://www.jungfrau.ch/fileadmin/apps/orte/images/358-alpstube.jpg";
        case "park":
            return "https://zainabmarnie.files.wordpress.com/2013/03/park-at-night_00450891.jpg";
        case "art_gallery":
            return "http://www.tylershields.com/images/gallery/art_gallery.jpg";
        case "bowling_alley":
            return "http://bowling-alleys.regionaldirectory.us/bowling-alley-720.jpg";
        case "cafe":
            return "http://thetravelingstory.com/wp-content/uploads/2015/11/seniman-coffe.jpg";
        case "casino":
            return "http://static.designmynight.com/uploads/2014/01/GrosvenorCasino2-optimised.jpg";
        case "movie_theater":
            return "http://www.phoenix.org.uk/content/uploads/2014/04/Silver-screenings-1.jpg";
        case "museum":
            return "http://www.britishmuseum.org/images/new_waddesdon_gallery_944x531.jpg";
        case "night_club":
            return "http://cdn.londonandpartners.com/asset/53f2c1b95a0bb4af0f509dae4c405106.jpg";
        case "parking":
            return "https://c1.staticflickr.com/3/2754/4457664301_69e4ee6b7d_z.jpg?zz=1";
    }
}

Pear.categoryIcon = function(category) {
    switch (category) {
        case "bar":
            return "fa fa-beer";
        case "restaurant":
            return "fa fa-cutlery";
        case "park":
            return "fa fa-leaf";
        case "art_gallery":
            return "fa fa-paint-brush";
        case "bowling_alley":
            return "fa fa-trophy";
        case "cafe":
            return "fa fa-coffee";
        case "casino":
            return "fa fa-money";
        case "movie_theater":
            return "fa fa-ticket";
        case "museum":
            return "fa fa-building";
        case "night_club":
            return "fa fa-headphones";
        case "parking":
            return "fa fa-car";
    }
}

Pear.changeWindowContent = function(venue, marker) {
    var venueImage;
    var venueAddress = venue.vicinity;
    var venueName = venue.name;
    if ("photos" in venue) {
        venueImage =
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + venue.photos[0].photo_reference + "&sensor=false&key=AIzaSyCg9HSSgl7ERpRyl2AxSHZgrwAUoqXWUno";
    } else {
        // venueImage = "http://esq.h-cdn.co/assets/cm/15/06/54d3cdbba4f40_-_esq-01-bar-lgn.jpg";
        // console.log("There ain't no photo here.")
        venueImage = Pear.defaultCategoryImage(venue.types[0]);
    }

    if (venue.price_level) {
        var venuePrice = venue.price_level;
        venuePrice = "fa fa-usd";
    } else {
        var venuePrice = "fa fa-question";
    }

    if (venue.rating) {
        var venueRating = Pear.starRating(venue.rating);
    } else {
        var venueRating = "Not currently rated!"
    }

    if (venue.opening_hours) {
        if (venue.opening_hours.open_now) {
            var venueOpeningHours = "fa fa-check";
        } else {
            var venueOpeningHours = "fa fa-times";
        }
    } else {
        var venueOpeningHours = "fa fa-question";
    }

    if (venue.types[0]) {
        var venueType = venue.types[0];
        venueType = Pear.categoryIcon(venue.types[0]);
    } else {
        var venueType = venue.types;
        venueType = Pear.categoryIcon(venue.types);
    }

    if (marker.score == 1) {
      var markerScore = "fa fa-hand-peace-o"
    } else if (marker.score == 2) {
      var markerScore = "fa fa-hand-spock-o"
    } else if (marker.score == 3) {
      var markerScore = "fa fa-hand-rock-o"
    } else if (marker.score == 4) {
      var markerScore = "fa fa-thumbs-o-up"
    } else {
      var markerScore = "fa fa-hand-o-up"
    }

    // This is for the sliding side bar
    var $panel = $('#slide-panel');

    $panel.empty();

    $panel.append('<div class="info-box">' +
        '<div><h3 class="venue-name">' + venueName + '</h3></div>' +
        '<p><h5 class="venue-vicinity">' + venueAddress + '</h5></p>' +
        '<div><img src=' + venueImage + ' class="venue-image"></div>' +
        '<p><span class="venue-rating">' + venueRating + '</span></p>' +
        // use div -col sm 6 per box using the bootstrap method to make these boxes instead.
        '<div class="row">' +
        '<p><div class="venue-price col-6">Price:<br> <i class="' + venuePrice + '"aria-hidden="true"></i></div>' +
        '<div class="venue-opening col-6">Open:<br> <i class="' + venueOpeningHours + '"aria-hidden="true"></i></div></p>' +
        '</div><div class="row">' +
        '<p><div class="venue-category col-6">Category:<br> <i class="' + venueType + '"aria-hidden="true"></i></div>' +
        '<div class="venue-category col-6">Mood:<br> <i class="' + markerScore + '"aria-hidden="true"></i></div></p>' +
        '</div></div>');
}

Pear.addInfoWindowForVenue = function(venue, marker) {
    google.maps.event.addListener(marker, "click", function() {

        var $panel = $("#slide-panel");
        console.log(marker);
        if ($panel.hasClass("visible") && $panel.html().indexOf(marker.name) !== -1) {
            Pear.changeWindowContent(venue, marker);
            $panel.removeClass('visible').animate({
                'margin-left': '-300px'
            });
        } else if ($panel.hasClass("visible")) {
            $panel.removeClass("visible").animate({
                "margin-left": "-300px"
            }, null, null, function() {
                Pear.changeWindowContent(venue, marker);
                $panel.addClass("visible").animate({
                    "margin-left": "0px"
                });
            });
        } else {
            Pear.changeWindowContent(venue, marker);
            $panel.addClass('visible').animate({
                'margin-left': '0px'
            });
        }
        return false;
    });
}


Pear.clinicWindowContent = function(clinic, marker) {
  // This is for the sliding side bar
  var $panel = $('#slide-panel');

  $panel.empty();

  $panel.append('<div class="info-box">' +
      "<div><h3>Well I suppose that's what you get for dating around..</h3></div>" +
      '<div><span class="clinic-name"><strong>Your closest clinic is:</strong><br> '+ clinic.organisation_name +'</span></div>' +
      '<div><span class="clinic-address">'+ clinic.address1 +'</span></div>' +
      '<div><span class="clinic-address">'+ clinic.address2 +'</span></div>' +
      '<div><span class="clinic-address">'+ clinic.address3 +'</span></div>' +
      '<div><span class="clinic-address">'+ clinic.city +'</span></div>' +
      '<div><span class="clinic-address">'+ clinic.postcode +'</span></div><br>' +
      '<div><img src="http://www.alloverwellness.com/wp-content/uploads/2014/11/Shocked-Doctor-26695685_l.jpg" class="clinic-doc"></div>' +
      '</div>');
}

Pear.addInfoWindowForClinics = function(clinic, marker) {
    google.maps.event.addListener(marker, "click", function() {
        var $panel = $("#slide-panel");
        if ($panel.hasClass("visible") && $panel.html().indexOf(clinic.address1) !== -1) {
            Pear.clinicWindowContent(clinic, marker);
            $panel.removeClass('visible').animate({
                'margin-left': '-300px'
            });
        } else if ($panel.hasClass("visible")) {
            $panel.removeClass("visible").animate({
                "margin-left": "-300px"
            }, null, null, function() {
                Pear.clinicWindowContent(clinic, marker);
                $panel.addClass("visible").animate({
                    "margin-left": "0px"
                });
            });
        } else {
            Pear.clinicWindowContent(clinic, marker);
            $panel.addClass('visible').animate({
                'margin-left': '0px'
            });
        }
        return false;
    });
}

Pear.geocodeAddress = function() {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('address').value;

    geocoder.geocode({
        'address': address
    }, function(results, status) {
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
        mapTypeControl: false,
        // panControl:true,
        // rotateControl:true,
        streetViewControl: false,
        styles: [{
            "featureType": "landscape",
            "stylers": [{
                "saturation": -100
            }, {
                "lightness": 65
            }, {
                "visibility": "on"
            }]
        }, {
            "featureType": "poi",
            "stylers": [{
                "saturation": -100
            }, {
                "lightness": 51
            }, {
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.highway",
            "stylers": [{
                "saturation": -100
            }, {
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.arterial",
            "stylers": [{
                "saturation": -100
            }, {
                "lightness": 30
            }, {
                "visibility": "on"
            }]
        }, {
            "featureType": "road.local",
            "stylers": [{
                "saturation": -100
            }, {
                "lightness": 40
            }, {
                "visibility": "on"
            }]
        }, {
            "featureType": "transit",
            "stylers": [{
                "saturation": -100
            }, {
                "visibility": "simplified"
            }]
        }, {
            "featureType": "administrative.province",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "water",
            "elementType": "labels",
            "stylers": [{
                "visibility": "on"
            }, {
                "lightness": -25
            }, {
                "saturation": -100
            }]
        }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "hue": "#ffff00"
            }, {
                "lightness": -25
            }, {
                "saturation": -97
            }]
        }]
    });

    // Binds the submit function for the search
    this.setupGeocodeSearch();


    this.addYourLocationButton(Pear.map, Pear.userMarker);


    // Get position sets up the mouseEvent when you drag the map
    this.populateMarkersOnDrag(this.map);

    Pear.getClinics();

}


Pear.starRating = function(rating) {
    var fullStar = "<i class='fa fa-star'></i>"
    var halfStar = "<i class='fa fa-star-half-o'></i>";
    var emptyStar = "<i class='fa fa-star-o'></i>"

    var output = [];

    var numberOfFullStars = Math.floor(rating);

    for (i = 0; i < numberOfFullStars; i++) {
        output.push(fullStar)
    }

    if (rating % 1 != 0) {
        output.push(halfStar)
    }

    var numberofEmptyStars = (5 - output.length)

    for (i = 0; i < numberofEmptyStars; i++) {
        output.push(emptyStar)
    }

    var stars = output.join(" ");
    return stars;
}

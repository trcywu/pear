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

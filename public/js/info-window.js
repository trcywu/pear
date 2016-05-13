var Pear = Pear || {};

Pear.defaultCategoryImage = function(category) {
	var image = "./images/default_slider_images/" + category + "_default.jpg";
	return image;
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

Pear.changeWindowContent = function(venue, marker) {
	var venueImage;
	var venueAddress = venue.vicinity;
	var venueName = venue.name;

	if ("photos" in venue) {
		venueImage =
		"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + venue.photos[0].photo_reference + "&sensor=false&key=AIzaSyCg9HSSgl7ERpRyl2AxSHZgrwAUoqXWUno";
	} else {
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

  $panel.append('<div class="info-box"><div class="venue-header">' +
  	'<div><h3 class="venue-name">' + venueName + '</h3></div>' +
    '<p><h5 class="venue-vicinity">' + venueAddress + '</h5></p>' +
    '<div><img src=' + venueImage + ' class="venue-image"></div>' +
    '<p><span class="venue-rating">' + venueRating + '</span></p></div>' +
    '<div class="row venue-ratings">' +
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
  var $panel = $('#slide-panel');

  $panel.empty();

  $panel.append('<div class="info-box">' +
  	"<div><h3>Well I suppose that's what you get for dating around..</h3></div>" +
  	'<div><img src="./images/default_slider_images/shocked_doc.jpg" class="clinic-doc"></div>' +
  	'<div><span class="clinic-name"><strong>Your closest clinic is:</strong><br> '+ clinic.organisation_name +'</span></div>' +
  	'<div><span class="clinic-address">'+ clinic.address1 +'</span></div>' +
  	'<div><span class="clinic-address">'+ clinic.address2 +'</span></div>' +
  	'<div><span class="clinic-address">'+ clinic.address3 +'</span></div>' +
  	'<div><span class="clinic-address">'+ clinic.city +'</span></div>' +
  	'<div><span class="clinic-address">'+ clinic.postcode +'</span></div><br>' +
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
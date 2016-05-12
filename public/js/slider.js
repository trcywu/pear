var Pear = Pear || {};

Pear.ratingSlider = $("#ratingSlider");

Pear.setSlider = function() {
	$("#ratingSlider").slider({
		value: 3,
		min: 1,
		max: 5
	});

	Pear.listenForSliderChange();
}

Pear.listenForSliderChange = function() {
	$("#ratingSlider").on("change", function() {
		Pear.changeMapOnSlide();
		return (function() {
			Pear.setTooltiptext();
		})()
	});
}

Pear.changeMapOnSlide = function() {
	Pear.setTooltiptext();
	var sliderVal = $("#ratingSlider").slider("getValue");

	$.each(Pear.markers, function(i, marker) {
		if (marker.score !== sliderVal) {
			marker.setMap(null);
		} else {
			marker.setMap(Pear.map);
		}
	});

	if (sliderVal === 1) {
		$.each(Pear.clinicMarkers, function(i, marker) {
			marker.setMap(Pear.map);
		});
	} else {
		$.each(Pear.clinicMarkers, function(i, marker) {
			marker.setMap(null);
		});
	}
}

Pear.setTooltiptext = function() {
	var sliderVal = $("#ratingSlider").slider("getValue");

	switch(sliderVal) {
		case 1:
			$(".moodQuestion").html("Only one thing on your mind!");
			break;
		case 2:
			$(".moodQuestion").html("Cheap and cheerful");
			break;
		case 3:
			$(".moodQuestion").html("Just a casual date");
			break;
		case 4:
			$(".moodQuestion").html("Pushing the boat out");
			break;
		case 5:
			$(".moodQuestion").html("Hey, big spender!");
			break;
	}
}

Pear.resetSlider = function() {
	$("#ratingSlider").slider("setValue", 3);
	$(".moodQuestion").html("What mood are you going for?")
}

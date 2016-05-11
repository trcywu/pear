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
	$("#ratingSlider").on("change", Pear.changeMapOnSlide);
}

Pear.changeMapOnSlide = function() {
	var sliderVal = $("#ratingSlider").slider("getValue");

	$.each(Pear.markers, function(i, marker) {
		if (marker.score !== sliderVal) {
			Pear.markers[i].setMap(null);
		} else {
			Pear.markers[i].setMap(Pear.map);
		}
	})

}


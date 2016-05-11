var Pear = Pear || {};

Pear.ratingSlider = $("#ratingSlider");

Pear.setSlider = function() {
	$("#ratingSlider").slider({
		value: 3,
		min: 1,
		max: 5
	});
}

Pear.listenForSliderChange = function() {
	$("#ratingSlider").on("slide", Pear.changeMapOnSlide());
}

Pear.changeMapOnSlide = function() {
	var sliderVal = $("#ratingSlider").getValue;

	$.each(Pear.markers, function(i, marker) {
		if (marker.score !== sliderVal) {
			Pear.markers[i].setMap(null);
		} else {
			Pear.markers[i].setMap(Pear.map);
		}
	})

}


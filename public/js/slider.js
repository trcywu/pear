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
			Pear.markers[i].setMap(null);
		} else {
			Pear.markers[i].setMap(Pear.map);
		}
	});
}

Pear.setTooltiptext = function() {
	var sliderVal = $("#ratingSlider").slider("getValue");

	switch(sliderVal) {
		case 1:
			$(".moodQuestion").html("Only one thing on your mind");
			break;
		case 2:
			$(".moodQuestion").html("Text for 2");
			break;
		case 3:
			$(".moodQuestion").html("Just a casual date");
			break;
		case 4:
			$(".moodQuestion").html("Text for 4");
			break;
		case 5:
			$(".moodQuestion").html("Hey, big spender!");
			break;
	}
}

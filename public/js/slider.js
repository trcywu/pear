var Pear = Pear || {};

Pear.ratingSlider = $("#ratingSlider");

Pear.setSlider = function() {
	console.log(this.ratingSlider);
	$("#ratingSlider").slider({
		value: 3,
		min: 1,
		max: 5
	});
}
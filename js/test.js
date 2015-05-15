$(document).ready(function () {

	//Setup vars
	var scrollerInvervalRight;
	var scrollerInvervalLeft;
	var firedRight = false;
	var firedLeft = false;
	var currentScrollPos = $('.container').scrollLeft();

	function assignMouseTouchEvents() {
		$('.control').on('mouseenter', function(event) {
			event.stopPropagation();
			alert('mouseenter');
		});
		$('.control').on('mouseleave', function(event) {
			event.stopPropagation();
			alert('mouseleave');
		});
	}

	function setIntervalRight() {
		scrollerInvervalRight = setInterval(function() {
			moveItRight();
		},10);
	}

	function setIntervalLeft() {
		scrollerInvervalLeft = setInterval(function() {
			moveItLeft();
		},10);
	}

	function clearIntervalRight() {
		clearInterval(scrollerInvervalRight);
	}

	function clearIntervalLeft() {
		clearInterval(scrollerInvervalLeft);
	}

	function clearAllIntervals() {
		clearIntervalRight();
		clearIntervalLeft();
	}

	//App init
	assignMouseTouchEvents();
});

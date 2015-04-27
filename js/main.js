/*
	Scrolling Slider
	by Richard Bultitude

	A JavaScript plugin that scrolls a horizonal container
	via left/right controls
	on hover or using the scrollbar

	Depends on JQuery and JQuery Debounce Throttle
 */

$(document).ready(function() {

	//Interval  vars
	var scrollerInvervalRight;
	var scrollerInvervalLeft;
	var firedRight = false;
	var firedLeft = false;

	//Elements & position
	var container = $('.carousel');
	var mainContent = $('.content');
	var currentScrollPos = container.scrollLeft();
	var controls = $('.direction-control');
	var leftControl = $('.direction-control-left');
	var rightControl = $('.direction-control-right');
	var rate = 0;
	// var maxspeed = 1;
	var frameRate = 10;
	// var xPos = 0;

	//List items
	var list = $('.carousel-list');
	var totalWidth = 0;

	//break points
	var breakPoint = 480;
	//var breakPointCheckMin = null || window.matchMedia('all and (min-width: ' + breakPoint + 'px)');
	var breakPointCheckMax = null || window.matchMedia('all and (max-width: ' + breakPoint + 'px)');

	function getListSize() {
		//count modules
		var listItemSizes = [];
		$('li', list).each(function() {
			var thisItem = $(this);
			listItemSizes.push(thisItem.outerWidth());
		});
		for (var i = 0; i < listItemSizes.length; i++) {
			totalWidth = totalWidth + listItemSizes[i];
		};
	}

	function setListSize() {
		list.width(totalWidth);
	}

	function hideControlsAtEnd() {
		var containerWidth = container.width();
		var listWidth = totalWidth;
		var scrollArea = listWidth - containerWidth;
		var scrollPos = container.scrollLeft();

		if (containerWidth >= listWidth) {
			leftControl.fadeOut();
			rightControl.fadeOut();
		} else {
			//show/hide right
			if (scrollPos === scrollArea) {
				rightControl.fadeOut();
			} else {
				rightControl.fadeIn();
			}
			//show/hide left
			if (scrollPos === 0) {
				leftControl.fadeOut();
			} else {
				leftControl.fadeIn();
			}
		}
	}

	container.scroll(function() {
		hideControlsAtEnd();
	});

	//Create invervals for animation
	function setIntervalRight() {
		scrollerInvervalRight = setInterval(function() {
			moveItRight();
		}, frameRate);
	}

	function setIntervalLeft() {
		scrollerInvervalLeft = setInterval(function() {
			moveItLeft();
		}, frameRate);
	}

	//Clear intervals at stops
	function clearIntervalRight() {
		clearInterval(scrollerInvervalRight);
		scrollerInvervalRight = 0;
	}

	function clearIntervalLeft() {
		clearInterval(scrollerInvervalLeft);
		scrollerInvervalLeft = 0;
	}

	//Interaction functions
	function assignMouseTouchEvents() {
		$('.direction').on('click onLongPress', function(event) {
			event.preventDefault();
		});

		rightControl.on('mouseenter touchstart', function(event) {
			event.stopPropagation();
			setIntervalRight();
		});

		rightControl.on('mouseleave touchend', function() {
			clearIntervalRight();
		});

		leftControl.on('mouseenter touchstart', function(event) {
			event.stopPropagation();
			setIntervalLeft();
		});

		leftControl.on('mouseleave touchend', function() {
			clearIntervalLeft();
		});
		$('.stop').on('click', function() {
			clearAllIntervals();
		});
		//Remove mouse events on touch devices
		unAssignMouseTouchEvents();
	}

	function unAssignMouseTouchEvents() {
		if (Modernizr.touch) {
			rightControl.off('mouseenter');
			leftControl.off('mouseenter');
		}
	}

	function clearAllIntervals() {
		clearIntervalRight();
		clearIntervalLeft();
	}

	//Set scroll position(s)
	function moveItRight() {
		currentScrollPos = container.scrollLeft();
		var _newScrollPos = 1 + Math.abs(rate);
		_newScrollPos = currentScrollPos + _newScrollPos;
		container.scrollLeft(_newScrollPos);
	}

	function moveItLeft() {
		currentScrollPos = container.scrollLeft();
		var _newScrollPos = 1 + Math.abs(rate);
		_newScrollPos = currentScrollPos - _newScrollPos;
		container.scrollLeft(_newScrollPos);
	}

	//Change the animation rate based on position of cursor
	function directionMouseMove() {
		controls.mousemove(function(e) {
			var $this = $(this);
			var left = $this.is('.direction-control-left');
			var w = $this.width();

			if (left) {
				rate = ((w - e.pageX - $(this).offset().left + 1) / w) * 3.5;
			} else {
				rate = -((e.pageX - $(this).offset().left + 1) / w) * 3.5;
			}
		});
	}

	//Keyboard controls
	function assignKeyboardEvents() {
		$(document).on('keydown', function(e) {
			switch (e.keyCode) {
				case 39:
					if (firedRight === false) {
						firedRight = true;
						setIntervalRight();
					}
					break;
				case 37:
					if (firedLeft === false) {
						firedLeft = true;
						setIntervalLeft();
					}
					break;
			}
		});

		$(document).on('keyup', function(e) {
			switch (e.keyCode) {
				case 39:
					if (firedRight === true) {
						clearIntervalRight();
						firedRight = false;
					}
					break;
				case 37:
					if (firedLeft === true) {
						clearIntervalLeft();
						firedLeft = false;
					}
					break;
			}
		});
	}

	function killDirection() {
		controls.css({
			'display': 'none'
		}).addClass('inactive');
	}

	function runDirection() {
		controls.css({
			'display': 'block'
		}).removeClass('inactive');
		hideControlsAtEnd();
	}

	//Show the controls when
	//the mouse moves across the surface
	function controlsMouseMove() {
		function addMove() {
			mainContent.addClass('move');
			setTimeout(function() {
				mainContent.removeClass('move');
			}, 2000);
		}
		container.on('mousemove', $.throttle(2000, addMove));
	}

	//Viewport size logic
	function initResize() {
		var windowWidth = 0;
		$(window).resize(function() {
			checkViewPortSize();
			windowWidth = $(window).width();
		});
		return windowWidth;
	}

	function checkViewPortSize() {
		if (breakPointCheckMax.matches) {
			//kill app
			list.removeAttr('style');
			killDirection();
		} else {
			//re-run app
			setListSize();
			runDirection();
		}
	}

	//App init
	getListSize();
	checkViewPortSize();
	controlsMouseMove();
	assignMouseTouchEvents();
	assignKeyboardEvents();
	directionMouseMove();
	initResize();

	//Only for testing
	//clearAllIntervals();
});
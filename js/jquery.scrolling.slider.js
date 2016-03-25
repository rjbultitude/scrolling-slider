/*
	Scrolling Slider JS - v 1.2 - 03/08/2015
	by Richard Bultitude

	A JavaScript plugin that scrolls a horizonal container
	via left/right controls
	on hover or using the scrollbar

	Depends on JQuery and JQuery Debounce Throttle
	JQuery http://code.jquery.com/jquery-1.11.1.js
	JQuery Throttle Debounce https://github.com/cowboy/jquery-throttle-debounce

	To use with Require.js or CJS applications simply run the file after JQuery has loaded

 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery', 'throttle-debounce'], function($, throttle) {
			return (root.scrollingSlider = factory($, throttle));
		});
	} else if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = (root.scrollingSlider = factory(require('jquery'), require('throttle-debounce')));
	} else {
		// Browser globals (root is window)
		root.ForecastIO = factory(root.jquery, root.throttle);
	}
}(this, function($, throttle) {
/*
 * Begin Scrolling Slider JS
 */

	if (scrollingSlider !== undefined) {
		console.log('An object with this name already exists');
		return false;
	}

	scrollingSlider = {};
	//Interval  vars
	scrollingSlider.scrollerInvervalRight;
	scrollingSlider.scrollerInvervalLeft;
	scrollingSlider.firedRight = false;
	scrollingSlider.firedLeft = false;

	//Elements & position
	scrollingSlider.outerContainer = $('[data-scslider="container"]') || $('.outer-container');
	scrollingSlider.container = $('[data-scslider="slider"]') || $('.slider');
	scrollingSlider.currentScrollPos = scrollingSlider.container.scrollLeft();
	scrollingSlider.controls = $('[data-scslider="control"]') || $('.direction-control');
	scrollingSlider.leftControl = $('[data-scslider-control="left"]') || $('.direction-control-left');
	scrollingSlider.rightControl = $('[data-scslider-control="right"]') || $('.direction-control-right');
	//speed variables
	scrollingSlider.rate = 0;
	scrollingSlider.frameRate = 10;
	scrollingSlider.variableSpeed = true;

	//List items
	scrollingSlider.list = $('[data-scslider="list"]') || $('.slider-list');
	scrollingSlider.totalWidth = 0;

	//break point
	scrollingSlider.breakPoint = 480;
	scrollingSlider.breakPointCheckMax = null || window.matchMedia('all and (max-width: ' + scrollingSlider.breakPoint + 'px)');

	function getListSize() {
		//count modules
		var listItemSizes = [];
		$('li', scrollingSlider.list).each(function() {
			var thisItem = $(this);
			listItemSizes.push(thisItem.outerWidth());
		});
		for (var i = 0; i < listItemSizes.length; i++) {
			scrollingSlider.totalWidth = scrollingSlider.totalWidth + listItemSizes[i];
		};
	}

	function setListSize() {
		scrollingSlider.list.width(scrollingSlider.totalWidth);
	}

	function hideControlsAtEnd() {
		var containerWidth = scrollingSlider.container.width();
		var listWidth = scrollingSlider.totalWidth;
		var scrollArea = listWidth - containerWidth;
		var scrollPos = scrollingSlider.container.scrollLeft();

		if (containerWidth >= listWidth) {
			scrollingSlider.leftControl.fadeOut();
			scrollingSlider.rightControl.fadeOut();
		} else {
			//show/hide right
			if (scrollPos === scrollArea) {
				scrollingSlider.rightControl.fadeOut();
			} else {
				scrollingSlider.rightControl.fadeIn();
			}
			//show/hide left
			if (scrollPos === 0) {
				scrollingSlider.leftControl.fadeOut();
			} else {
				scrollingSlider.leftControl.fadeIn();
			}
		}
	}

	scrollingSlider.container.scroll(function() {
		hideControlsAtEnd();
	});

	//Create invervals for animation
	function setIntervalRight() {
		scrollingSlider.scrollerInvervalRight = setInterval(function() {
			moveItRight();
		}, scrollingSlider.frameRate);
	}

	function setIntervalLeft() {
		scrollingSlider.scrollerInvervalLeft = setInterval(function() {
			moveItLeft();
		}, scrollingSlider.frameRate);
	}

	//Clear intervals at stops
	function clearIntervalRight() {
		clearInterval(scrollingSlider.scrollerInvervalRight);
		scrollingSlider.scrollerInvervalRight = 0;
	}

	function clearIntervalLeft() {
		clearInterval(scrollingSlider.scrollerInvervalLeft);
		scrollingSlider.scrollerInvervalLeft = 0;
	}

	//Interaction functions
	function assignMouseTouchEvents() {
		$('.direction').on('click onLongPress', function(event) {
			event.preventDefault();
		});

		scrollingSlider.rightControl.on('mouseenter touchstart', function(event) {
			event.stopPropagation();
			setIntervalRight();
		});

		scrollingSlider.rightControl.on('mouseleave touchend', function() {
			clearIntervalRight();
		});

		scrollingSlider.leftControl.on('mouseenter touchstart', function(event) {
			event.stopPropagation();
			setIntervalLeft();
		});

		scrollingSlider.leftControl.on('mouseleave touchend', function() {
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
			scrollingSlider.rightControl.off('mouseenter');
			scrollingSlider.leftControl.off('mouseenter');
		}
	}

	function clearAllIntervals() {
		clearIntervalRight();
		clearIntervalLeft();
	}

	function getRate() {
		//set vars
		var _newScrollRate;
		//variable speed check
		if (scrollingSlider.variableSpeed) {
			_newScrollRate = 1 + Math.abs(scrollingSlider.rate);
		}
		else {
			_newScrollRate = 3;
		}
		return _newScrollRate;
	}

	//Set scroll position(s)
	function moveItRight() {
		//set vars
		scrollingSlider.currentScrollPos = scrollingSlider.container.scrollLeft();
		var _newScrollPos = scrollingSlider.currentScrollPos + getRate();
		scrollingSlider.container.scrollLeft(_newScrollPos);
	}

	function moveItLeft() {
		//set vars
		scrollingSlider.currentScrollPos = scrollingSlider.container.scrollLeft();
		var _newScrollPos = scrollingSlider.currentScrollPos - getRate();
		scrollingSlider.container.scrollLeft(_newScrollPos);
	}

	//Change the animation rate based on position of cursor
	function directionMouseMove() {
		scrollingSlider.controls.mousemove(function(e) {
			var $this = $(this);
			var left = $this.is('.direction-control-left');
			var w = $this.width();

			if (left) {
				scrollingSlider.rate = ((w - e.pageX - $(this).offset().left + 1) / w) * 3.5;
			} else {
				scrollingSlider.rate = -((e.pageX - $(this).offset().left + 1) / w) * 3.5;
			}
		});
	}

	

	function killDirection() {
		scrollingSlider.controls.css({
			'display': 'none'
		}).addClass('inactive');
	}

	function runDirection() {
		scrollingSlider.controls.css({
			'display': 'block'
		}).removeClass('inactive');
		//hideControlsAtEnd();
	}

	//Show the controls when
	//the mouse moves across the surface
	function controlsMouseMove() {
		function addMove() {
			scrollingSlider.outerContainer.addClass('move');
			setTimeout(function() {
				scrollingSlider.outerContainer.removeClass('move');
			}, 2000);
		}
		scrollingSlider.container.on('mousemove', $.throttle(2000, addMove));
	}

	//Viewport size logic
	function initResize() {
		var windowWidth = 0;

		function onResize() {
			checkViewPortSize();
			windowWidth = $(window).width();
		}
		var resizeTimer;
		$(window).on('resize', function(){
			resizeTimer && clearTimeout(resizeTimer);
			resizeTimer = setTimeout(onResize, 100);
		});

		return windowWidth;
	}

	function checkViewPortSize() {
		if (scrollingSlider.breakPointCheckMax.matches) {
			//kill app
			scrollingSlider.list.removeAttr('style');
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
	directionMouseMove();
	initResize();
	hideControlsAtEnd();

	
	return scrollingSlider;
}));
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

/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b, c) {
	var $ = b.jQuery || b.Cowboy || (b.Cowboy = {}),
		a;
	$.throttle = a = function(e, f, j, i) {
		var h, d = 0;
		if (typeof f !== "boolean") {
			i = j;
			j = f;
			f = c
		}

		function g() {
			var o = this,
				m = +new Date() - d,
				n = arguments;

			function l() {
				d = +new Date();
				j.apply(o, n)
			}

			function k() {
				h = c
			}
			if (i && !h) {
				l()
			}
			h && clearTimeout(h);
			if (i === c && m > e) {
				l()
			} else {
				if (f !== true) {
					h = setTimeout(i ? k : l, i === c ? e - m : e)
				}
			}
		}
		if ($.guid) {
			g.guid = j.guid = j.guid || $.guid++
		}
		return g
	};
	$.debounce = function(d, e, f) {
		return f === c ? a(d, e, false) : a(d, f, e !== false)
	}
})(this);


/*
 * Begin Scrolling Slider JS
 */
$(document).ready(function() {

	(function(scrollingSlider) {
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
			scrollerInvervalRight = setInterval(function() {
				moveItRight();
			}, scrollingSlider.frameRate);
		}

		function setIntervalLeft() {
			scrollerInvervalLeft = setInterval(function() {
				moveItLeft();
			}, scrollingSlider.frameRate);
		}

		//Clear intervals at stops
		function clearIntervalRight() {
			clearInterval(scrollerInvervalRight);
			scrollingSlider.scrollerInvervalRight = 0;
		}

		function clearIntervalLeft() {
			clearInterval(scrollerInvervalLeft);
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
				_newScrollRate = 1 + Math.abs(rate);
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
		//assignKeyboardEvents();
		directionMouseMove();
		initResize();
		hideControlsAtEnd();

		//Only for testing
		//clearAllIntervals();

		return true;
	})();
});
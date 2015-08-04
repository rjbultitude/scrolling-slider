# Scrolling Slider JS

A JavaScript plugin which slides a horizontal list left/right on hover or via the scrollbar.
Most slider and carousel controls operate using click events, whereas Scrolling Slider uses mouseenter and mouseleave. This produces a smooth motion that works on touch devices without the need for complex fallbacks or enhancements.

##Features

* List items can be any size
* List items can each be different sizes
* Keyboard controls work OOTB
* Left/right Controls are hidden when fully scrolled left/right
* Controls and be any size provided they do not overlap
* Supports two layout modes: standard and mobile
* Controls are hidden if the list contents are smaller then the container
* Variable scroll action speed


## References
[JQuery](https://jquery.com/)
[Debounce Throttle JQuery plugin](https://github.com/cowboy/jquery-throttle-debounce) by Ben Alman

## Documentation
It works in conjunction with native scroll by managing the scroll position dynamically
### Get started
Add the jQuery 1.7+ to your project
Add the jquery.scrolling.slider.js file to your project
Include the styles from scrolling-slider.css. The default styles use a consistent width and height but you can set them to anything you like of the list items as necessary.
You can can also use either classes or data attributes in your HTML as per the example page
The mobile mode for this plugin turns off the horiontal scrollign and stacks the list items vertcially. If you want to turn this feature off set the break point to 0 in your app code like so:
```
scrollingSlider.breakPoint = 0;
```
To turn off the variable speed controls set scrollingSlider.variableSpeed to false like so
```
scrollingSlider.variableSpeed = false;
```
### Module loaders
If using a module loader such as CJS or AMD you can load it in the same way you would any other plugin
Plans are in place to make it fully CJS and AMD compatible

### Browser support
Tested in

* Mac OS Chrome
* Mac OS Firefox
* Mac OS Safari
* Windows Chrome
* Windows Firefox
* IE9
* IE10
* IE11


A JavaScript plugin which moves list items left/right on hover or via the scrollbar.


* Twitter: [@pointbmusic](http://twitter.com/pointbmusic)
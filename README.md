# wiggle v0.0.1

Watch for media query changes and respond to layout changes.

Need to execute JavaScript function when screen size change to match CSS changes inside media query? Something as change position of elements with jQuery when screen size is smaller than 768px.

Did you end up with lot of if-s and complex logic to determine on which screen size are you on. (ifDesktop, ifMobile if if if...).

Did you notice that $(window).width() < 768 does not match media query 768 inside your css code.


Meet small wiggle library to make your life easier and your code cleaner.



```javascript

  var wiggle = Wiggle.init({
    resizeDelay: 50 // Optional defaults to 25
    screens: [{
      minWidth: 992,
      name: 'desktop'
    }, {
      minWidth: 768,
      maxWidth: 991,
      name: 'tablet'
    }, {
      maxWidth: 767,
      name: 'mobile'
    }]
  });

```

To start using wiggle we need to first initialize it by calling init.
Init returns new instance of wiggle and fires resize event listener.
Each instance of wiggle have it's own resize listener. In most cases we would need to create one instance of wiggle.

```javascript

  wiggle.on('mobile', function() {
    console.log("function that will be executed if screen size is mobile and every time screen sizes switches to mobile size");
  });

  wiggle.queueOn('mobile', function() {
    console.log("function that will be executed every time screen sizes switches to mobile size");
  });

  wiggle.off('mobile', function() {
    console.log("function that will be executed if screen size is not mobile and every time screen size stops to be mobile");
  });

  wiggle.queueOff('mobile', function() {
    console.log("function that will be executed every time screen size stops to be mobile");
  });

  wiggle.once('desktop', function() {
    console.log("This function will execute only once if current screen size is desktop or first time it change to desktop.");
  });

  if(wiggle.is('desktop')) {
    console.log("current screen size is desktop");
  }

```

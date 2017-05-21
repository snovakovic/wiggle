# wiggle

Small wrapper around [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
to easily react on changes in page layout.


```javascript
  /**
  * In order to use wiggle we need to initialize it.
  * Init returns new wiggle instance that allow us to subscribe to defined rules
  **/
  var screen = Wiggle.init([{
      name: 'desktop', // Required and unique for instance. It can be any string that is valid JS object name
      minWidth: 992
    }, {
      name: 'tablet',
      minWidth: '768', // Can be number or string. In case of number it defaults to px measurements unit
      maxWidth: '62em' // We can combine different measurements units but it does not mean we should!
    }, {
      name: 'mobile',
      maxWidth: 767
    }]);

  // We are subscribing to names defined during initiation of wiggle.
  screen.on('mobile', function() {
    console.log('Function that will be executed if current screen size is mobile and every time screen size switches to mobile');
  });

  screen.on.change('mobile', function() {
    console.log('Function that will be executed every time screen size switches to mobile.');
  });

  screen.on('desktop', function() {
    console.log('Screen size is desktop');
  });

  screen.off('tablet', function() {
    console.log('function that will be executed if screen size is not tablet and every time screen size stops being tablet');
  });

  screen.off.change('desktop', function() {
    console.log('function that will be executed every time screen size stops being mobile');
  });

  if(screen.is('desktop')) {
    console.log('Current screen size is desktop');
  }

  // We can have multiple instances of wiggle
  var orientation = Wiggle.init([{
    name: 'portrait',
    mediaQuery: '(orientation: portrait)' // Raw media query
  }, {
    name: 'landscape',
    mediaQuery: '(orientation: landscape)'
  }]);

  orientation.on('portrait', function() {
    console.log('function that will be executed if screen is in portrait mode and every time screen switches to portrait mode');
  });

```


### Supported browsers

Wiggle is using [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) to detect layout changes.
matchMedia is not supported in IE9 and below.

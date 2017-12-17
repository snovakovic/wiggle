# wiggle

[![NPM Package](https://nodei.co/npm/wiggle.js.png)](https://www.npmjs.com/package/wiggle.js)

Small wrapper around [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
to easily react on changes in page layout.
Wiggle is breakpoint agnostic, define your own breakpoints and react to them.


```javascript

  /**
  * In order to use wiggle we need to initialize it.
  * Init returns new wiggle instance that allow us to subscribe to defined rules.
  **/
  Wiggle.init([{
    name:String // Need to be unique for the instance. It can be any valid object property name.
    minWidth:String|Number // Any valid media-query value as a string fro maximumWidth. If number wiggle assumes measurement unit is in px.
    minWidth:String|Number
    mediaQuery:String // Raw media query. item can have ether minWidth, maxWidth combination or rawQuery but not both.
  }])

  // Real world example

  var screen = Wiggle.init([{
      // Screen width >= 992px is defined as a desktop.
      name: 'desktop', // The name is arbitrary and can be anything as 'large-screen'
      minWidth: 992
    }, {
      name: 'desktop-menu',
      minWidth: '820px' // same as writing 820 as number default to px unit
    }, {
      // Tablet have overlaps with menu-breakpoint.
      name: 'tablet',
      minWidth: 768,
      maxWidth: 991
    }, {
      name: 'mobile',
      maxWidth: '62em' // Any valid CSS measurement unit can be used
    }]);

  // We are subscribing to names defined during initialization of wiggle.
  screen.on('mobile', function() {
    console.log('Called if screen size is mobile and ever time after screen becomes mobile');
  });

  // Difference between .on and .on.change listener is that .on listener will be triggered
  // immediately when defined if condition is meet while on.change will be triggered only after change happen.
  screen.on.change('mobile', function() {
    console.log('Called every time after screen becomes mobile');
  });

  screen.on('desktop', function() {
    console.log('Called if screen size is desktop and ever time after screen becomes desktop');
  });

  screen.off('tablet', function() {
    console.log('Called if screen size is not tablet and ever time after screen stops being tablet');
  });

  if(screen.is('desktop')) {
    console.log('Current screen size is desktop');
  }

  if(screen.is('tablet') && screen.is('desktop-menu')) {
    console.log('Based on configuration multiple screens can be active at the single time.')
  }

  // Multiple instances of wiggle can be created
  var orientation = Wiggle.init([{
    name: 'portrait',
    mediaQuery: 'orientation: portrait' // Raw media query
  }, {
    name: 'landscape',
    mediaQuery: 'orientation: landscape'
  }]);

  orientation.on('portrait', function() {
    console.log('Called if screen is in portrait mode and every time screen switches to portrait mode');
  });
```


### Supported browsers

Wiggle is using [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) to detect layout changes. matchMedia is not supported in IE9 and below.

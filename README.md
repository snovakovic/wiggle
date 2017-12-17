# wiggle

[![NPM Package](https://nodei.co/npm/wiggle.js.png)](https://www.npmjs.com/package/wiggle.js)

Small wrapper around [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
to easily react on changes in page layout. Define your own layout breakpoints and attach listeners to them.


```javascript

  /**
  * In order to use wiggle we need to initialize it first.
  * Listeners are attached on wiggle instance.
  **/
  Wiggle.init([{
    name:String // Need to be unique per the instance. It can be any string that is valid object property name.
    minWidth:String|Number // If number wiggle assumes measurement unit is in px. If string any valid CSS measurement unit can be defined instead of px (like em).
    minWidth:String|Number
    mediaQuery:String // Raw media query. item can have ether minWidth, maxWidth combination or rawQuery but not both.
  }])

  // Real world example

  var screen = Wiggle.init([{
      // Screen width >= 992px is defined as a desktop.
      name: 'desktop', // The name is arbitrary and can be anything e.g 'large-screen'
      minWidth: 992 // same as writing '992px' because number default to px unit
    }, {
      name: 'desktop-menu',
      minWidth: '820px'
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
    console.log('Called if screen size is mobile and ever time after screen size changes to mobile');
  });

  // Difference between .on and .on.change listener is that .on listener will be triggered
  // immediately when defined if condition is meet while on.change will be triggered only after change happen.
  screen.on.change('mobile', function() {
    console.log('Called every time after screen size changes to mobile');
  });

  screen.off('tablet', function() {
    console.log('Called if screen size is not tablet and ever time after screen size stops being tablet');
  });

  if(screen.is('desktop')) {
    console.log('Current screen size is desktop');
  }

  if(screen.is('tablet') && screen.is('desktop-menu')) {
    console.log('Based on configuration multiple screens can be active.')
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
    console.log('Called if screen is in portrait mode and every time screen changes to portrait mode');
  });


  // Unsubscribe

  // In order to unsubscribe we have to have reference to function used to subscribe to event.
  function landscapeListener() {
    console.log('Listener will be active until we unsubscribe from it');
  }

  orientation.on(landscape, landscapeListener);

  onSomeEvent(function() {
    // Remove landscapeListener subscription.
    orientation.unsubscribe(landscapeListener);
  });
```


### Supported browsers

Wiggle is using [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) to detect layout changes. matchMedia is not supported in IE9 and below.

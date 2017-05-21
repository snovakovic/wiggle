/*****************************************************
	  https://github.com/snovakovic/wiggle
    author: stefan.novakovich@gmail.com
    version: 1.1.1
 ***************************************************/
(function(global, factory) {
  // UMD pattern
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.Wiggle = factory();
  }
}(this, (function() {

  function Instance(screens) {
    var activeScreens = {};
    var subscribers = {};
    var subscribeType = {
      on: 'on',
      off: 'off'
    };

    // Initialize

    Object.keys(subscribeType).forEach(function(key) {
      subscribers[key] = {};
    });

    screens.forEach(function(screen) {
      var mediaQuery = constructMediaQuery(screen);
      var mql = window.matchMedia(mediaQuery);

      screenSwitch(screen, mql);
      mql.addListener(screenSwitch.bind(null, screen));
    });

    // Private methods

    function screenSwitch(screen, mql) {
      mql.matches ? activateScreen(screen) : deactivateScreen(screen);
    }

    function sizeToMediaQuery(size, prop) {
      size = typeof size === 'number' ? size + 'px' : size;
      return size ? '(' + prop + ':' + size + ')' : '';
    }

    function constructMediaQuery(screen) {
      if (screen.mediaQuery) {
        return screen.mediaQuery;
      }

      var minWidth = sizeToMediaQuery(screen.minWidth, 'min-width');
      var maxWidth = sizeToMediaQuery(screen.maxWidth, 'max-width');
      var appender = (minWidth && maxWidth) ? ' and ' : '';

      return minWidth + appender + maxWidth;
    }

    function isScreenActive(name) {
      return Boolean(activeScreens[name]);
    }

    function notifySubscribers(screenName, type) {
      var screenSubscribers = subscribers[type][screenName];
      if (screenSubscribers) {
        screenSubscribers.forEach(function(subscriber) {
          subscriber.execute();
        });
      }
    }

    function activateScreen(screen) {
      if (!activeScreens[screen.name]) {
        activeScreens[screen.name] = screen;
        notifySubscribers(screen.name, subscribeType.on);
      }
    }

    function deactivateScreen(screen) {
      if (activeScreens[screen.name]) {
        delete activeScreens[screen.name];
        notifySubscribers(screen.name, subscribeType.off);
      }
    }

    function subscribe(name, type, cb) {
      subscribers[type][name] = subscribers[type][name] || [];
      subscribers[type][name].push({
        name: name,
        type: type,
        execute: cb
      });
    }

    // Public

    this.on = function(name, cb) {
      if (isScreenActive(name)) { cb(); }
      this.on.change(name, cb);
    };

    this.on.change = function(name, cb) {
      subscribe(name, subscribeType.on, cb);
    };

    this.off = function(name, cb) {
      if (!isScreenActive(name)) { cb(); }
      this.off.change(name, cb);
    };

    this.off.change = function(name, cb) {
      subscribe(name, subscribeType.off, cb);
    };

    this.is = function(name) {
      return Boolean(activeScreens[name]);
    };

    Object.freeze(this);
  }

  return {
    init: function(screens) {
      var readme = 'Check readme file at https://github.com/snovakovic/wiggle for more info about configuring wiggle.';

      if (!screens || !Array.isArray(screens)) {
        throw Error('Wiggle: Missing required screens array configuration. ' + readme);
      }

      screens.forEach(function(screen) {
        if (typeof screen !== 'object' || !screen.name
          || (!(screen.mediaQuery || screen.minWidth || screen.maxWidth))) {
          throw Error('Wiggle: Invalid screens configuration. ' + readme);
        }
      });

      // Instantiate wiggle

      return new Instance(screens);
    }
  }
})));

/*****************************************************
	  https://github.com/snovakovic/wiggle
    author: stefan.novakovich@gmail.com
    version: 0.1.3
 ***************************************************/
(function(global, factory) {
  //UMD pattern
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.Wiggle = factory();
  }
}(this, (function() {

  function Instance(settings) {
    settings.resizeDelay = settings.resizeDelay || 25;
    var screens = Array.isArray(settings.screens) ? settings.screens : [];
    var doit;
    var activeScreens = [];
    var subscribers = {};
    var subscribeType = {
      on: 'on',
      off: 'off'
    };

    // Initialize application

    Object.getOwnPropertyNames(subscribeType).forEach(function(name) {
      subscribers[name] = {};
    });

    window.addEventListener('resize', function() {
      clearTimeout(doit);
      doit = setTimeout(updateActiveScreens, settings.resizeDelay);
    }, true);

    updateActiveScreens();


    // Define private methods

    function updateActiveScreens() {
      screens.forEach(function(screen) {
        isScreenActive(screen)
          ? activateScreen(screen.name)
          : deactivateScreen(screen.name);
      });
    }

    function isScreenActive(screen) {
      if (typeof screen === 'string') {
        screen = getScreen(screen);
      }

      return Boolean(screen && (screen.minWidth || screen.maxWidth) &&
        (!screen.minWidth || matchMedia('min-width', screen.minWidth, screen.measureUnit)) &&
        (!screen.maxWidth || matchMedia('max-width', screen.maxWidth, screen.measureUnit)));
    }

    function activateScreen(name) {
      if (!activeScreens[name]) {
        activeScreens[name] = screen;
        notifySubscribers(name, subscribeType.on);
      }
    }

    function deactivateScreen(name) {
      if (activeScreens[name]) {
        delete activeScreens[name];
        notifySubscribers(name, subscribeType.off);
      }
    }

    function getScreen(name) {
      for (var i = 0; i < screens.length; i++) {
        if (name === screens[i].name) {
          return screens[i];
        }
      }
    }

    function matchMedia(property, width, measureUnit) {
      measureUnit = measureUnit || 'px';
      return width ? window.matchMedia('(' + property + ':' + width + measureUnit + ')').matches : false;
    }

    function notifySubscribers(screenName, type) {
      var screenSubscribers = subscribers[type][screenName];
      if (screenSubscribers && screenSubscribers.length) {
        screenSubscribers.forEach(function(subscriber) {
          subscriber.execute();
        });
      }
    }

    function subscribe(name, type, callback) {
      subscribers[type][name] = subscribers[type][name] || [];
      subscribers[type][name].push({
        name: name,
        type: type,
        execute: callback,
      });
    }


    // Export public methods

    var public = {};

    public.on = function(screenName, callback) {
      if(isScreenActive(screenName)) { callback(); }
      public.queueOn(screenName, callback);
    };

    public.queueOn = function(screenName, callback) {
      subscribe(screenName, subscribeType.on, callback);
    };

    public.off = function(screenName, callback) {
      if(!isScreenActive(screenName)) { callback(); }
      public.queueOff(screenName, callback);
    };

    public.queueOff = function(screenName, callback) {
      subscribe(screenName, subscribeType.off, callback);
    };

    public.is = function(screenName) {
      return Boolean(activeScreens[screenName]);
    };

    public.getActiveScreens = function() {
      return activeScreens;
    }

    return public;
  }

  return {
    init: function(settings) {
      return Instance(settings);
    }
  }

})));

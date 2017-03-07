/*****************************************************
	  https://github.com/snovakovic/wiggle
    author: stefan.novakovich@gmail.com
    version: 0.3.1
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
        (!screen.minWidth || matchMedia('min-width', screen.minWidth)) &&
        (!screen.maxWidth || matchMedia('max-width', screen.maxWidth)));
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

    function matchMedia(property, width) {
      if(typeof width === 'number') { width = width + 'px'; }
      return width ? window.matchMedia('(' + property + ':' + width + ')').matches : false;
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

    this.on = function(screenName, callback) {
      if(isScreenActive(screenName)) { callback(); }
      this.queueOn(screenName, callback);
    };

    this.queueOn = function(screenName, callback) {
      subscribe(screenName, subscribeType.on, callback);
    };

    this.off = function(screenName, callback) {
      if(!isScreenActive(screenName)) { callback(); }
      this.queueOff(screenName, callback);
    };

    this.queueOff = function(screenName, callback) {
      subscribe(screenName, subscribeType.off, callback);
    };

    this.is = function(screenName) {
      return Boolean(activeScreens[screenName]);
    };

    this.getActiveScreens = function() {
      return activeScreens;
    }
  }

  return {
    init: function(settings) {
      return new Instance(settings);
    }
  }
})));

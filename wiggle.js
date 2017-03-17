/*****************************************************
	  https://github.com/snovakovic/wiggle
    author: stefan.novakovich@gmail.com
    version: 0.4.1
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

  function Instance(screens, resizeDelay) {
    var doit;
    var activeScreens = [];
    var subscribers = {};
    var subscribeType = {
      on: 'on',
      off: 'off'
    };

    // Initialize

    Object.getOwnPropertyNames(subscribeType).forEach(function(name) {
      subscribers[name] = {};
    });

    window.addEventListener('resize', function() {
      clearTimeout(doit);
      doit = setTimeout(updateActiveScreens, resizeDelay);
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
      if (typeof width === 'number') { width += 'px'; }
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
        execute: callback
      });
    }

    // Export api

    this.on = function(screenName, callback) {
      if (isScreenActive(screenName)) { callback(); }
      this.queueOn(screenName, callback);
    };

    this.queueOn = function(screenName, callback) {
      subscribe(screenName, subscribeType.on, callback);
    };

    this.off = function(screenName, callback) {
      if (!isScreenActive(screenName)) { callback(); }
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
      const screens = settings ? settings.screens : undefined;

      // Validate screens

      var linkToReadme = 'Check readme file at https://github.com/snovakovic/wiggle for more info about configuring wiggle.';

      if (!screens || !Array.isArray(screens)) {
        throw Error('Wiggle: Missing required screens array configuration. ' + linkToReadme);
      }

      screens.forEach(function(screen) {
        if (typeof screen !== 'object' || !screen.name || (!screen.minWidth && !screen.maxWidth)) {
          throw Error('Wiggle: Invalid screens configuration. ' + linkToReadme);
        }
      });

      // Instantiate wiggle

      return new Instance(screens, settings.resizeDelay || 25);
    }
  }
})));

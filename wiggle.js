/*****************************************************
	  https://github.com/snovakovic/wiggle
    author: stefan.novakovich@gmail.com
    version: 0.0.1
 ***************************************************/
(function(global, factory) {
  //UMD pattern
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define(factory)
  } else {
    global.Wiggle = factory()
  }
}(this, (function() {


  return {
    init: function(settings) {
      settings.resizeDelay = settings.resizeDelay || 25;
      var screens = Array.isArray(settings.screens) ? settings.screens : [];
      var doit;
      var activeScreens = [];
      var subscribeType = {
        on: 'on',
        once: 'once',
        off: 'off'
      }
      var subscribers = {};

      updateActiveScreens();

      // Populate default subscribers
      Object.getOwnPropertyNames(subscribeType).forEach(function(name) {
        subscribers[name] = {};
      });


      window.addEventListener('resize', function() {
        clearTimeout(doit);
        doit = setTimeout(updateActiveScreens, settings.resizeDelay);
      }, true);


      function updateActiveScreens() {
        screens.forEach(function (screen) {
          var active = isScreenActive(screen);

          if (active) {
            if (!activeScreens[screen.name]) {
              activeScreens[screen.name] = screen;
              notifySubscribers(screen.name, subscribeType.on);
            }
          } else if (activeScreens[screen.name]) {
            delete activeScreens[screen.name];
            notifySubscribers(screen.name, subscribeType.off);
          }
        });
      }

      function notifySubscribers(screenName, type) {
        var screenSubscribers = subscribers[type] && subscribers[type][screenName];
        if (screenSubscribers && screenSubscribers.length) {
          screenSubscribers.forEach(function(subscriber) {
            subscriber.execute();
          });
        }
      }

      function isScreenActive(screen) {
        if (typeof screen === 'string') {
          screen = getScreen(screen);
        }

        return Boolean(screen &&
          ((screen.minWidth && window.matchMedia('(min-width: ' + screen.minWidth + 'px)').matches) ||
            (screen.maxWidth && window.matchMedia('(max-width: ' + screen.maxWidth + 'px)').matches)));
      }

      function getScreen(name) {
        for (var i = 0; i < screens.length; i++) {
          if (name === screens[i].name) {
            return screens[i];
          }
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


      var public = {};

      public.on = function(screenName, callback) {
        isScreenActive(screenName) && callback();
        subscribe(screenName, subscribeType.on, callback);
      };

      public.queueOn = function(screenName, callback) {
        subscribe(screenName, subscribeType.on, callback);
      };

      public.once = function(screenName, callback) {
        isScreenActive(screenName) ? callback() :
          subscribe(screenName, subscribeType.once, callback);
      };

      public.off = function(screenName, callback) {
        !isScreenActive(screenName) && callback();
        subscribe(screenName, subscribeType.off, callback);
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
  }
})));

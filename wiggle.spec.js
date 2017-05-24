describe('Wiggle', function() {
  var wiggle;
  var listeners;
  var activeSize;

  // Mock match media
  window.matchMedia = function(query) {
    return {
      get matches() {
        var size;
        if (query.indexOf('992') !== -1) {
          size = 'desktop'
        } else if (query.indexOf('991') !== -1) {
          size = 'tablet'
        } else if (query.indexOf('767') !== -1) {
          size = 'mobile'
        }

        return size === activeSize;
      },
      addListener: function(cb) {
        listeners.push(cb.bind(null, this));
        cb(this);
      }
    }
  };

  // Mock change in screen
  function triggerScreenChange(name) {
    activeSize = name;
    listeners.forEach(function(cb) { cb(); });
  }

  beforeEach(function() {
    listeners = [];
    activeSize = 'desktop';

    wiggle = Wiggle.init([{
      minWidth: 992,
      name: 'desktop'
    }, {
      minWidth: '768px',
      maxWidth: '991px',
      name: 'tablet'
    }, {
      maxWidth: 767,
      name: 'mobile'
    }]);
  });

  it('should be initialized', function() {
    expect(wiggle.on).toEqual(jasmine.any(Function));
    expect(wiggle.on.change).toEqual(jasmine.any(Function));
    expect(wiggle.off).toEqual(jasmine.any(Function));
    expect(wiggle.off.change).toEqual(jasmine.any(Function));
    expect(wiggle.is).toEqual(jasmine.any(Function));

    expect(Object.isFrozen(wiggle)).toEqual(true);
  });

  it('should show correctly witch screen is active', function() {
    expect(wiggle.is('desktop')).toEqual(true);
    expect(wiggle.is('tablet')).toEqual(false);
    expect(wiggle.is('mobile')).toEqual(false);
    expect(wiggle.is('notExisting')).toEqual(false);
  });

  it('should notify listeners on change', function() {
    var onDesktop = 0;
    var offDesktop = 0;
    var onTablet = 0;
    var offTablet = 0;
    var onMobile = 0;
    var offMobile = 0;

    // Initial screen size is on desktop
    wiggle.on('desktop', function() { onDesktop += 1; });
    wiggle.off('desktop', function() { offDesktop += 1; });
    wiggle.on('tablet', function() { onTablet += 1; });
    wiggle.off('tablet', function() { offTablet += 1; });
    wiggle.on('mobile', function() { onMobile += 1; });
    wiggle.off('mobile', function() { offMobile += 1; });

    expect(onDesktop).toEqual(1);
    expect(offDesktop).toEqual(0);
    expect(onTablet).toEqual(0);
    expect(offTablet).toEqual(1);
    expect(onMobile).toEqual(0);
    expect(offMobile).toEqual(1);

    // Execute mobile listeners
    triggerScreenChange('mobile');

    expect(onDesktop).toEqual(1);
    expect(offDesktop).toEqual(1);
    expect(onTablet).toEqual(0);
    expect(offTablet).toEqual(1);
    expect(onMobile).toEqual(1);
    expect(offMobile).toEqual(1);
  });

  it('on.change/off.change Listeners should be executed on resize', function() {
    var onDesktop = 0;
    var offDesktop = 0;

    // Initial screen size is on desktop
    wiggle.on.change('desktop', function() {
      onDesktop += 1;
    });
    wiggle.off.change('desktop', function() {
      offDesktop += 1;
    });

    // Queue should not be triggered on first screen size
    expect(onDesktop).toEqual(0);
    expect(offDesktop).toEqual(0);


    triggerScreenChange('mobile');
    expect(onDesktop).toEqual(0);
    expect(offDesktop).toEqual(1);

    triggerScreenChange('desktop');
    expect(onDesktop).toEqual(1);
    expect(offDesktop).toEqual(1);
  });
});

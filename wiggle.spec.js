describe('Wiggle', () => {
  let wiggle;
  let listeners;
  let activeSize;
  let activeOrientation;
  let counter;

  // Mock match media
  window.matchMedia = function(query) {
    return {
      get matches() {
        const screen = [
          { def: '992', value: 'desktop'},
          { def: '991', value: 'tablet'},
          { def: '767', value: 'mobile'},
          { def: 'portrait', value: 'portrait'},
          { def: 'landscape', value: 'landscape'},
        ].find((q) => query.includes(q.def)).value;

        return screen === activeSize || screen === activeOrientation;
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
    listeners.forEach((cb) => cb());
  }

  beforeEach(() => {
    listeners = [];
    activeSize = 'desktop';
    activeOrientation = 'landscape';

    counter = {
      onDesktop: 0,
      offDesktop: 0,
      onTablet: 0,
      offTablet: 0,
      onMobile: 0,
      offMobile: 0,
      onPortrait: 0,
      onLandscape: 0
    }

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

  it('should be initialized', () => {
    expect(wiggle.on).toEqual(jasmine.any(Function));
    expect(wiggle.on.change).toEqual(jasmine.any(Function));
    expect(wiggle.off).toEqual(jasmine.any(Function));
    expect(wiggle.off.change).toEqual(jasmine.any(Function));
    expect(wiggle.is).toEqual(jasmine.any(Function));

    expect(Object.isFrozen(wiggle)).toEqual(true);
  });

  it('should show correctly witch screen is active', () => {
    expect(wiggle.is('desktop')).toEqual(true);
    expect(wiggle.is('tablet')).toEqual(false);
    expect(wiggle.is('mobile')).toEqual(false);
    expect(wiggle.is('notExisting')).toEqual(false);
  });

  it('should notify listeners on change', () => {
    // Initial screen size is on desktop
    wiggle.on('desktop', () => counter.onDesktop += 1);
    wiggle.off('desktop', () => counter.offDesktop += 1);
    wiggle.on('tablet', () => counter.onTablet += 1);
    wiggle.off('tablet', () => counter.offTablet += 1);
    wiggle.on('mobile', () => counter.onMobile += 1);
    wiggle.off('mobile', () => counter.offMobile += 1);

    expect(counter.onDesktop).toEqual(1);
    expect(counter.offDesktop).toEqual(0);
    expect(counter.onTablet).toEqual(0);
    expect(counter.offTablet).toEqual(1);
    expect(counter.onMobile).toEqual(0);
    expect(counter.offMobile).toEqual(1);

    // Execute mobile listeners
    triggerScreenChange('mobile');

    expect(counter.onDesktop).toEqual(1);
    expect(counter.offDesktop).toEqual(1);
    expect(counter.onTablet).toEqual(0);
    expect(counter.offTablet).toEqual(1);
    expect(counter.onMobile).toEqual(1);
    expect(counter.offMobile).toEqual(1);
  });

  it('on.change/off.change Listeners should be executed on resize', () => {
    // Initial screen size is on desktop
    wiggle.on.change('desktop', () => counter.onDesktop += 1);
    wiggle.off.change('desktop', () => counter.offDesktop += 1);

    // Queue should not be triggered on first screen size
    expect(counter.onDesktop).toEqual(0);
    expect(counter.offDesktop).toEqual(0);

    triggerScreenChange('mobile');

    expect(counter.onDesktop).toEqual(0);
    expect(counter.offDesktop).toEqual(1);

    triggerScreenChange('desktop');
    expect(counter.onDesktop).toEqual(1);
    expect(counter.offDesktop).toEqual(1);
  });

  it('multiple instances of wiggle should run in parallel', () => {
    const orientation = Wiggle.init([{
      name: 'portrait',
      mediaQuery: '(orientation: portrait)'
    }, {
      name: 'landscape',
      mediaQuery: '(orientation: landscape)'
    }]);

    wiggle.on('mobile', () => counter.onMobile += 1);
    orientation.on('portrait', () => counter.onPortrait += 1);
    orientation.on('landscape', () => counter.onLandscape += 1);

    expect(wiggle.is('desktop')).toEqual(true);
    expect(orientation.is('landscape')).toEqual(true);
    expect(orientation.is('portrait')).toEqual(false);
    expect(orientation.is('desktop')).toEqual(false);

    expect(counter.onLandscape).toEqual(1); // default orientation
    expect(counter.onPortrait).toEqual(0);
    expect(counter.onMobile).toEqual(0);

    triggerScreenChange('mobile');

    expect(counter.onLandscape).toEqual(1);
    expect(counter.onPortrait).toEqual(0);
    expect(counter.onMobile).toEqual(1);
  });
});

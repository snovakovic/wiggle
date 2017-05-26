describe('Wiggle', () => {
  let wiggle;
  let listeners;
  let activeSize;

  // Mock match media
  window.matchMedia = function(query) {
    return {
      get matches() {
        let size;
        if (query.includes('992')) {
          size = 'desktop'
        } else if (query.includes('991')) {
          size = 'tablet'
        } else if (query.includes('767')) {
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
    listeners.forEach((cb) => cb());
  }

  beforeEach(() => {
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
    let onDesktop = 0;
    let offDesktop = 0;
    let onTablet = 0;
    let offTablet = 0;
    let onMobile = 0;
    let offMobile = 0;

    // Initial screen size is on desktop
    wiggle.on('desktop', () => onDesktop += 1);
    wiggle.off('desktop', () => offDesktop += 1);
    wiggle.on('tablet', () => onTablet += 1);
    wiggle.off('tablet', () => offTablet += 1);
    wiggle.on('mobile', () => onMobile += 1);
    wiggle.off('mobile', () => offMobile += 1);

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

  it('on.change/off.change Listeners should be executed on resize', () => {
    let onDesktop = 0;
    let offDesktop = 0;

    // Initial screen size is on desktop
    wiggle.on.change('desktop', () => onDesktop += 1);
    wiggle.off.change('desktop', () => offDesktop += 1);

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

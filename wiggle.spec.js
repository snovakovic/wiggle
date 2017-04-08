describe('Wiggle', function() {
  var wiggle;

  function mockActiveScreen(size) {
    window.matchMedia = function(query) {
      return {
        matches: query.indexOf(size) !== -1
      }
    };
  }

  beforeEach(function() {
    mockActiveScreen('992');

    wiggle = Wiggle.init([{
      minWidth: 992,
      name: 'desktop'
    }, {
      minWidth: 768,
      maxWidth: 991,
      name: 'tablet'
    }, {
      maxWidth: 767,
      name: 'mobile'
    }]);
  });

  it('Wiggle should be initialized', function() {
    expect(wiggle.on).toEqual(jasmine.any(Function));
    expect(wiggle.queueOn).toEqual(jasmine.any(Function));
    expect(wiggle.off).toEqual(jasmine.any(Function));
    expect(wiggle.queueOff).toEqual(jasmine.any(Function));
    expect(wiggle.is).toEqual(jasmine.any(Function));
    expect(wiggle.getActiveScreens).toEqual(jasmine.any(Function));
  });

  it('Wiggle should notify subscribers', function(done) {
    wiggle.on('desktop', done);
    wiggle.on('tablet', function() { throw Error('Tablet listener should not be called'); });
    wiggle.on('mobile', function() { throw Error('Tablet listener should not be called'); });

    expect(wiggle.is('desktop')).toEqual(true);
    expect(wiggle.is('tablet')).toEqual(false);
    expect(wiggle.is('mobile')).toEqual(false);
    expect(wiggle.is('notExisting')).toEqual(false);
  });

  it('wiggle property should be immutable', function() {
    wiggle.is = 'changed is';
    wiggle.on = 'changed on';

    expect(wiggle.is).toEqual(jasmine.any(Function));
    expect(wiggle.on).toEqual(jasmine.any(Function));
  });

  it('On/Off listeners should be executed on resize', function(done) {
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

    // Set mobile to be active screen and activate resize event
    mockActiveScreen('767');
    window.dispatchEvent(new Event('resize'));

    setTimeout(function() {
      expect(onDesktop).toEqual(1);
      expect(offDesktop).toEqual(1);
      expect(onTablet).toEqual(0);
      expect(offTablet).toEqual(1);
      expect(onMobile).toEqual(1);
      expect(offMobile).toEqual(1);

      done();
    }, 50);
  });

  it('queueOn/queueOff Listeners should be executed on resize', function(done) {
    var onDesktop = 0;
    var offDesktop = 0;

    // Initial screen size is on desktop
    wiggle.queueOn('desktop', function() { onDesktop += 1; });
    wiggle.queueOff('desktop', function() { offDesktop += 1; });

    // Queue should not be triggered on first screen size
    expect(onDesktop).toEqual(0);
    expect(offDesktop).toEqual(0);

    // Set mobile to be active screen and activate resize event
    mockActiveScreen('767');
    window.dispatchEvent(new Event('resize'));

    setTimeout(function() {
      expect(onDesktop).toEqual(0);
      expect(offDesktop).toEqual(1);
      // Set desktop to be active screen and activate resize event
      mockActiveScreen('992');
      window.dispatchEvent(new Event('resize'));

      setTimeout(function() {
        expect(onDesktop).toEqual(1);
        expect(offDesktop).toEqual(1);

        // No changes no listeners should be trigered
        window.dispatchEvent(new Event('resize'));

        setTimeout(function() {
          expect(onDesktop).toEqual(1);
          expect(offDesktop).toEqual(1);
          done();
        }, 50);
      }, 50);
    }, 50);
  });
});

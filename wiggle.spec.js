describe('Wiggle', function() {
  var wiggle;

  beforeEach(function() {
    // Mock matchMedia to return true if desktop
    window.matchMedia = function(query) {
      return {
        matches: query.indexOf('992') !== -1
      }
    };

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

});

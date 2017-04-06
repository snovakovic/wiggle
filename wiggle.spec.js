describe('Wiggle', function() {
  it('Wiggle should be initialized', function() {
    var wiggle = Wiggle.init({
      resizeDelay: 50, // Optional defaults to 25
      screens: [{
        minWidth: 992,
        name: 'desktop'
      }, {
        minWidth: 768,
        maxWidth: 991,
        name: 'tablet'
      }, {
        maxWidth: 767,
        name: 'mobile'
      }]
    });

    expect(wiggle.on).toEqual(jasmine.any(Function));
    expect(wiggle.queueOn).toEqual(jasmine.any(Function));
    expect(wiggle.off).toEqual(jasmine.any(Function));
    expect(wiggle.queueOff).toEqual(jasmine.any(Function));
    expect(wiggle.is).toEqual(jasmine.any(Function));
    expect(wiggle.getActiveScreens).toEqual(jasmine.any(Function));
  });

  it('Wiggle should notify subscribers', function () {

  });

});

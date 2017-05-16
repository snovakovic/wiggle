# wiggle

Small responsive subscriber to react to match media changes.

Hmmm what?

In short if you have responsive page and you want to execute JS code for any reason when page changes layout from desktop to tablet or mobile, or you want to execute code only on desktop or... You get my point. Meet wiggle you might like it.

Library was born when I had to use jQuery to swap position of multiple elements based on if screen size matches desktop, tablet or mobile design. After ugly code with lot of if-s to detect when browser is in desktop, tablet or mobile view the library has been born.


```javascript
  /**
  * Before using library we need to initialize it by calling init and passing our application screen definitions.
  * Init returns new wiggle instance that allow us to listen for defined screens definitions
  * In order for application to behave smoothly screens definitions should match application CSS breakpoints.
  * We can have multiple instances of wiggle with different screen definitions. In 99% only one instance is required and desired.
  **/
  var wiggle = Wiggle.init([{
      minWidth: 992, // Default unit is px. Same as writing '992px'
      name: 'desktop' // Unique name based on which we can create subscriptions. Name can be any string that is valid JS object property name and it have to be unique for each screen.
    }, {
      minWidth: '768',
      maxWidth: '62em', // We can combine different measurements units but it does not mean we should!
      name: 'tablet'
    }, {
      maxWidth: 767,
      name: 'mobile'
    }]);

  /**
  * Add subscriber for 'mobile' screen.
  * It will execute if current screen size is mobile and every time we switch from some other screens size to mobile.
  * Instead of mobile we can subscribe to any other defined screen size like 'desktop' or 'tablet'
  **/
  wiggle.on('mobile', function() {
    console.log("Function that will be executed if current screen size is mobile and every time screen sizes switches to mobile");
  });

  wiggle.on('mobile', function() {
    console.log("We can have multiple listeners for same screen size and each will be executed.");
  });

  /**
  * queueOn behaves same as on with difference that it won't execute when declared only when screen size changes from some other screen size to defined screen size.
  * in 99% casess on listener is right one to use.
  **/
  wiggle.queueOn('mobile', function() {
    console.log("function that will be executed every time screen sizes switches to mobile size");
  });

  wiggle.off('mobile', function() {
    console.log("function that will be executed if screen size is not mobile and every time screen size stops being mobile");
  });

  wiggle.queueOff('mobile', function() {
    console.log("function that will be executed every time screen size stops being mobile");
  });

  if(wiggle.is('desktop')) {
    console.log("Current screen size is desktop");
  }

  // Based on our screen definition we can have multiple screens active at the same time
  wiggle.is('desktop');
  wiggle.is('custom-size'); // Based on screen definition both could be true.

  /*
   * In previous versions of wiggle there was .once function that would execute only once when we match screen size.
   * It was removed as we can easily achieve same behavior with even more flexibility by using lodash once or similar solutions.
   */
  wiggle.on('tablet', _.once(function() {
    console.log("This will be executed only once for screen size tablet");
  }));
```

### Examples of usage in Vue js

For example we will use Vue js and Vuex store plugin but similar approach can be taken with React and Redux. Or Angular.

Basic premises is that we will have components that will need to be displayed only on desktop.
We can easily hide them with media-queries and display none. Problem with hiding them like that is that components will still render and components code will still be executed which is far from ideal.

With wiggle and v-if directive we can easily optimize that by not rendering components that is not used.

```javascript
// Update view.type reactive Vuex store state with wiggle
wiggle.on('desktop', () => store.dispatch('changeViewType', View.type.DESKTOP));
wiggle.on('tablet', () => store.dispatch('changeViewType', View.type.TABLET));
wiggle.on('mobile', () => store.dispatch('changeViewType', View.type.MOBILE));

// Now in our vue component we can have computed property as this
computed: {
  isDesktop() {
    return this.$store.state.App.view.type === View.type.DESKTOP;
  }
}
```

The above code allow us to do something like


```html
<widgets-sidebar v-if="isDesktop"><widgets-sidebar>
```


### Supported browsers

Wiggle use [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) to detect layout changes.
If you need to support browser that does not support matchMedia (IE9 and below) you need to include [matchMedia polyfill](https://github.com/paulirish/matchMedia.js) before using this library.


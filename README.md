# wiggle

Subscribe and react to page breakpoints.
Ideal for responsive pages as it allows us to easily react with JS on page layout changes.

### Examples of usage

- We might need to swipe position of 2 elements with js (jQuery) when page layout changes from desktop to layout and vice versa
- We want to optimize code to include only components (html) that are used on current screen layout. (check Examples of usage in Vue js at the bottom for more info)
- We might want to optimize page to load additional resources only if layout is desktop.
- In any other case when we want to execute custom JS code on specific page layout.


```javascript
  /**
  * Before using library we need to initialize it with desired breakpoint.
  * Init returns new wiggle instance that allow us to listen for defined screens definitions
  * Even thought we can have multiple instances of wiggle in 99% we should have only one instance.
  **/
  var wiggle = Wiggle.init([{
      minWidth: 992, // Default unit is px. Same as writing '992px'
      name: 'desktop' // Name can be any string that is valid JS object property name and it have to be unique for each screen.
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
  * Subscriber will execute if current screen size is mobile and every time we switch from some other screens size to mobile.
  * Instead of mobile we can subscribe to any other defined screen size like 'desktop' or 'tablet'
  * Mobile screen size is defined during initialization of wiggle
  **/
  wiggle.on('mobile', function() {
    console.log("Function that will be executed if current screen size is mobile and every time screen sizes switches to mobile");
  });

  wiggle.on('mobile', function() {
    console.log("We can have multiple listeners for same screen size and each will be executed.");
  });

  wiggle.on('desktop', function() {
    console.log("Function that will be executed if current screen size is mobile and every time screen sizes switches to mobile.");
  });

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
```

### Examples of usage in Vue js

For example we will use Vue js and Vuex store plugin but similar approach can be taken with React and Redux. Or Angular.

Basic premises is that we will have components that will need to be displayed only on desktop.
We can easily hide them with media-queries and display none. Problem with hiding them like that is that components will
still render and components code will still be executed which is far from ideal.

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


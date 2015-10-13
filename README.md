# Leaflet.VisualClick
A plugin that adds visual feedback when user clicks/taps the map. Useful for when you have a delay on the clickEvents for async fetching of data, or implmentation of Leaflet.singleclick


### Install
- `npm install` - This will download dependencies, and run a build upon completion

### Run the demo
- Open up the `demo/demo.html` file in a browser and watch the magic!



### Copy files
After install, files should be generated in the `dist` folder
Copy these files and include them as you normally would

### That's it
- it should work now :)


----


### Configurations
There are some options you can configure if you really need to.
Here's an example:

```
    map = L.map('map',{
      //visualClick: false, //can be disabled
      //visualClickMode: 'touch', //A default detection is done, but you can override...
      visualClickEvents: 'click contextmenu' //can be multiple space-seperated events, like 'click', 'contextmenu', 'dblclick'...
    });
```

### Developing?
- run `npm start` - this should fire the build process and also start a watcher that re-compiles if you change the source files


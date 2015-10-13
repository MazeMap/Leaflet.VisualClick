/*
 * L.VisualClick v2.0
 * Description: A plugin that adds visual feedback when user clicks/taps the map. Useful for when you have a delay on the clickEvents for async fetching of data, or implmentation of Leaflet.singleclick
 * Example: L.visualClick({map: leafletMap}); //Just works
 * Author: Dag Jomar Mersland (twitter: @dagjomar)
 */


var iconPulsing = L.divIcon({
    className: "leaflet-visualclick",    // See L.VisualClick.css
    iconSize: [34, 34],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
    labelAnchor: [11, -3],
    clickable: false,
    html: '<i class="'+ (L.Browser.touch ? 'touchpulse' : 'pulse') +'"></i>'
});

L.Map.VisualClick = L.Handler.extend({

    _visualIcon: iconPulsing,

    _eventName: 'click',

    _onClick: function(e) {

        var map = this._map;

        var latlng = e.latlng;
        var marker = L.marker(latlng, {pane: 'shadowPane', icon: iconPulsing, interactive: false}).addTo(map);

        window.setTimeout(function(){
            if(map){
                marker.removeFrom(map);
            }
        }.bind(this), map.options.visualClick.removeTimeout || 450);    // Should somewhat match the css animation to prevent loops

        return true;
    },

    addHooks: function () {
        this._map.on('click contextmenu', this._onClick, this);
    },

    removeHooks: function () {
        this._map.off('click contextmenu', this._onClick, this);
    },

});


L.Map.mergeOptions({
    visualClick: L.Browser.any3d ? {  // true by default for browsers with CSS transforms{
        removeTimeout: 600
    } : null
});

L.Map.addInitHook('addHandler', 'visualClick', L.Map.VisualClick);


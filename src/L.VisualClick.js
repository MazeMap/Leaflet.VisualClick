/*
 * L.VisualClick
 * Description: A plugin that adds visual feedback when user clicks/taps the map. Useful for when you have a delay on the clickEvents for async fetching of data, or implmentation of Leaflet.singleclick
 * Example: L.visualClick({map: leafletMap}); //Just works
 * Author: Dag Jomar Mersland (twitter: @dagjomar)
 */


L.Map.VisualClick = L.Handler.extend({

    _makeVisualIcon: function(){

        var touchMode = this._map.options.visualClickMode === 'touch' ? true : false;

        return L.divIcon({
            className: "leaflet-visualclick",    // See L.VisualClick.css
            iconSize: [34, 34],
            iconAnchor: [18, 18],
            popupAnchor: [0, -20],
            labelAnchor: [11, -3],
            clickable: false,
            html: '<i class="'+ (touchMode ? 'touchpulse' : 'pulse') +'"></i>'
        });

    },

    _visualIcon: null,

    _onClick: function(e) {

        var map = this._map;

        var latlng = e.latlng;
        var marker = L.marker(latlng, {pane: 'shadowPane', icon: this._visualIcon, interactive: false}).addTo(map);

        window.setTimeout(function(){
            if(map){
                marker.removeFrom(map);
            }
        }.bind(this), map.options.visualClick.removeTimeout || 450);    // Should somewhat match the css animation to prevent loops

        return true;
    },

    addHooks: function () {
        if(this._visualIcon === null){
            this._visualIcon = this._makeVisualIcon();
        }
        this._map.on(this._map.options.visualClickEvents, this._onClick, this);
    },

    removeHooks: function () {
        this._map.off(this._map.options.visualClickEvents, this._onClick, this);
    },

});


L.Map.mergeOptions({
    visualClick: L.Browser.any3d ? true : false, //Can be true, desktop, touch, false. Not straight forward to use L.Browser.touch flag because true on IE10
    visualClickMode: L.Browser.touch && L.Browser.mobile ? 'touch' : 'desktop', //Not straight forward to use only L.Browser.touch flag because true on IE10 - so this is slightly better
    visualClickEvents: 'click contextmenu', //Standard leaflety way of defining which events to hook on to
});

L.Map.addInitHook('addHandler', 'visualClick', L.Map.VisualClick);

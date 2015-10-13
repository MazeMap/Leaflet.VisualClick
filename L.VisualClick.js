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

L.visualClick = function (options) {
    return new L.VisualClick(options);
};


L.Map.VisualClick = L.Handler.extend({

    _pulse: iconPulsing,

    _eventName: 'click',

    _onClick: function(e) {

        var map = this._map;

        var latlng = e.latlng;
        var marker = L.marker(latlng, {pane: 'shadowPane', icon: iconPulsing, interactive: false}).addTo(map);

        //Check for need transition support
        if(map.options.visualClick.supportsTransitions === false){
            $(marker._icon).addClass('ielt9').find('i.pulse').css({'width': 30, 'height': 30, 'margin' : '0px 0 0 0px', 'border': '1px solid #62c6e7', 'opacity': 1})
            .animate({width: 60, height: 60, 'margin': '-12px 0 0 -12px', opacity: 0}, 450, 'linear');
        }
        window.setTimeout(function(){
            if(map){
                marker.removeFrom(map);
            }
        }.bind(this), map.options.visualClick.removeTimeout);    // CSS animation is 450 msec long

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
    visualClick: {
        supportsTransitions: true,
        removeTimeout: 690
    }
});

L.Map.addInitHook('addHandler', 'visualClick', L.Map.VisualClick);


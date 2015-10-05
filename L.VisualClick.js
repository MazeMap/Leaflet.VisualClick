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


L.VisualClick = L.Class.extend({
    options: {
        events: 'click contextmenu', //Using ordinary Leaflet syntax for space-seperated event names
        map: null,
        disabled: false, //This flag can be set to disable any VisualClicks indefinately until this flag is set to true
        supportsTransitions: null, //Will be checked upon initialize unless explicitly set
        removeTimeout: 690 //Default, but can be changed if the icon pulse animation timing is changed
    },

    /* http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr */
    _supportsTransitions: function(){
        var b = document.body || document.documentElement,
            s = b.style,
            p = 'transition';

        if (typeof s[p] === 'string') { return true; }

        // Tests for vendor specific prop
        var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
        p = p.charAt(0).toUpperCase() + p.substr(1);

        for (var i=0; i<v.length; i++) {
            if (typeof s[v[i] + p] === 'string') { return true; }
        }

        return false;
    },

    initialize: function (options) {
        this.options = L.setOptions(this, options);

        if(this.options.supportsTransitions === null){
            this.options.supportsTransitions = this._supportsTransitions();
        }

        if(this.options.map){
            this.options.map.visualClick = this; //Store a reference to the visualClick object in the given map
            this._setUpHandlers(this.options.map);
        }
    },

    _setUpHandlers : function(map){
        if(this.options.events.length > 0){
            map.on(this.options.events, this._handleClick, this);
        }
    },

    _removeHandlers : function(map){
        map.off('click', this._handleClick);
        map.off('contextmenu', this._handleClick);
    },

    _handleClick : function(e){

        if(this.options.disabled){
            return;
        }else if(this.options.ignoreNextClick){
            this.options.ignoreNextClick = false; //reset
            return;
        }else if(e.noVisualClick){ //Can also check to see if the click event itself has a flag to disable visualClicks
            return;
        }

        var latlng = e.latlng;
        var marker = L.marker(latlng, {pane: 'shadowPane', icon: iconPulsing, interactive: false}).addTo(this.options.map);

        //Check for need transition support
        if(this.options.supportsTransitions === false){
            $(marker._icon).addClass('ielt9').find('i.pulse').css({'width': 30, 'height': 30, 'margin' : '0px 0 0 0px', 'border': '1px solid #62c6e7', 'opacity': 1})
            .animate({width: 60, height: 60, 'margin': '-12px 0 0 -12px', opacity: 0}, 450, 'linear');
        }
        window.setTimeout(function(){
            if(this.options.map){
                marker.removeFrom(this.options.map);
            }
        }.bind(this), this.options.removeTimeout);    // CSS animation is 450 msec long

    }

});

L.visualClick = function (options) {
    return new L.VisualClick(options);
};


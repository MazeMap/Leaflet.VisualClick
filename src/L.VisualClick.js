
// Creates a "click pulse" every time the user clicks/points/taps the map.
// Heavily based on https://github.com/mapshakers/leaflet-icon-pulse


L.Map.VisualClick = L.Handler.extend({

	_pulse: L.divIcon({
		className: 'leaflet-pulsing-icon',
		iconSize: [0, 0]
	}),

	_eventName: L.Browser.touch ? 'touchstart' : 'mousedown',

	_removePulse: function(marker) {
		return function() {
			marker.remove();
		};
	},

	_onMouseDown: function(ev) {
		var point;

		if (ev.detail > 1) {
			// This is a dblclick instead
			// Apparently listening to a 'mousedown' event cancels 'dblclick'
			// events, so dispatch one manually.
			var newEv = new MouseEvent('dblclick', ev);
			this._container.dispatchEvent(newEv);
			return true;
		}

		// Note that the code uses clientX and clientY, which are relative to
		// the whole browser screen, and not to the map container. This code
		// will only work as long as the map covers the whole browser window.
		if (ev.hasOwnProperty('changedTouches')) {  // TouchEvent
			var touch = ev.changedTouches[0];
			point = [touch.clientX, touch.clientY];
		} else {    // MouseEvent
			point = [ev.clientX, ev.clientY];
		}

		var latlng = map.containerPointToLatLng(point);
		var marker = L.marker(latlng, {icon: this._pulse, interactive: false}).addTo(map);

		var removeFn = this._removePulse(marker);

		// CSS animation is 700 msec long
		window.setTimeout(L.bind(function(){
			removeFn();
			map.off('dblclick touchmove dragstart boxzoomstart', removeFn ,this);
		}, this), 750);

		// Cancel the pulse if double click or user starts dragging
		map.on('dblclick touchmove dragstart boxzoomstart', removeFn, this);
		return true;
	},

	addHooks: function() {
		this._container = this._map.getContainer();
		L.DomEvent.on(this._container, this._eventName, this._onMouseDown, this);
	},

	removeHooks: function() {
		L.DomEvent.off(this._container, this._eventName, this._onMouseDown, this);
	}

});



L.Map.mergeOptions({
	// Skip browsers which don't support CSS animations (IE8, IE9)
	visualClick: L.Browser.any3d
});


L.Map.addInitHook('addHandler', 'visualClick', L.Map.VisualClick);



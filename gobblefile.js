// gobblefile.js
var gobble = require('gobble');

var prefixed = gobble('src').transform('autoprefixer', {

	browsers: [
		"Android 2.3",
		"Android >= 4",
		"Chrome >= 20",
		"Firefox >= 24",
		"Explorer >= 9",
		"iOS >= 6",
		"Opera >= 12",
		"Safari >= 6"
	]
});

module.exports = gobble([
	prefixed,
	prefixed.transform('zip', {dest: 'L.VisualClick.zip'})
]);



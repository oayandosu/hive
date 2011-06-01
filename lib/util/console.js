var hive = require('../hive');
var exports = module.exports = {
	log: function() {
		if(hive.debug) {
			console.log.apply(this, arguments);
		}
	}
};
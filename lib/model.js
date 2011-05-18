//hive.Model
var backbone = require('backbone');

var exports = module.exports = backbone.Model;

exports.prototype.watch = function(model) {
	var _self = this;
	model.bind('all', function(eventName) {
		_self.trigger('saw:' + eventName);
	});
}



//hive.Model
var backbone = require('backbone');

var exports = module.exports = backbone.Model.extend({
	watch: function(model) {
		var _self = this;
		model.bind('all', function(eventName) {
			_self.trigger('saw:' + eventName);
		});
	},
	success: function(attributes, isSilent) {
		this.set(attributes, {silent:!!isSilent});
		this.trigger('success');
	},
	error: function(e) {
		this.errors = [e];
		this.trigger('error');
	}
});


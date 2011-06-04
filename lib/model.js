var backbone = require('backbone'),
	hive = require('./hive');


var exports = module.exports = backbone.Model.extend({
	watch: function(model) {
		var _self = this;
		model.bind('all', function(eventName) {
			_self.trigger('saw:' + eventName);
			if(_self.saw && _self.saw[eventName]) {
				 _self.saw[eventName]();
			}
		});
		return _self;
	},
	notify: function(model) {
		model.watch(this);
		return this;
	},
	success: function(attributes, isSilent) {
		this.syncing = false;
		if(attributes) {
			this.set(attributes, {silent:!!isSilent});
		}
		this.trigger('success');
		this.trigger('ready');
	},
	error: function(e, context) {
		this.syncing = false;
		hive.log('**ERROR**', (e && e.message) || e, '@ ' + this.get('path') || ' a hive model');
		hive.log(new Error().stack);
		this.errors = [e];
		this.trigger('error');
		this.trigger('ready');
	},
	once: function(event, callback) {
		var _self = this;
		_self.bind(event, function() {
			_self.unbind(event, callback);
			callback.apply(_self, callback.arguments);
		});
		return _self;
	},
	ready: function(callback) {
		if(this.syncing) {
			this.once('ready', callback);
		} else {
			callback();
		}
		return _self;
	}
});


var backbone = require('backbone'),
	hive = require('./hive'),
	EventEmitter = require('events').EventEmitter;

var exports = module.exports = backbone.Model.extend({
	watch: function(model) {
		var _self = this;
		if(model instanceof EventEmitter) {
			hive.log('watching', model);
			// rewrite emit to trigger saw methods
			// var _emit = model.emit;
			// 			
			// 			model.emit = function(event) {
			// 				hive.log('saw', event);
			// 				_emit.apply(this, arguments);
			// 				_self.trigger('saw:' + event);
			// 				if(_self.saw && _self.saw[event]) {
			// 					_self.saw[event].apply(this, arguments);
			// 				}
			// 			}
			
			if(_self.saw) {
				for(var fn in _self.saw) {
					model.on(fn, function() {
						_self.saw[fn].apply(_self, arguments);
					});
				}
			}
			
		} else {
			model.bind('all', function(eventName) {
				_self.trigger('saw:' + eventName);
				if(_self.saw && _self.saw[eventName]) {
					 _self.saw[eventName]();
				}
			});
		}
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
		var _self = this;
		if(_self.syncing) {
			_self.once('ready', function() {
				callback.apply(_self, arguments);
			});
		} else {	
			callback.apply(_self, arguments);
		}
		return _self;
	}
});


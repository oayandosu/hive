var backbone = require('backbone'),
	hive = require('./hive'),
	EventEmitter = require('events').EventEmitter;

var exports = module.exports = backbone.Model.extend({
	
	assert: {
		topic: null,
		add: function() {
			var errs = this._self.errors || (this._self.errors = []);
			errs.push(this.topic);
		},
		exists: function(object) {
			if(!object || object === '')
			{
				this.add();
			}
		},
		true: function (boolean) {	
			if(boolean !== true)
			{
				this.add();
			}
		},
		email: function (email) {
			if(email && !email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
				this.add();
			}
		}
	},
	
	describe: function (rules) {
		this.assert._self = this;
		for(var topic in rules) {
			var value = this.get(topic);
			for(var subRule in rules[topic]) {
				this.assert.topic = subRule;
				rules[topic][subRule].apply(this, [value]);
			}
		}
		console.log('ERRORS', this.errors);
		return this.errors;
	},
	
	isNew: function() {
		return !this.id || !this.get('_id');
	},
	
	watch: function(model) {
		var _self = this;
		if(model instanceof EventEmitter) {
			
			// for instances of EventEmitter bind to 
			// all events in the saw namespace
			var _emit = model.emit;
			model.emit = function(type) {
				if(_self.saw && _self.saw[type]) {
					var args = Array.prototype.slice.call(arguments, 1);
					_self.saw[type].apply(_self, args);
				}
				_self.trigger('saw:' + type);
				_emit.apply(_self, arguments);
			}
			
		} else {
			
			// this will soon be deprecated in favor of EventEmitters
			// proxy all events of a hive.Model to a watching model
			model.bind('all', function(eventName) {
				_self.trigger('saw:' + eventName);
				if(_self.saw && _self.saw[eventName]) {
					 _self.saw[eventName].apply(_self, arguments)
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
		this.push({errors: e});
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
	},
	push: function(changes) {
		for(var key in changes) {
			if(!this.get(key)) {
				var ref = {};
				ref[key] = [];
				this.set(ref);
			}
			var arr = this.get(key);
			var values = changes[key];
			if(values && values.length) {
				if(typeof arr === 'function') {
					arr.push.apply(arr, values);
				}
			} else if(values) {
				arr.push(values);
			} else {
				throw new Error('hive.Model.push(array, values) requires values to be an array, string, number, or object');
			}
		}
	}
});


//hive.Model
var backbone = require('backbone');

/* Live Usage:::
//server
//global chats
var Chats = hive.Model.extend({
	send: function(msg) {
		this.set({last: msg});
	}
	live: true
});
hive.clients.msgs = new Chats();
msgs.send('hi!');

//private messages just for someone special
hive.clients['Chats_948_987_49378'] = new Chats();
//or
hive.clients(new Chats({restrict: [session.auth.token, friend.auth.token]}));


//client
<div id="latest">
	<%= model.last %>
</div>

//view
var v = new hive.View({el: $('#latest'), template: 'latest', model: myApp.models.msgs});
*/

var exports = module.exports = backbone.Model.extend({
	watch: function(model) {
		var _self = this;
		model.bind('all', function(eventName) {
			_self.trigger('saw:' + eventName);
		});
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
		hive.log('**ERROR**', e.message || e, '@ ' + this.get('path') || ' a hive model');
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
	},
	ready: function(callback) {
		if(this.syncing) {
			this.once('ready', callback);
		} else {
			callback();
		}
	}
});


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
		this.set(attributes, {silent:!!isSilent});
		this.trigger('success');
	},
	error: function(e) {
		this.errors = [e];
		this.trigger('error');
	}
});


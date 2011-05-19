var model = require('./model');
var backbone = require('backbone');
var fs = require('fs');

var exports = module.exports = model.extend({
	initialize: function(attributes) {
		var _self = this;
		if(attributes.watch) {
			fs.watchFile(this.get('path'), function() {
				_self.sync('read', _self);
				_self.change();
			});
		}
	},
	sync: function(method, model) {
		switch(method) {
			case 'create':
			case 'update':
				fs.writeFile(model.get('path'), model.get('data'), model.get('encoding'), function(err, data) {
					if(err) return model.error(err);
					model.success({data: data}, true);
				});
				break;
			case 'read':
				fs.readFile(model.get('path'), function(err, data) {
					if(err) return model.error(err);
					model.success({data: data});
				});
				break;
			case 'delete':
				fs.unlink(model.get('path'), function(err) {
					if(err) return model.error(err);
					model.success({data: null});
				})
				break;
		}
	}
});
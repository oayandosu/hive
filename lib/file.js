var model = require('./model');
var backbone = require('backbone');
var fs = require('fs');
var util = require('util');
var fpath = require('path');

var exports = module.exports = model.extend({
	initialize: function(attributes) {
		var _self = this;
		var path = this.get('path');
		if(path) {
			var name = fpath.basename(path);
			if(name) {
				this.set({name: name})
			}
			if(attributes.watch) {
				fs.watchFile(path, function() {
					_self.sync('read', _self);
					_self.change();
				});
			}			
		}
		return this;
	},
	ext: function() {
		return fpath.extname(this.get('name'));
	},
	absolute: function() {
		return fpath.resolve(this.get('path'));
	},
	dir: function() {
		return fpath.dirname(this.absolute());
	},
	sync: function(method, model) {
		model.syncing = true;
		var path = model.absolute();
		switch(method) {
			case 'create':
			case 'update':
				hive.log(method + '-ing file @ ' + path);
				fs.writeFile(path, model.get('data'), model.get('encoding'), function(err) {
					hive.log(method + 'd file @ ' + path);
					if(err) return model.error(err);
					model.success({data: model.get('data')}, true);
				});
				break;
			case 'read':
				hive.log(method + '-ing file @ ' + path);
				fs.readFile(path, function(err, data) {
					hive.log(method + 'd file @ ' + path);
					if(err) return model.error(err);
					model.success({data: data});
				});
				break;
			case 'delete':
				hive.log(method + '-ing file @ ' + path);
				fs.unlink(path, function(err) {
					hive.log(method + 'd file @ ' + path);
					if(err) return model.error(err);
					model.success({data: null});
				});
				break;
		}
	},
	paste: function(destination) {
		var _self = this;
		_self.syncing = true;
		var name = _self.get('name'),
		 	path = destination.get('path') + '/' + name;
		if(!path) _self.error('Could not paste file to hive.Dir without a path');
		var i = fs.createReadStream(_self.get('path')),
			o = fs.createWriteStream(path);
		util.pump(i, o, function() {	
			hive.log('wrote file @ ' + path);
			_self.success({data: o});
		});
		return this;
	},
	update: function(callback, done) {
		var _self = this;
		_self.once('change', function(){
			console.log('success for', _self.get('path'));
			var data = _self.get('data');
			if(data) {
				var changed = callback(data);
				_self.set({data: changed}, {silent: true});
				_self.once('success', function() {
					done && done();
				});
				_self.save();
			}
		});
		_self.fetch();
	}
});
var model	 = require('./model'),
	backbone = require('backbone'),
	fs		 = require('fs'),
	util	 = require('util'),
	fpath	 = require('path'),
	hive	 = require('./hive'),
	http	 = require('http');

var exports = module.exports = model.extend({

	initialize: function(options) {
		var _self = this,
			options = parseOptions(options);
		_self.client = http.createClient(options.port, options.host);
	},

	sync: function() {
		model.syncing = true;
		var path = model.absolute();
		switch(method) {
			case 'create':
				
				break;
			case 'update':
				break;
			case 'read':
				break;
			case 'delete':
				break;
		}
	}

});

function parseOptions(options) {
	
}
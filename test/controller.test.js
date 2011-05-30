var vows   = require('vows'),
	hive   = require('../index'),
	fs 	   = require('fs'),
    assert = require('assert');

// directory behavior
vows.describe('controller').addBatch({
	
    'When a new controller': {
        topic: hive.at('/test'),

		'has a base route': {
			topic: function(controller) {
				var _self = this,
					test = new hive.Http({path: '/test'});
				test.bind('success', function() {
					_self.callback(null, test);
				});
				test.fetch();
			},
			
			'it should respond to a GET request at that route': function(err, response) {
				
			}
		}
    }
}).export(module);
var express  = require('express'),
	Response = require('./response'),
	exports  = module.exports = express.createServer();
	
//Extend the functionality of the express response
exports.use(function(req, res, next) {
	res.watcher = new hive.Model();
	res.watch = function(model) {
		res.watcher.watch(model);
		res.watcher.bind('saw:success', function() {
			//TODO: render a view if one exists for this route
			res.send(model.toJSON());
		});
		res.watcher.bind('saw:error', function() {
			res.send(model.errors || []);
		});
	}
	next();
});
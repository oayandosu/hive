var express  = require('express'),
	Response = require('./response');

//Configure a global server app
hive.app = express.createServer();//ty, tj

//Allow the setting of base route contexts on the fly
hive.at = function(controller) {
	hive.controllers.context = controller;
	return this;
}

function view(route) {
	var routeViewName;
	var match;
	if(route == '/') {
		routeViewName += 'index';
	} else if(match = route.match(/^\/\w+/)) {
		routeViewName += match[0];
	}
	var hasView = !!(hive.views[hive.controllers.context] && hive.views[hive.controllers.context][routeViewName]);
	return hasView && (hive.controllers.context + '/' + routeViewName);
}

function route(path) {
	if(hive.controllers.context == '/') hive.controllers.context = '';
	return hive.controllers.context + path;
}

//Wrap express routing functions
hive.get = function(path, fn) {
	if(fn instanceof hive.Model) {
		var model = fn;
		fn = function(req, res) {
			res.watch(fn);
			model.fetch();
		}
	}
	hive.app.get(route(path), function(req,res) {
		res.view = view(path);
		fn(req,res);
	});
	return this;
}

hive.post = function(path, fn) {
	if(fn instanceof hive.Model) {
		var model = fn;
		fn = function(req, res) {
			res.watch(fn);
			model.set(req.body);
			model.save();
		}
	}
	hive.app.post(route(path), function(req,res) {
		res.view = view(path);
		fn(req,res);
	});
	return this;
}

hive.find = function(path, query) {
	hive.app.get(route(path), function(req,res) {
		var params = _.extend(req.query, req.params),
			model  = new query(params);
		res.view = view(path);
		res.watch(model);
		model.fetch();
	});
	return this;
}

hive.delete = hive.del = function(path, fn) {
	if(fn instanceof hive.Model) {
		var model = fn;
		fn = function(req, res) {
			res.watch(fn);
			model.destroy();
			model.save();
		}
	}
	hive.app.delete(route(path), function(req,res) {
		res.view = view(path);
		fn(req,res);
	});
	return this;
}

//Extend the functionality of the express response to 'watch' other models for changes
//and automatically send the data or view when success or error occurs
hive.app.use(function(req, res, next) {
	res.watcher = new hive.Model();
	res.watch = function(model) {
		res.watcher.watch(model);
		res.watcher.bind('saw:success', function() {
			var modelJSON = model.toJSON();
			if(req.accepts('json') || !res.view) {
				res.send(modelJSON);
			} else {
				res.render(res.view, modelJSON);
			}
		});
		res.watcher.bind('saw:error', function() {
			res.send(model.errors || {error: "An unkown error occured."});
		});
	}
	next();
});
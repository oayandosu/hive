var express  = require('express'),
	hive = require('./hive'),
	now = require("now");

// create an app
hive.app = express.createServer();//ty tj

// create a connection to all clients
hive.clients = {
	// ty dshankar
	everyone: now.initialize(hive.app)
}

// make the public folder available as a static file folder
hive.app.use((express.staticProvider || express.static)(hive.path + '/public'));

// default to use haml
hive.app.register('.haml', require('hamljs'));

// allow the setting of base route contexts on the fly
hive.at = function(controller) {
	
	hive.controllers = hive.controllers || {};
	hive.controllers.context = controller;
	return hive;
	
}

// a utility for getting a view's path
function view(route, context) {
	
	var view = false,
		match;
	
	//defaults
	route = route || '/';
	context = context || '/';
	
	// map / to index
	if(route === '/') {
		route = '/index';
	} else if(match = route.match(/^\/\w+/)) {
		// match words trailing /	
		route = match[0];
	}
	
	if(context === '/') {
		context = '/home';
	}
	
	var contextName = context.replace('/', ''),
		routeName = route.replace('/', '');
	
	// search for view
	if(hive.views) {
		view = !!hive.views[contextName] && !!hive.views[contextName][routeName] && (context + route).replace('/', '') + '.' + hive.config.template;
	}
	
	return view;
	
}

// return the route of the path
function route(path) {
	if(path === '/') path = '';
	if(hive.controllers.context === '/') hive.controllers.context = '';
	return hive.controllers.context + path;
}

hive.get = function(path, fn) {
	
	var context;
	if(hive.controllers.context) context = hive.controllers.context;
	
	// if fn is passed a model, handle the response automatically
	if(fn instanceof hive.Model) {
		var model = fn;
		fn = function(req, res) {
			res.watch(fn);
			model.fetch();
		}
	}
	
	// call the express route
	hive.app.get(route(path), function(req,res) {
		res.view = view(path, context);
		if(fn) {
			fn(req,res);
		} else if(res.view) {
			res.render(res.view);
		} else {
			throw 'Could not find view, or a callback was not supplied to hive.get()';
		}
	});
	
	// allow for chaining
	return this;
	
}

hive.post = function(path, fn) {
	
	hive.log(route(path), fn);
	
	// if fn is passed a model, handle the response automatically
	if(fn instanceof hive.Model) {
		var model = fn;
		fn = function(req, res) {
			res.watch(fn);
			model.set(req.body);
			model.save();
		}
	}
	
	// call the express route
	hive.app.post(route(path), function(req,res) {
		res.view = view(path);
		fn(req,res);
	});
	
	// allow for chaining
	return this;
	
}

// create a utility for find calls that wraps get
hive.find = function(path, query) {	
	
	// if fn is passed a model, handle the response automatically
	hive.app.get(route(path), function(req,res) {
		
		// merge the querystring params and body params into one object
		var params = _.extend(req.query, req.params),
			model  = new query(params);
			
		// determine the view
		res.view = view(path);
		
		// tell the response to watch the query for new events
		res.watch(model);
		
		// execute the query
		model.fetch();
		
	});

	// allow for chaining
	return this;

}

hive.delete = hive.del = function(path, fn) {
	
	// if fn is passed a model, handle the response automatically
	if(fn instanceof hive.Model) {
		var model = fn;
		fn = function(req, res) {
			res.watch(fn);
			model.destroy();
			model.save();
		}
	}
	
	// call the express route
	hive.app.delete(route(path), function(req,res) {
		
		//determine the view
		res.view = view(path);
		
		// execute the callback
		fn(req,res);
		
	});
	
	// allow for chaining
	return this;
	
}

// extend the functionality of the express response to 'watch' other models for changes
// and automatically send the data or view when success or error occurs
hive.app.use(function(req, res, next) {
	
	// create a simple model to watch for events
	res.watcher = new hive.Model();
	
	// a utility method for res objects
	res.watch = function(model) {
		
		// automatically handle success
		res.watcher.watch(model);
		
		// bind to the watcher event namespace 'saw' and the event success
		res.watcher.bind('saw:success', function() {
			
			var modelJSON = model.toJSON();
			
			// if the req accepts json or doesn't have a view, respond with json
			if(req.accepts('json') || !res.view) {
				res.send(modelJSON);
				
			} else {
				
				// otherwise just render the view with json
				res.render(res.view, modelJSON);
			}
		});
		
		// automatically handle error
		res.watcher.bind('saw:error', function() {
			res.send(model.errors || {error: "An unkown error occured."});
		});
		
	}
	
	// continue to the next request
	next();
});

# Hive
    
	The missing node.js stack: automated.

## Installation

    $ npm install hive

## v0.1 Features [in development, watch this repo and check back for v0.1]

###Create

	$ hive create hello-world at ~/projects on :80
	> Your project is running at http://hello-world.dev:80
	> See your tests fail by running hive test hello-world
	
###Model
	var pic   = new hive.File('images/pic.jpg'),
		model = new hive.Model({watch: pic});

	//Tell the response to watch the model. It will automatically render a view or return JSON.
	res.watch(model);

	pic.fetch(function(err, data) {
		data = someCompressFunction(data);
		pic.save(data);
		model.set({contents: data, file: pic.path});
		model.save();
	});


###Persist
Hive supports several persistence layers out of the box:

* Redis Cache
	
	Hive automatically caches model reads and writes and staggers load to the database, making Hive apps crazy fast right out of the box.
	
* MongoDB

	After models are placed in a pending Redis queue they are saved to a Mongo Database for persistence.

###Authenticate
Hive installs with a simple Redis based session and user management system baked in. Registration, remember me, forgot password, login? Yep.

	var user = new hive.User('test@test.com', 'password');
	res.watch(user); //The result of the success or error callback will automatically be sent as JSON to the response
	user.save();

###Query
Hive provides query modeling for high performance database queries:

	app.get('/latest', function(req,res) {
		//Find the latest 100 objects in the entire database
		var query = new hive.Query({type: '*', sortby: 'id', asc: true, limit: 100});
		//If views/latest.haml exists, the success or error will be sent to the view
		res.watch(query);
		//The result of this query will be cached
		//Default caching behavior can be overriden by extending Query
		query.fetch();
		setTimeout(function() {
			//After 30 seconds, manually remove from cache
			query.destroy();
		}, 30000);
	});

Hive can also automatically create queries on the database server.
The following will be all run on the database server.

	var ActiveUsersQuery = hive.Query.extend({
		stored: function(result, db) {
		   m = function() { emit(this.uid, 1); }
		   r = function(k,vals) { return 1; }
		   return db.events.mapReduce(m, r, { query : {type: 'logins'} });
		}
	});

	app.get('/users/active', function(req,res) {
		var users = new ActiveUsersQuery();
		res.watch(users);
		users.fetch();
	});


## Compatibility

Hive is compatible with node 0.4.x

## License 

(The MIT License)

Copyright (c) 2011 Ritchie Martori

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

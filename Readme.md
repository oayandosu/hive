# Hive 

Node development on autopilot.   

*Version 0.0.1*

## Installation

    $ npm install hive

## v0.1 Features 

_note: v0.1 is in development, watch this repo and check back for 0.1 at the top_

###Watch

Node is mostly asynchronous. This can often causes headaches for simple operations. Hive simplifies this with watchers.

	//Tell an object to pay attention to something else
	var cop = new hive.Model({
		saw: {
			robbery: function(robber) {
				console.log("Cuff 'em boys...");
			}
		}
	});

	//Create and watch
	var mobster = new hive.Model();
	cop.watch(mobster);
	mobster.robbery();

	//Suppose we normalize our cops into a model class
	hive.model.Cop = hive.model.extend();

	//Hive lets you contextualize your watching so that your app doesn't get bogged down
	mobster.watch(hive.models.Cop, {type: 'chief'});
	
	mobster.prototype.saw.new.Cop = function(instance) {
		console.log('Coppers!! Cheeze it!');
	}

	//This will automatically emit the 'new' event and call saw.new() on the watcher
	var wiggum = new hive.Cop({type: 'chief'});

Result

	> Cuff 'em boys...
	> Coppers!! Cheeze it!

###Create

	$ hive new hello-world at ~/projects on :80
	> Your project is running at http://hello-world.dev:80
	
###Model

Hive makes modeling data easy. Whether it is in a database, an image, a tweet, or any other piece of data.

	//Opening a file is simple
	var pic   = new hive.File('images/pic.jpg'),
		model = new hive.Model({collection: 'files'});

	//Hive helps us watch out for important events, so we don't have to think about them
	//res (response) is smart enough to take it from here...
	res.watch(model);

	//All models (images, files, database items) support fetch
	pic.fetch(function(err, data) {
		//Take the contents of the file and save it to MongoDB
		model.set({contents: data, file: pic.path});
		model.save();
	});

	//Models can also sync, in real-time, on the server and the client
	var notifications = new hive.Model({live: 'notifications'});
	notifications.watch(pic);

	//Any browser client javascript can then bind to
	hive.server.notifications //see above: live: 'notifications'
	.bind('saw:progress', function() {
		//Watch for the file specific progress event as a file is loading
		console.log(e.data + '%');//25%
	});

###Query

Quickly model queries to fetch multiple models at a time.

	hive.get('/latest', function(req,res) {

		//Find the latest 100 objects in the entire database
		var query = new hive.Query({type: '*', sortby: 'created', asc: false, limit: 100});

		//If views/latest.haml exists, the success or error will be sent to the view
		res.watch(query);

	});

##Routes

The above can also be written as a simple route.

        //This will take care of query parameters, response type, instantiation, and just work.
	hive.find('/latest/:id', hive.queries.MyCustomQueryClass);


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

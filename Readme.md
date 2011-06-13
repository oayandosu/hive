# Hive 

Node development on autopilot.   

*Version 0.0.1*

## Installation

    $ npm install hive

## v0.1 Features 

_note: v0.1 is in development, watch this repo and check back for 0.1 at the top_

###Create

	$ hive new hello-world
	
###Model

Hive makes modeling data easy. Whether it is in a database, an image, a tweet, or any other piece of data.

    // create a class for reference
    var User = hive.Model.extend();
    
    // create an instance, initializing with some values
    var ritch = new User({name: 'ritch', password: 'homer'});
    
    // models default to sync to mongo, but this can be overriden to sync to any method of persistence
    ritch.save();

###Controllers

Exposing models over a controller is simple.

    hive
    .at('/users')
    .find('/:name', Users)
    .post('/new', function(req, res) {
        
        // create a user
        var user = new User({name: req.param('name')});
        
        // notify the response of anything that happens
        // this will send errors or any new data on 'success'
        // or 'error' events in the model
        user.notify(res).save();
        
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

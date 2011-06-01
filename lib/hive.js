var hive		= exports = module.exports = {};
var _			= require('underscore');
hive.Model 	    = require('./model');
hive.File	    = require('./file');
hive.Dir	    = require('./dir');
hive.Query	    = require('./query');
hive.Http	    = require('./http');
hive.Controller = require('./controller');
hive.sync 	    = require('./sync');
hive.log 	    = require('./util/console').log;
hive.config     = {
	template: 'haml'
};

var fs = require('fs');
require('./util/cli');

//Start the magic
hive.init = function(path) {
	cli.clear();
	cli.color('cyan')
	.write(hiveART)
	.color('white');
	try {
		load('views',       path, null, true);
		load('models',      path);
		load('queries',     path);
		load('controllers', path);
	} catch(e) { return; }
	cli
	.write('[')
	.color('green')
	.write('All Hive files loaded!')
	.color('white')
	.write(']\r\n\r\n');
	hive.app.listen(hive.config.port || 3000);
	cli
	.write('[')
	.color('green')
	.write('Hive listening at http://localhost:3000')
	.color('white')
	.write(']\r\n\r\n');
}

//Load all files of type at path
function load(type, path, target, refOnly) {
	target = target || hive;
	target[type] = {};
	var files,
		path = path + '/' + type;
	try {
		files = fs.readdirSync(path);
		files.forEach(function(file) {
			var name = file.replace('.js', '').replace('.haml', ''),
				isDir = name == file;
			try {
				if(isDir) {
					load(file, path, target[type], refOnly);
				} else {
					refOnly
						?
						target[type][name] = {}
						:
						target[type][name] = require(path + '/' + file);
				} 
			} catch(e) {
				cli.clear()
				.color('red')
				.write('\r\nError\r\n')
				.color('white')
				.write('An error has occured while loading Hive ')
				.color('cyan')
				.write(type)
				.color('white')
				.write('\r\n')
				.write('Hive could not load ')
				.color('red')
				.write(file)
				.color('white')
				.write(' located at \r\n')
				.color('yellow')
				.write(path + '/' + file)
				.color('red')
				.write('\r\n\r\nReason\r\n')
				.color('white');
				hive.log(e.stack.toString());
				cli
				.confirm('\r\nDo you want to open this file in Textmate? y/n', function(answer) {
					if(answer) cli.exec('mate ' + path + '/' + file);
				});
				throw 'Init failed';
				return false;
			}	
			cli.write('[')
			.color('cyan')
			.write(type)
			.color('white')
			.write(']')
			.fwd(20 - type.length)
			.write('Loaded ')
			.color('green')
			.write(name)
			.color('white')
			.write('!\r\n');
		});
	} catch(e) {
		if(e == 'Init failed') throw 'Init failed'
	}
}

var hiveART = ''
+ ' _   _         \r\n'
+ '| |_|_|_ _ ___ \r\n'
+ '|   | | | | -_|\r\n'
+ '|_|_|_|\\_/|___|\r\n'
+ '\r\n'








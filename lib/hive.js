GLOBAL.hive   = exports = module.exports = {};
GLOBAL._	  = require('underscore');
hive.File	  = require('./file');
hive.Query	  = require('./query');
hive.Model 	  = require('./model');
hive.Response = require('./response');
hive.sync 	  = require('./sync');
hive.app 	  = require('./app');

var fs = require('fs');
require('./util/cli');
//Start the magic
hive.init = function(path) {
	cli.clear();
	cli.color('cyan')
	.write(hiveART)
	.color('white');
	try {
		load('controllers', path);
		load('views', path);
		load('models', path);
	} catch(e) { return; }
	cli
	.write('[')
	.color('green')
	.write('All Hive files loaded!')
	.color('white')
	.write(']\r\n\r\n');
}

function load(type, path) {
	hive[type] = {};
	var files,
		path = path + '/' + type;
	try {
		files = fs.readdirSync(path);
		files.forEach(function(file) {
			var name = file.replace('.js', '').replace('.haml', '');
			name = name.split('');
			name[0] = name[0].toUpperCase();
			name = name.join('');
			try {
				hive[type][name] = require(path + '/' + file);
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
				.color('white')
				.write(e)
				.confirm('Do you want to open this file in Textmate? y/n', function(answer) {
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









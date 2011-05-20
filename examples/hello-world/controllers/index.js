hive
.at('/')
.get('/', function(req,res) {
	res.render('index.haml');
});

hive.clients.log = new hive.Model({live: 'log'});

setInterval(function() { 
	hive.clients.log.set({msg: new Date().getTime()});
	hive.clients.log.save();
}, 3000);
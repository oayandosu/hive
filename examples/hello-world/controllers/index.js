hive
.at('/')
.get('/', function(req,res) {
	res.send('index');
});
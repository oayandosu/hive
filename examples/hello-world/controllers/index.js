var app = hive.app;

app.get('/', function(req,res) {
	var person = new hive.models.Contact();
	person.set({name: 'Joe'});
	res.watch(person);
	person.trigger('success');

});

app.listen(3000);
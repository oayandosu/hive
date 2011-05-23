var backbone = require('backbone');

hive.clients.everyone.now.sync = function(context, data) {
	//Call the clients sync method
	this.now.csync(context, data);
}

backbone.sync = function(method, model) {
	model.syncing = true;
	var liveNamespace = model.get('live')
	if(liveNamespace) {
		var id = model.get('id'),
			json = model.toJSON();
		id  ?
			hive.clients.everyone.now.sync(liveNamespace + '-' + id, json)
			:
			hive.clients.everyone.now.sync(liveNamespace, json);
	}
	switch(method) {
		case 'create':
		case 'update':
			break;
		case 'read':
			break;
		case 'delete':
			break;
	}
	model.success();
}

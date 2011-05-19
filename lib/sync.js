var backbone = require('backbone');
backbone.sync = function(method, model) {
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

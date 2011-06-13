var backbone = require('backbone'),
	mongoose = require('mongoose'),
	_ = require('underscore'),
	hive = require('./hive');

if(hive.config.db && hive.config.db.connection) {
	mongoose.connect(hive.config.db.connection);
}

hive.clients.everyone.now.sync = function(context, data) {
	//Call the clients sync method
	this.now.csync(context, data);
}

exports = module.exports = backbone.sync = function(method, model) {
	model.syncing = true;
	var id = model.get('id'),
		json = model.toJSON(),
		now = new Date(),
		utcNow = now.getTime() + (now.getTimezoneOffset() * 60000),
		MongoModel = mongoose.model(model._name, new mongoose.Schema({})),
		liveNamespace = model.get('live');
	
	var mongoModel = new MongoModel();
		
	if(liveNamespace) {
		id  ?
			hive.clients.everyone.now.sync(liveNamespace + '-' + id, json)
			:
			hive.clients.everyone.now.sync(liveNamespace, json);
	}
	switch(method) {
		case 'create':
			model.set({created: utcNow});
		case 'update':
			model.set({updated: utcNow});
			// TODO: map reduce for update
			// TODO: add $push support for arrays
			mongoModel.collection.insert(json, function(err) {
				if(err) {
					model.error(err);
				} else {
					model.success();
				}
			});
			break;
		case 'read':
				if(model instanceof hive.Query) {
					if(model.query) {
						model.query();
					} else {
						MongoModel.find(model.get('query'), function(err, results) {
							if(err) {
								model.error(err);
							} else {
								model.success({results: results || []});
							}
						});
					}
				} else if(id) {
					MongoModel.findById(id, null, null, function(err, doc) {
						if(err) {
							model.error(err);
						} else if(doc) {
							model.success(doc.toJSON());
						} else {
							model.error('Cannot find a model with id ' + id);
						}
					});
				} else {
					model.error('Cannot read a model without an id');
				}
			break;
		case 'delete':
				if(id) {
					mongoModel.remove(function(err) {
						if(err) {
							model.error(err);
						} else {
							model.success();
						}
					});
				}
			break;
	}
}

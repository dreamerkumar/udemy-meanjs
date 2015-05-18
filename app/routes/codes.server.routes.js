'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var codes = require('../../app/controllers/codes.server.controller');

	// Codes Routes
	app.route('/codes')
		.get(codes.list)
		.post(users.requiresLogin, codes.create);

	app.route('/codes/:codeId')
		.get(codes.read)
		.put(users.requiresLogin, codes.hasAuthorization, codes.update)
		.delete(users.requiresLogin, codes.hasAuthorization, codes.delete);

	// Finish by binding the Code middleware
	app.param('codeId', codes.codeByID);
};

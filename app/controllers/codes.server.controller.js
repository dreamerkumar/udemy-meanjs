'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Code = mongoose.model('Code'),
	_ = require('lodash');

/**
 * Create a Code
 */
exports.create = function(req, res) {
	var code = new Code(req.body);
	code.user = req.user;

	code.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(code);
		}
	});
};

/**
 * Show the current Code
 */
exports.read = function(req, res) {
	res.jsonp(req.code);
};

/**
 * Update a Code
 */
exports.update = function(req, res) {
	var code = req.code ;

	code = _.extend(code , req.body);

	code.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(code);
		}
	});
};

/**
 * Delete an Code
 */
exports.delete = function(req, res) {
	var code = req.code ;

	code.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(code);
		}
	});
};

/**
 * List of Codes
 */
exports.list = function(req, res) { 
	Code.find().sort('-created').populate('user', 'displayName').exec(function(err, codes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(codes);
		}
	});
};

/**
 * Code middleware
 */
exports.codeByID = function(req, res, next, id) { 
	Code.findById(id).populate('user', 'displayName').exec(function(err, code) {
		if (err) return next(err);
		if (! code) return next(new Error('Failed to load Code ' + id));
		req.code = code ;
		next();
	});
};

/**
 * Code authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.code.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

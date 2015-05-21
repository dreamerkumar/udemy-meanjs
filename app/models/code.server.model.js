'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Code Schema
 */
var CodeSchema = new Schema({
	description: {
		type: String,
		default: '',
		required: 'Please enter the scenario where this code will be useful',
		trim: true
	},
	code: {
		type: String,
		default: '',
		required: 'Please enter the code snippet',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Code', CodeSchema);
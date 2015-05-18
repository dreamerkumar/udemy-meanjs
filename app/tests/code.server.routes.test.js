'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Code = mongoose.model('Code'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, code;

/**
 * Code routes tests
 */
describe('Code CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Code
		user.save(function() {
			code = {
				name: 'Code Name'
			};

			done();
		});
	});

	it('should be able to save Code instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Code
				agent.post('/codes')
					.send(code)
					.expect(200)
					.end(function(codeSaveErr, codeSaveRes) {
						// Handle Code save error
						if (codeSaveErr) done(codeSaveErr);

						// Get a list of Codes
						agent.get('/codes')
							.end(function(codesGetErr, codesGetRes) {
								// Handle Code save error
								if (codesGetErr) done(codesGetErr);

								// Get Codes list
								var codes = codesGetRes.body;

								// Set assertions
								(codes[0].user._id).should.equal(userId);
								(codes[0].name).should.match('Code Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Code instance if not logged in', function(done) {
		agent.post('/codes')
			.send(code)
			.expect(401)
			.end(function(codeSaveErr, codeSaveRes) {
				// Call the assertion callback
				done(codeSaveErr);
			});
	});

	it('should not be able to save Code instance if no name is provided', function(done) {
		// Invalidate name field
		code.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Code
				agent.post('/codes')
					.send(code)
					.expect(400)
					.end(function(codeSaveErr, codeSaveRes) {
						// Set message assertion
						(codeSaveRes.body.message).should.match('Please fill Code name');
						
						// Handle Code save error
						done(codeSaveErr);
					});
			});
	});

	it('should be able to update Code instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Code
				agent.post('/codes')
					.send(code)
					.expect(200)
					.end(function(codeSaveErr, codeSaveRes) {
						// Handle Code save error
						if (codeSaveErr) done(codeSaveErr);

						// Update Code name
						code.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Code
						agent.put('/codes/' + codeSaveRes.body._id)
							.send(code)
							.expect(200)
							.end(function(codeUpdateErr, codeUpdateRes) {
								// Handle Code update error
								if (codeUpdateErr) done(codeUpdateErr);

								// Set assertions
								(codeUpdateRes.body._id).should.equal(codeSaveRes.body._id);
								(codeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Codes if not signed in', function(done) {
		// Create new Code model instance
		var codeObj = new Code(code);

		// Save the Code
		codeObj.save(function() {
			// Request Codes
			request(app).get('/codes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Code if not signed in', function(done) {
		// Create new Code model instance
		var codeObj = new Code(code);

		// Save the Code
		codeObj.save(function() {
			request(app).get('/codes/' + codeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', code.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Code instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Code
				agent.post('/codes')
					.send(code)
					.expect(200)
					.end(function(codeSaveErr, codeSaveRes) {
						// Handle Code save error
						if (codeSaveErr) done(codeSaveErr);

						// Delete existing Code
						agent.delete('/codes/' + codeSaveRes.body._id)
							.send(code)
							.expect(200)
							.end(function(codeDeleteErr, codeDeleteRes) {
								// Handle Code error error
								if (codeDeleteErr) done(codeDeleteErr);

								// Set assertions
								(codeDeleteRes.body._id).should.equal(codeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Code instance if not signed in', function(done) {
		// Set Code user 
		code.user = user;

		// Create new Code model instance
		var codeObj = new Code(code);

		// Save the Code
		codeObj.save(function() {
			// Try deleting Code
			request(app).delete('/codes/' + codeObj._id)
			.expect(401)
			.end(function(codeDeleteErr, codeDeleteRes) {
				// Set message assertion
				(codeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Code error error
				done(codeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Code.remove().exec();
		done();
	});
});
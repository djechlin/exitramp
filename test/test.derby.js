var exitramp = require('..');
var assert = require('assert');
var request = require('supertest');
var http = require('http');
var express = require('express');
var derby = require('derby');


describe('exitramp', function() {

	// fine to just run one server

	var expressApp = express();
	var app = derby.createApp(module);
	exitramp.decorateDerby(app);

	var server = http.createServer(expressApp);
	var store = derby.createStore({listen: server});

	// all routes must be created before app.router call

	app.getRamp('/getramp/redirect/origin', function(req) {
		return exitramp.redirect('/getramp/redirect/destination');
	});

	app.getRamp('/getramp/redirect/destination', function(req) {
		console.log("returning dest reached");
		return exitramp.contentResult('destination reached');
	});

	expressApp
		.use(store.modelMiddleware())
		.use(app.router());

	describe('#decorateDerby(app)', function() {

		// routes in this test case must be unique as they will accumulate
		// depending on the tests that are run

		it('should decorate app with functions get, post, del and put', function() {

			['get', 'post', 'del', 'put'].forEach(function(verb) {
				assert.equal(typeof app[verb + 'Ramp'], 'function');
			});
		}); //end it

		describe('#getRamp(path, callback)', function() {

			it('should redirect URL when a redirect result is returned', function(done) {

				request(expressApp)
				.get('/getramp/redirect/origin')
				.expect('location', '/getramp/redirect/destination')
				.expect(302, done); // temporary redirect per http://stackoverflow.com/a/12291849/1339987

			});
		});
	}); // end inner describe
}); // end outer describe

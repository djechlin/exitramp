var exitramp = require('..');
var assert = require('assert');
var request = require('supertest');
var http = require('http');
var express = require('express');
var derby = require('derby');
var Q  = require('q');

describe('exitramp', function() {

	var expressApp = express();
	var app = require('./fixtures/createApp')();
	exitramp.decorateDerby(app);

	var server = http.createServer(expressApp);
	var store = derby.createStore({listen: server});

	// all routes must be created before app.router call
	// these can be put closer to their respective unit tests by using a different app each time

	app.getRamp('/redirect/origin', function(req) {
		return exitramp.redirect('/getramp/redirect/destination');
	});

	app.getRamp('/redirect/destination', function(req) {
		return exitramp.contentResult('destination reached');
	});

	app.getRamp('/render', function(req) {
	req.getModel().set('paragraph', 'Apples and oranges');
		return exitramp.render({title: 'Fruits'});
	});

	app.getRamp('/parent/:key?', function(req) {
		return exitramp.contentResult('parent');
	});

	app.getRamp('/parent/value', function(req) {
		return exitramp.pass();
	});

	app.getRamp('/promise/success', function(req) {
		return Q.delay(50).then(function() {
			return exitramp.contentResult('success');
		});
	});

	app.getRamp('/promise/failure', function(req) {
		return Q.reject(exitramp.contentResult('failure'));
	});

	app.getRamp('/contentresult', function(req) {
		return exitramp.contentResult('default');
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
				.get('/redirect/origin')
				.expect('location', '/getramp/redirect/destination')
				.expect(302, done); // temporary redirect per http://stackoverflow.com/a/12291849/1339987

			});

			it('should render properly for render results', function(done) {
				request(expressApp)
				.get('/render')
				.expect('render')
				.expect(200, done);

			});

			it('should treat succeeded promises same as flat results', function(done) {
				request(expressApp)
				.get('/promise/success')
				.expect('success')
				.expect(200, done);

			});

			it('should treat failed promises same as succeed promises', function(done) {
				request(expressApp)
				.get('/promise/failure')
				.expect('failure')
				.expect(200, done);

			});

			it('should call parent route on pass', function(done) {
				request(expressApp)
				.get('/parent/value')
				.expect('parent')
				.expect(200, done);

			});

			it('should default to text/html on contentResult', function(done) {
				request(expressApp)
				.get('/contentresult')
				.expect('content-type', 'text/html')
				.expect(200, done);
			});
		});
	}); // end describe getRamp
}); // end describe decorateDerby

/*jshint node: true, camelcase: true, eqeqeq: true, forin: true, immed: true, latedef: false, newcap: true, noarg: true, undef: true, globalstrict: true*/
"use strict";

var _ = require('lodash');
var Q = require('q');
var logger = require('logup-emitter').createLogger(module);

exports.decorateExpress = function(app) {

};

function makeReq(model, params) {
	if(!model || !params) {
		throw new Error("Invalid params in making model");
	}
	return {	params: params,
				getModel: function() { return model; }
			};
}

exports.decorateDerby = function(app) {

	var adapter = require('./derby-adapter');

	var act = function(result, page, model, next) {

		var act = adapter[result.type].act;
		if(act) {
			act(result, page, model, next);
		}
		else {
			throw new Error("Unsupported result type: " + result.type);
		}
	};

	["get", "post", "put", "del"].forEach(function(verb) {

		app[verb + "Ramp"] = function(path, callback) {

			if(path.hasOwnProperty('to') && path.hasOwnProperty('from'))  {
				// indicates transitional and implies path should be object with "from" and "to" properties
				// expect callback to look like 
				// { forward: function(model, params, next) {}, back: function(model, params, next) {} }

				var args = {};

				_.forOwn(callback, function(theCallback, name) {

					args[name] = function(model, params, next) {
						var req = makeReq(model, params);

						var actTransitional = function(result) {
							if(result.transitional) {
								act(result, null, model, next);
							}
						};

						// per README this API doesn't care whether result returned as success or failure
						Q.when(theCallback(req)).then(actTransitional, actTransitional);
					};
				});
				app[verb](path, args);
			}

			else if(typeof path === 'string') {

				app[verb](path, function(page, model, params, next) {

					var req = makeReq(model, params);

					var actWrapper = function(result) {
						act(result, page, model, next);
					};

					// per README this API doesn't care whether result returned as success or failure
					Q.when(callback(req)).then(actWrapper, actWrapper);
				});
			}

			else {
				throw new Error("Invalid params in setting up route");
			}
		};
	});
};

_.extend(exports, require('./Result'));

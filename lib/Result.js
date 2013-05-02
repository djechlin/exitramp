/*jshint node: true, camelcase: true, eqeqeq: true, forin: true, immed: true, latedef: false, newcap: true, noarg: true, undef: true, globalstrict: true*/
"use strict";

/*
 * exports of this module are exposed directly to client code
 */

exports.redirect = function(path) {

	return {
		type: 'redirect',
		path: path
	};
};

exports.render = function(context) {

	// ok if context is undefined as it is optional argument
	// to Derby's page.render

	return {
		type: 'render',
		context: context
	};
};

exports.noContent = function() {

	return {
		type: 'noContent'
	};
};

exports.pass = function() {

	return {
		type: 'pass'
	};
};

exports.contentResult = function(content, contentType) {

	return {
		type: 'contentResult',
		content: content,
		contentType: contentType || 'text/html'
	};
};

module.exports = {

	'redirect':  {
		act: function(result, page, model, next) {
			page.redirect(result.path);
		},
		transitional: false
	},

	'render':  {

		act: function(result, page, model, next) {
			page.render(result.context);
		},
		transitional: false
	},

	'noContent': {

		act: function(result, page, model, next) {

			if(!process.browser) {
				model.req.res.send(204);
			}
			// noop client side
		},
		transitional: true
	},

	'pass': {

		act: function(result, page, model, next) {
			next();
		},
		transitional: true
	},

	'contentResult': {

		act: function(result, page, model, next) {

			var res = model.req.res;
			res.header('content-type', result.contentType);
			res.send(result.content);
		}
	}
};
module.exports = {

	'redirect':  {
		act: function(result, page, model, next) {
			page.redirect(result.path);
		},

		transitional: false
	},

	'render':  {

		act: function(result, page, model, next) {
			page.render();
		},

		transitional: false
	},

	'noContent': {

		act: function(result, page, model, next) {

			if(!process.browser) {
				model.req.res.send(204);
			}
			else {
				// noop client side
			}
		},

		transitional: true
	},

	'pass': {

		act: function(result, page, model, next) {
			next();
		},

		transitional: true
	}
};
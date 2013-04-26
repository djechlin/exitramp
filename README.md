exitramp
========

Usage:


```js
var exitramp = require('exitramp');

exitramp.decorateExpress(app);

app.getRamp("/", function(req) {
	return exitramp.redirect("/welcome");
});

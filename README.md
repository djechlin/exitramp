exitramp
========

Usage:


```js
var exitramp = require('exitramp');

exitramp.decorateExpress(app);

app.getRamp("/", function(req) {
	return exitramp.redirect("/welcome");
});

```

exitramp is ambivalent with respect to whether callbacks to verb routes return succeeded promises or failed promises. This it to give client code greater flexibility.

Derby
-----

Transitional routes do not act on the page hence do not return any result.  Returned values from transitional routes in exitramp will be ignored, except for `pass()` and errors.
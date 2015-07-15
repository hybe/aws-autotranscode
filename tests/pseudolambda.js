var Promise = require("bluebird");
var response = {status : 0};
var module;

var _runner = function(event) {
	var deferred = Promise.pending();
	setTimeout(function() {
		var lambdacontext = {
			succeed : function(success) {
				deferred.resolve(success);
			},
			fail : function(error) {				
				deferred.reject(error);
			}
		};

		module.handler(event, lambdacontext);
	});
	return deferred.promise;
};

module.exports = exports = {
	init : function() {
		module = require("../src/index.js")
	},
	run : _runner
};

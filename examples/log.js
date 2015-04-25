var cfble = require('../index.js');

// Test function that tells the crazyflie to hover for 10 seconds
var log = function(err, cf) {
	if (err || !cf) {
		console.log("Could not connect to Crazyflie");
		process.exit(0);
	}
};

cfble.Crazyflie(log);
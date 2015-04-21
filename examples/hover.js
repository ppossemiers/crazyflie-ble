var cfble = require('../index.js');

// Test function that tells the crazyflie to hover for 10 seconds
var hover = function(err, cf) {
	if (err || !cf) {
		console.log("Could not connect to Crazyflie");
		process.exit(0);
	}

	cf.setThrust(40000); // Adjust as needed
	console.log("Thrust now set to: " + cf.thrust);

	cf.start(true);
	console.log("Crazyflie now starting...");

	setTimeout(function(){
		cf.stop();
		console.log("Crazyflie now stopping...");
	}, 10 * 1000);
};

cfble.Crazyflie(hover);
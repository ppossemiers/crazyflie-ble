var cfble = require('../index.js');

// Test function that tells the crazyflie to hover for 10 seconds
var hover = function(err, cf) {
	if (err || !cf) {
		console.log('Could not connect to Crazyflie');
		process.exit(0);
	}

	cf.setThrust(40000); // Adjust as needed
	console.log("Thrust now set to: " + cf.thrust);

	cf.start();
	console.log('Crazyflie now starting...');

	cf.sendParam(11, 'b', 1); // Set the hover param
	
	var i = 20; // 20 seconds
	i *= 2; // double it since we are sending every half a second
	var interval = setInterval(function(){ // Send 32767 to make CF hover
		cf.sendAll(0, 0, 0, 32767);
		i--;
		if(i == 0){
			clearInterval(interval);
			cf.sendParam(11, 'b', 0); // Clear the hover param
			cf.stop();
			console.log('Crazyflie now stopping...');
		}
	}, 500);
};

cfble.Crazyflie(hover);
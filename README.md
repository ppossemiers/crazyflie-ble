# Crazyflie Bluetooth Low-Energy Node.js Module

## About
crazyflie-ble is a Node.js based interface for communicating with
the [Crazyflie 2.0 Nano Quadcoptor](https://www.bitcraze.io/crazyflie-2/) over Bluetooth Low-Energy.


## Usage

### Download
Download the zip or clone the GitHub repo into the 'node-modules' folder of your project

`git clone https://github.com/ppossemiers/crazyflie-ble`

### Install
Run `npm install` from within the directory to grab any needed dependencies

### Require
Require the module and create a Crazyflie instance passing in a callback function.

	var cfble = require('crazyflie-ble');

	cfble.Crazyflie(function(err, cf){

		if (err) {
			return console.log("Could not connect to Crazyflie");
		}

		// Perform actions with crazyflie here
		...

	});

The callback function should follow the (err, obj) argument structure, passing in any errors that occur or an instance of a Crazyflie connection on success.


## Examples

### Hover [untested]

To run the hover example run `npm run-script hover` from within the root directory of the package

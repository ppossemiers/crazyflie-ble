# Crazyflie Bluetooth Low-Energy Node.js Module

## About
crazyflie-ble is a Node.js based interface for communicating with
the [Crazyflie 2.0 Nano Quadcoptor](https://www.bitcraze.io/crazyflie-2/) over Bluetooth Low-Energy.

This repo is a fork off of the project that [ppossemiers](https://github.com/ppossemiers) had started [here](https://github.com/ppossemiers/BLECrazyflie_NodeJS).

## Usage

### Download
Download the zip or clone the GitHub repo into the 'node-modules' folder of your project

`git clone https://github.com/jordankid93/BLECrazyflie_NodeJS.git`
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

## Dependencies:
* [Node.js](https://nodejs.org) `brew install node`
	* [NPM](https://www.npmjs.com) (included with Node.js)
* [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) (Mac App Store)
* [noble](https://github.com/sandeepmistry/noble) `npm -g install noble`
* [bufferpack](https://github.com/ryanrolds/bufferpack) `npm -g install bufferpack`

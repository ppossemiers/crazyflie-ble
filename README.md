# Crazyflie Bluetooth Low-Energy Node.js Module

## About
crazyflie-ble is a Node.js based interface for communicating with
the [Crazyflie 2.0 Nano Quadcoptor](https://www.bitcraze.io/crazyflie-2/) over Bluetooth Low-Energy.

This repo is a fork off of the project that [ppossemiers](https://github.com/ppossemiers) had started [here](https://github.com/ppossemiers/BLECrazyflie_NodeJS).

## Usage

### Download
Download the zip or clone the GitHub repo into the 'node-modules' folder of your project

`git clone https://github.com/jordankid93/BLECrazyflie_NodeJS.git`

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

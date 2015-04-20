var noble = require('noble');
var bufferpack = require('bufferpack');

function Crazyflie(callback) {
// Callback = function(error, crazyflie){ ... };

	////////////////////////
	// CONSTANTS
	////////////////////////
	var SERVICE_UUID = ['000002011c7f4f9e947b43b7c00a9a08'];
	var CHARACTERISTIC_UUID = ['000002021c7f4f9e947b43b7c00a9a08'];

	var START_INTERVAL_TIME = 1000;
	var STOP_INTERVAL_TIME = 500;

	var THRUST_MIN = 10000;
	var THRUST_MAX = 60000;



	////////////////////////
	// Flying Components
	////////////////////////
	this.connected = false;
	this.peripheral = '';
	this.service = '';
	this.characteristic = '';
	this.callback = callback;



	////////////////////////
	// Flying Components
	////////////////////////

	this.roll = 0;
	this.pitch = 0;
	this.yaw = 0;
	this.thrust = 0;



	////////////////////////
	// Time Intervals
	////////////////////////

	this.startInterval;
	this.stopInterval;





	////////////////////////
	// Connection Functions
	////////////////////////

	/*
	Function: 	(Noble) On State Change

	Params: 	State - String

	Returns: 	None

	Description:
				Depending on the state of noble, either starts or stops scanning
	*/
	noble.on('stateChange', function(state) {
		if(state === 'poweredOn') {
			noble.startScanning();
		} else {
			noble.stopScanning();
		}
	});

	/*
	Function: 	(Noble) On Discover

	Params: 	Peripheral - ...

	Returns: 	** This - CrazyFlie Instance **

	Description:
				...
				** Returns this instance of a CrazyFlie to the callback passes in **
	*/
	noble.on('discover', function(peripheral) {
		if(peripheral.advertisement.localName === 'Crazyflie'){
			noble.stopScanning();
			this.peripheral = peripheral;
			console.log('Crazyflie with UUID ' + peripheral.uuid + ' found');

			this.peripheral.on('disconnect', function() { process.exit(0); });

			this.peripheral.on('rssiUpdate', function() { console.log(peripheral.rssi); });

			this.peripheral.connect(function(error) {
				if(error) {
					console.log(error);
					return this.callback(error, null);
					// process.exit(0); // Allows users to handle failed connection
				}
				else {
					this.connected = true;
					console.log('Connected to Crazyflie');
					this.peripheral.discoverServices(SERVICE_UUID, function(error, services) {
						this.service = services[0];
						this.service.discoverCharacteristics(CHARACTERISTIC_UUID, function(error, characteristics) {
							this.characteristic = characteristics[0];
								this.callback(null, this);
						});
					});
				}
			});
		}
	});





	////////////////////////
	// Process Functions
	////////////////////////

	/*
	Function: 	Start

	Params: 	Hover - Bool

	Returns: 	None

	Description:
				Sets a repeating interval to send the stored
				movement components to the CrazyFlie. Also sets
				crazyflie to hover mode if hover arg is true
	*/
	this.start = function(hover){
		clearInterval(stopInterval);

		if (hover) this.sendParam(11, 'b', 1); // Will need to be more flexible as firmware changes
		
		startInterval = setInterval(function(){
			this.sendAll(this.roll, this.pitch, this.yaw, this.thrust);
		}, START_INTERVAL_TIME);
	};

	/*
	Function: 	Stop

	Params: 	None

	Returns: 	None

	Description:
				Sets a repeating interval to reduce the stored thrust
				movement component. Once the thrust is below a certain
				number, it is set to zero and the start interval is cleared.
	*/
	this.stop = function(){
		stopInterval = setInterval(function(){
			this.thrust -= 1000; // Can adjust as needed for smoother decend
			if (thrust <= THRUST_MIN) {
				thrust = 0;
				clearInterval(this.startInterval);
				clearInterval(this.stopInterval);
			}
		}, STOP_INTERVAL_TIME);
	};





	////////////////////////
	// Movement Functions
	////////////////////////

	/*
	Function: 	Set Roll

	Params: 	newRoll - Number

	Returns: 	None

	Description:
				Sets a the value of the stored roll movement component
	*/
	this.setRoll = function(newRoll) {
		this.roll = newRoll;
	};

	/*
	Function: 	Set Pitch

	Params: 	newPitch - Number

	Returns: 	None

	Description:
				Sets a the value of the stored pitch movement component
	*/
	this.setPitch = function(newPitch) {
		this.pitch = newPitch;
	};

	/*
	Function: 	Set Yaw

	Params: 	newYaw - Number

	Returns: 	None

	Description:
				Sets a the value of the stored yaw movement component
	*/
	this.setYaw = function(newYaw) {
		this.yaw = newYaw;
	};

	/*
	Function: 	Set Thrust

	Params: 	newThrust - Number

	Returns: 	None

	Description:
				Sets a the value of the stored thrust movement component
	*/
	this.setThrust = function(newThrust) {
		this.thrust = newThrust;
	};

	/*
	Function: 	Send All (Previously "Set Point")

	Params: 	Roll - Number
				Pitch - Number
				Yaw - Number
				Thrust - Number

	Returns: 	None

	Description:
				Sets a the value of the stored roll movement component
	*/
	this.sendAll = function(roll, pitch, yaw, thrust) {
		var data = bufferpack.pack('<BfffH', [0x30, roll, pitch, yaw, thrust]);
		this.characteristic.write(data, false);
		// console.log(this.peripheral.rssi);
	};





	////////////////////////
	// Utility Functions
	////////////////////////

	/*
	Function: 	Call Scripts

	Params: 	None

	Returns: 	None

	Description:
				...
	*/
	this.callScripts = function() {
		for(i = 0; i < cf.scripts.length; i++) {
				this.scripts[i].call(this);
			}
	};

	/*
	Function: 	Send Parameter

	Params: 	Indent - Number
				Type - String
				Value - Number

	Returns: 	None

	Description:
				...
	*/
	this.sendParam = function(ident, type, value) {
		var PARAM = 0x02;
		var WRITE_CHANNEL = 2;
		var header = ((0x02 & 0x0f) << 4 | 3 << 2 |(2 & 0x03));
		var format = '<BB' + type;
		var data = bufferpack.pack(format, [header, ident, value]);
		this.characteristic.write(data, false);
	};





	////////////////////////
	// Convenience Functions
	////////////////////////

	/*
	Function: 	Send Roll

	Params: 	Roll - Number

	Returns: 	None

	Description:
				Sends the specified roll movement component value to the CrazyFlie
	*/
	this.sendRoll = function(roll) {
		this.sendAll(roll, 0, 0, 0);
	};

	/*
	Function: 	Send Pitch

	Params: 	Pitch - Number

	Returns: 	None

	Description:
				Sends the specified pitch movement component value to the CrazyFlie
	*/
	this.sendPitch = function(pitch) {
		this.sendAll(0, pitch, 0, 0);
	};

	/*
	Function: 	Send Yaw

	Params: 	Yaw - Number

	Returns: 	None

	Description:
				Sends the specified yaw movement component value to the CrazyFlie
	*/
	this.sendYaw = function(yaw) {
		this.sendAll(0, 0, yaw, 0);
	};

	/*
	Function: 	Send Thrust

	Params: 	Thrust - Number

	Returns: 	None

	Description:
				Sends the specified thrust movement component value to the CrazyFlie
	*/
	this.sendThrust = function(thrust) {
		this.sendAll(0, 0, 0, thrust);
	};
}

module.exports.Crazyflie = Crazyflie;

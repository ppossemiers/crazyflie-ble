var noble = require('noble');
var bufferpack = require('bufferpack');

function CrazyFlie(callback) {
	var service_uuid = ['000002011c7f4f9e947b43b7c00a9a08'];
	var characteristic_uuid = ['000002021c7f4f9e947b43b7c00a9a08'];
	var cf = this;
	this.connected = false;
	this.callback = callback;
	this.peripheral = '';
	this.service = '';
	this.characteristic = '';

	noble.on('stateChange', function(state) {
  		if(state === 'poweredOn') {
   		 	noble.startScanning();
  		} else {
    		noble.stopScanning();
  		}
	});

	noble.on('discover', function(peripheral) {
  		if(peripheral.advertisement.localName === 'Crazyflie'){
    		noble.stopScanning();
    		cf.peripheral = peripheral;
    		console.log('Crazyflie with UUID ' + peripheral.uuid + ' found');
    		//console.log('RSSI : ' + peripheral.rssi);

    		cf.peripheral.on('disconnect', function() { process.exit(0); });
  			
  			cf.peripheral.on('rssiUpdate', function() { console.log(peripheral.rssi); });
  	
  			cf.peripheral.connect(function(error) {
  				if(error) {
  					console.log(error);
  					process.exit(0);
  				}
  				else {
  					cf.connected = true;
  					console.log('Connected to Crazyflie');
					cf.peripheral.discoverServices(service_uuid, function(error, services) {
  						cf.service = services[0];
  						cf.service.discoverCharacteristics(characteristic_uuid, function(error, characteristics) {						
  							cf.characteristic = characteristics[0];
          					cf.callback();
  						});
  					});
  				}
			});
  		}
	});
	
	this.call_scripts = function() {
		for(i = 0; i < cf.scripts.length; i++) {
        	this.scripts[i].call(this);
        }
	}
	
	this.send_setpoint = function(roll, pitch, yaw, thrust) {
		var data = bufferpack.pack('<BfffH', [0x30, roll, pitch, yaw, thrust]);
		console.log(this.peripheral.rssi);
		this.characteristic.write(data, false);
	}
	
	this.send_param = function(ident, type, value) {
		var PARAM = 0x02;
		var WRITE_CHANNEL = 2;
		var header = ((0x02 & 0x0f) << 4 | 3 << 2 |(2 & 0x03));
		var format = '<BB' + type;
		var data = bufferpack.pack(format, [header, ident, value]);
		this.characteristic.write(data, false);
	}
}

var cf = new CrazyFlie(main);
//cf.scripts.push(hover);

function main() {
	// simpel hover
	cf.send_setpoint(0, 0, 0, 0);
	for(i = 0; i < 2; i++) {
		cf.send_setpoint(0, 0, 0, 39000);
	}
	cf.send_param(11, 'b', 1);
	while(1) {
		cf.send_setpoint(0, 0, 0, 32767);
	}
}




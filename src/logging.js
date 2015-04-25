function Logging(crazyflie){
	var ttime;

	this.startTelemetry = function()
	{
		console.log('starting telemetry');
		ttime = Date.now();
		var self = this;
		this.telemetryDeferred = P.defer();

		var packet = new Crazypacket();
		packet.port = Protocol.Ports.LOGGING;
		packet.channel = Protocol.Channels.SETTINGS;
		packet.writeByte(Protocol.Commands.RESET_LOGGING);
		packet.endPacket();

		this.radio.sendPacket(packet)
		.then(function()
		{
			self.requestTOC(Protocol.Ports.LOGGING);
		});

		return this.telemetryDeferred.promise;
	};

	this.telemetryReady = function()
	{
		console.log('telemetry ready; elapsed=', (Date.now() - ttime));
		if (!this.telemetryDeferred) return;
		this.telemetryDeferred.resolve('OK');
		this.telemetryDeferred = undefined;
	};

	// ---------------------
	// now the heavy lifting

	this.requestTOC = function(which)
	{
		var packet = new Crazypacket();
		packet.port = which;
		packet.channel = Protocol.Channels.TOC;
		packet.writeByte(Protocol.Commands.GET_INFO);
		packet.endPacket();

		return this.radio.sendPacket(packet);
	};

	// request details about a specific parameter or telemetry item

	this.requestTelemetryElement = function(id)
	{
		return this.requestTOCItem(Protocol.Ports.LOGGING, id);
	};

	this.requestParameter = function(id)
	{
		return this.requestTOCItem(Protocol.Ports.PARAM, id);
	};

	this.requestTOCItem = function(port, id)
	{
		var packet = new Crazypacket();
		packet.port = port;
		packet.channel = Protocol.Channels.TOC;
		packet.writeByte(Protocol.Commands.GET_ELEMENT);
		if (id)
			packet.writeByte(id);
		packet.endPacket();

		return this.radio.sendPacket(packet);
	};

	// Create a telemetry block, aka a group of sensor readings that
	// get emitted by the copter periodically.

	this.createTelemetryBlock = function(block)
	{
		var packet = new Crazypacket();
		packet.port = Protocol.Ports.LOGGING;
		packet.channel = Protocol.Channels.SETTINGS;
		packet.writeByte(Protocol.Commands.CREATE_BLOCK)
			.writeByte(block.id);

		for (var i = 0; i < block.variables.length; i++)
		{
			var item = block.variables[i];
			packet.writeByte(item.type << 4 | item.fetchAs)
				.writeByte(item.id);
		}

		packet.endPacket();
		return this.radio.sendPacket(packet);
	};

	this.enableTelemetryBlock = function(block)
	{
		var packet = new Crazypacket();
		packet.port = Protocol.Ports.LOGGING;
		packet.channel = Protocol.Channels.SETTINGS;
		packet.writeByte(Protocol.Commands.START_LOGGING)
			.writeByte(block)
			.writeByte(10) // period
			.endPacket();

		return this.radio.sendPacket(packet);
	};

	this.handleAck = function(buf)
	{
		// TODO record ack stats-- dropped packets etc
		var ack = new Crazypacket.RadioAck(buf);
		return P(ack);
	};
}

module.exports.Logging = Logging;



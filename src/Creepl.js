var repl = require('repl')
var net = require('net')

var Creepl = function(){};

Creepl.prototype.startREPL =function(){
	this.startREPLServer();
	this.startREPLClient();
};

Creepl.prototype.startREPLServer = function() {
	net.createServer(function (socket) {
		var r = repl.start({
		      prompt: 'Creeper O_o:'
		    , input: socket
		    , output: socket
		    , terminal: true
		    , useGlobal: false
		    , eval: Creepl.prototype.customEval
		    })
		    r.on('exit', function () {
		      socket.end()
		    })
		    r.context.socket = socket
	}).listen(1337)
};

Creepl.prototype.startREPLClient = function(){

	var sock = net.connect(1337)
	 
	process.stdin.pipe(sock)
	sock.pipe(process.stdout)
	 
	sock.on('connect', function () {
	  process.stdin.resume();
	  process.stdin.setRawMode(true)
	})
	 
	sock.on('close', function done () {
	  process.stdin.setRawMode(false)
	  process.stdin.pause()
	  sock.removeListener('close', done)
	})
	 
	process.stdin.on('end', function () {
	  sock.destroy()
	  console.log()
	})
};

Creepl.prototype.customEval = function(inCmd, context, filename, callback){
  var processed, result, cmd;
  result = 'Unknown Command';
  processed = Creepl.prototype.processCmd(inCmd);
  cmd = processed.cmd.toLowerCase().replace(/\t| /g, '');
  if(cmd == 'creepon'){
  	result = Creepl.prototype.creepOn(processed.args);
  }
  else if(cmd == 'stopcreepingon'){
  	result = Creepl.prototype.stopCreepingOn(processed.args);
  }
  else if(cmd == 'creeps'){
  	result = Creepl.prototype.creeps(processed.args);
  }
  callback(null, result);
};

Creepl.prototype.processCmd = function(cmd) {
	var fullcommand, processed;
	cmd = cmd.slice(1, cmd.length -1);
	cmd = cmd.slice(0, cmd.length - 1);
	fullcommand = cmd.split(" ");
	processed = {'cmd': fullcommand[0], 'args': fullcommand.slice(1)};
	return processed;
};

Creepl.prototype.creepOn = function(args) {
	// body...
	// 
	return 'Creeping on ' + args[0] + '...';
};

Creepl.prototype.stopCreepingOn = function(args) {
	// body...
	// 
	return 'Done creeping on ' + args[0] + '...';
};

Creepl.prototype.creeps = function(args) {
	// body...
	// list all of the mappings of files being creeped on 
	// and their command files
};

var c = new Creepl().startREPL();
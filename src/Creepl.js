var exec = require( 'child_process' ).exec,
	repl = require('repl'),
	net = require('net'),
	colors = require('colors'),
	Bookie = require('./Bookie.js').constr,
	bookie = new Bookie();

var bashCommands = ['clear', 'ls', 'pwd', 'cd', 'mkdir', 'rmdir', 'rm', 'mv', 'cd'];

var Creepl = function(){};

Creepl.prototype.logo = ' \n \
_________                                               __         \n \
\\_   ___ _______  ____  ____ ______   ___________      |__| ______ \n \
/    \\  \\\\_  __ _/ __ _/ __ \\\\____ \\_/ __ \\_  __ \\     |  |/  ___/ \n \
\\     \\___|  |  \\\  ___\\  ___/|  |_> \\  ___/|  | \\/     |  |\\___ \\  \n \
 \\______  |__|   \\___  \\___  |   __/ \\___  |__| /\\ /\\__|  /____  > \n \
        \\/           \\/    \\/|__|        \\/     \\/ \\______|    \\/ \n \
---------------------------------------------------------------------\n\n';

Creepl.prototype.startREPL = function(){
	console.log(Creepl.prototype.logo);
	this.startREPLServer();
	this.startREPLClient();
};

Creepl.prototype.startREPLServer = function() {
	net.createServer(function (socket) {
		var r = repl.start({
		      prompt: null
		    , input: socket
		    , output: socket
		    , terminal: true
		    , useGlobal: false
		    ,ignoreUndefined : true
		    , eval: Creepl.prototype.customEval
		    })
		    r.on('exit', function () {
		      socket.end()
		    })
		    r.context.socket = socket
		  /*var _complete = repl.complete
			repl.complete = function(line) {
				//implement own complete
			  _complete.apply(this, arguments)
			}*/
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

	/* MAY BE ABLE TO USE THIS FOR AUTOCOMPLETE OF COMMANDS*/
	process.stdin.on('data', function (b) {
	  if((b + '') === '\t'){
	  	//console.log('You just tabbed :)');
	  	process.stdout.write('\u001B[0K\u001B[100D');
	  }
	})
};

Creepl.prototype.customEval = function(inCmd, context, filename, callback){
  var processed, result, cmd;
  result = 'Unknown Command';
  processed = Creepl.prototype.processCmd(inCmd);
  cmd = processed.cmd.toLowerCase().replace(/\t| /g, '');
  if(cmd == 'creepon'){
  	result = '';
  	console.log('\n' + Creepl.prototype.creepOn(processed.args));
  }
  else if(cmd == 'stopcreepingon'){
  	result = '';
  	console.log('\n' + Creepl.prototype.stopCreepingOn(processed.args));
  }
  else if(cmd == 'creeps'){
  	result = '';
  	Creepl.prototype.creeps();
  }
  else if(Creepl.prototype.isBashCmd(cmd)){
  	cmd += ' ' + processed.args.join(' ');
  	exec(cmd, function(err, stdout, stderr){
  		console.log('\n')
  		console.log(err || stdout || stderr);
  	});
  	result = '';
  }
  else if(cmd === 'logo'){
  	console.log(Creepl.prototype.logo);
  	result = '';
  }
  callback();
};

Creepl.prototype.isBashCmd = function(cmd){
	for(var i = 0; i < bashCommands.length; i++){
		if(bashCommands[i] === cmd){
			return true;
		}
	}
	return false;
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
	bookie.watch(args[0], args[1]);
	return 'Creeping on ' + args[0].cyan + '...';
};

Creepl.prototype.stopCreepingOn = function(args) {
	bookie.unWatch(args[0]);
	return 'Done creeping on ' + args[0].cyan + '...';
};

Creepl.prototype.creeps = function() {
	console.log(bookie.getMapping());
};

var c = new Creepl().startREPL();


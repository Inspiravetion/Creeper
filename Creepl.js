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

Creepl.prototype.customEval = function(cmd, context, filename, callback){
  var result = "this is the result";
  console.log('Command: ' + cmd );
  console.log('Context: ' + context);
  console.log('filename: ' + filename);

  callback(null, result);
};

var c = new Creepl().startREPL();
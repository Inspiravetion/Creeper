var repl = require('repl')
var net = require('net')
 
net.createServer(function (socket) {
  var r = repl.start({
      prompt: 'Creeper O_o:'
    , input: socket
    , output: socket
    , terminal: true
    , useGlobal: false
    , eval: customEval
  })
  r.on('exit', function () {
    socket.end()
  })
  r.context.socket = socket
}).listen(1337)

function customEval(cmd, context, filename, callback){
  var result = "this is the result";
  console.log('Command: ' + cmd );
  console.log('Context: ' + context);
  console.log('filename: ' + filename);

  callback(null, result);
}
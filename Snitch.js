var exec = require( 'child_process' ).exec;

function Snitch(){
	this.process = exec('node-osx-notifier');
};

Snitch.prototype.dipset = function(){
	this.process.kill();
};

Snitch.prototype.snitch = function(type, msg){
    var beginning = 'curl -H "Content-Type: application/json" -X POST -d ',
    json          = "'{" + '"message": "' + msg + '"}' + "' ",
    domain        = '"http://localhost:1337/' + type + '"';
    exec(beginning + json + domain);
};

Snitch.prototype.info = function(msg) {
    Snitch.prototype.snitch('info', msg);
};

Snitch.prototype.pass = function(msg) {
    Snitch.prototype.snitch('pass', msg);
};

Snitch.prototype.fail = function(msg) {
    Snitch.prototype.snitch('fail', msg);
};

exports.Snitch = Snitch;
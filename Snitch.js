var exec = require( 'child_process' ).exec;

function Snitch(){
	this._process   = exec('node-osx-notifier');
	this._taddles   = [];
	this._offset    = 0;
	this._stallTime = 5000;
	this._running   = false;
};

Snitch.prototype.dipset = function(){
	this._process.kill();
};

Snitch.prototype.snitch = function(){
	if(!this._running){
		this._running = true;
		this.snitchHelper(this._taddles[this._offset]);
	}
};

Snitch.prototype.info = function(msg) {
	this.addTaddle(new Taddle('info', msg));
    this.snitch();
};

Snitch.prototype.pass = function(msg) {
    this.addTaddle(new Taddle('pass', msg));
    this.snitch();
};

Snitch.prototype.fail = function(msg) {
    this.addTaddle(new Taddle('fail', msg));
    this.snitch();
};

Snitch.prototype.addTaddle = function(taddle) {
	this._taddles.push(taddle);
};

Snitch.prototype.snitchHelper = function(taddle) {
	console.log('SnitchHelper got called:' + this._taddles);
	var self = this;
	self.sendTaddle(taddle);
	setTimeout(function(){
		console.log('FROM TIMEOUT: ' + self.isDone);
		if(!self.isDone()){
			self.snitchHelper(self._taddles[self._offset])
		}else{
			self._running = false;
		}
	}, self._stallTime);
};

Snitch.prototype.sendTaddle = function(taddle) {
	var beginning = 'curl -H "Content-Type: application/json" -X POST -d ',
    json          = "'{" + '"message": "' + taddle._msg + '"}' + "' ",
    domain        = '"http://localhost:1337/' + taddle._type + '"';
    exec(beginning + json + domain);
    this._offset++;
    console.log('\nTADDLE SENT\nOFFSET: ' + this._offset);
};

Snitch.prototype.isDone = function() {
	return this._offset == this._taddles.length;
};

//Taddle Object
 function Taddle(type, msg){
 	this._type = type;
 	this._msg  = msg;
 };

exports.Snitch = new Snitch();


var Sifter = function() {
	this.regEx_ = '';
	this.any_ = false;
}

Sifter.prototype.startsWith = function(start) {
	//need to escape special chars here
	this.regEx_ = start + this.regEx_;
	return this;
};

Sifter.prototype.endsWith = function(end) {
	// need to escape special chars here
	this.regEx_ += end;
	return this;
};

Sifter.prototype.captures = function(captureFunc) {
	this.regEx_ += '(';
	captureFunc(this)
	this.regEx_ += ')';
	return this;
};

Sifter.prototype.any = function() {
	this.any_ = true;
	return this;
};

Sifter.prototype.alphaNumeric = function() {
	this.regEx_ += '[A-Za-z0-9]';
	if(this.any_){
		this.regEx_ += '*';
	}
	return this;
};

var escapeIfNecessary = function (string){
	//HAVE TO FIGURE OUT HOW TO  HAVE SINGLE \!!!
	return string.replace(/([^\w\s])/g, '\\' + '$1');
};


var commandRegEx = new Sifter()
	.startsWith('{')
	.captures(function(sifter){
		sifter
		.any()
		.alphaNumeric();
	})
	.endsWith('}');

console.log(commandRegEx);
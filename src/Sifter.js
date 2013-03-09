
//Object Declaration 
var Sifter = function() {
	this.regEx_ = '';
	this.flags_ = '';
	this.infinite_ = null;
	this.atLeastOne_ = null;
	this.zeroOrOne_ = null;
}

//Loose Navigation
Sifter.prototype.startsWith = function(exp) {
	if(typeof exp === 'function'){
		this.regEx_ = exp(this) + this.regEx_;
		return this;
	}
	else if(typeof exp === 'string'){
		this.regEx_ = escape_(exp) + this.regEx_;
		return this;
	}
	throw 'startsWith() arguments must be of type "string" or "function".';
};

Sifter.prototype.endsWith = function(exp) {
	if(typeof exp === 'function'){
		this.regEx_ += exp(this);
		return this;
	}
	else if(typeof exp === 'string'){
		this.regEx_ += escape_(exp);
		return this;
	}
	throw 'endsWith() arguments must be of type "string" or "function".';
};

Sifter.prototype.then = function(exp) {
	if(typeof exp === 'function'){
		this.regEx_ += exp(this);
		return this;
	}
	else if(typeof exp === 'string'){
		this.regEx_ += escape_(exp);
		return this;
	}
	throw 'then() arguments must be of type "string" or "function".';
};

//Strict Navigation
Sifter.prototype.startsLineWith = function(exp) {
	if(typeof exp === 'function'){
		this.regEx_ = '^' + exp(this);
		return this;
	}
	else if(typeof exp === 'string'){
		this.regEx_ = '^' + escape_(exp);
		return this;
	}
	throw 'startsLineWith() arguments must be of type "string" or "function".';
};

Sifter.prototype.endsLineWith = function(exp) {
	if(typeof exp === 'function'){
		this.regEx_ += exp(this) + '$';
		return this;
	}
	else if(typeof exp === 'string'){
		this.regEx_ += escape_(exp) + '$';
		return this;
	}
	throw 'endsLineWith() arguments must be of type "string" or "function".';
};

// Grouping
Sifter.prototype.captures = function(expFunc) {
	if(typeof expFunc !== 'function'){
		throw 'captures() arguments must be of type "function".';
	}
	this.regEx_ += '(';
	expFunc(this)
	this.regEx_ += ')';
	quantify(this);
	return this;
};

Sifter.prototype.groups = function(exp) {
	if(typeof exp === 'function'){
		this.regEx_ += '(?:' + exp(this) + ')';
		quantify(this);
		return this;
	}
	else if(typeof exp === 'string'){
		this.regEx_ += '(?:' + escape_(exp) + ')';
		quantify(this);
		return this;
	}
	throw 'groups() arguments must be of type "string" or "function".';
};

//Doesnt need to quantify because of its groups() call
Sifter.prototype.either = function(expArr) {
	if(typeof expArr !== 'array'){
		throw 'either() argument must be of type "array".';
	}
	var orExpressions;
	orExpressions = either(expArr, 0);
	for(var i = 1; i < expArr.length; i++){
		orExpressions += '|' + either_(expArr, i);
	}
	this.prototype.groups(orExpressions);
	return this;
};

//Quantifiers
Sifter.prototype.infinite = function() {
	this.infinite_ = '*';
	return this;
};

Sifter.prototype.atLeastOne = function() {
	this.atLeastOne_ = '+';
	return this;
};

Sifter.prototype.zeroOrOne = function() {
	this.zeroOrOne_ = '+';
	return this;
};

//Character sets (NEED TO INCORPORATE QUANTIFIEERS INTO THIS)
Sifter.prototype.anyThing = function() {
	this.regEx_ += '.*';
};

Sifter.prototype.alphaNumeric = function() {
	this.regEx_ += '[A-Za-z0-9]';
	quantify(this);
	return this;
};

//Flags (make sure peope dont call these on any nested functions...
//shoud only be specified on the outtermost chain)
Sifter.prototype.isGlobal = function() {
	this.flags_ += 'g';
};

Sifter.prototype.ignoresCase = function() {
	this.flags_ += 'i';
};

Sifter.prototype.isMultiline = function() {
	this.flags_ += 'm';
};

//Sifter Object Functions
Sifter.prototype.match = function(string) {
	return new RegExp(this.regEx_, this.flags_).exec(string);
};

//Syntactic Helpers
Sifter.prototype.and = function() {
	return this;
};

//Internal Helpers (do not export)
function escape_(string) {
    return string
    	.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    	.replace(/\$/g, '$$$$');
}

function either_(expArr, index){
	if(typeof expArr[index] === 'function'){
		return = resolveExp(expArr[index]);
	} 
	else if(typeof expArr[index] === 'string'){
		return = expArr[index];
	}
	else{
		throw 'either() array argument must contain only values of type "strings" or "function".';
	}
};

function resolveExp(func){
var scope = new Sifter();
	func(scope);
	return scope.regEx_;
};

function quantify(sifter){
	if(sifter.infinite_){
		sifter.regEx_ += sifter.infinite_;
		sifter.infinite_ = null;
	}
	else if(sifter.atLeastOne_){
		sifter.regEx_ += sifter.atLeastOne_;
		sifter.atLeastOne_ = null;
	}
	else if(sifter.zeroOrOne_){
		sifter.regEx_ += sifter.zeroOrOne_;
		sifter.zeroOrOne_ = null;
	}
}

//Syntax========================================================================

var baseCommand = new Sifter()
	.startsWith('{')
	.captures(function(@){
		@
		.infinite()
		.alphaNumeric();
	})
	.endsWith('}');
	

console.log(commandRegEx.exec('{command1}'));

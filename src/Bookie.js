var fs     = require('fs'),
	colors = require('colors'),
	grunt  = require('./Grunt.js').instance(),
	interp = require('./Interpreter.js').instance,
	toggle = true;

var Bookie = function(){
	this.registry_ = {};
};

Bookie.prototype.watch = function(file, cmdFile) {
	var commands, watcher;
	commands = interp.interpret(fs.readFileSync(cmdFile, 'utf8'));
	watcher  = fs.watch( file, function( evt, filename ) { 
	    if(toggle === true){
	        grunt.doWorkSon(commands, 0);
	        toggle = false;
	    }else{
	        toggle = true;
	    }
	}); 
	if(!this.registry_[file]){
		this.registry_[file] = {'commandFile' : cmdFile, 'watcher' : watcher};
	}
};

Bookie.prototype.unWatch = function(fileName) {
	if(this.registry_.hasOwnProperty(fileName)){
		this.registry_[fileName].watcher.close();
		delete this.registry_[fileName];
		return true;
	}
	return false;
};

Bookie.prototype.getMapping = function() {
	var outString = '\n\nFiles Currently Being Creeped On:\n',
	count = 1;
	outString += '-------------------------------------------------------\n';
	for(prop in this.registry_){
		outString += '\n' + count + '. File: ' + prop.cyan + '  ==>  CommandFile: ' + this.registry_[prop].commandFile.cyan;
		count++;
	}
	return outString
};

exports.constr = Bookie;
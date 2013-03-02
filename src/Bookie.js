var fs     = require('fs'),
	colors = require('colors'),
	grunt  = require('./Grunt.js').instance(),
	interp = require('./Interpreter.js').instance,
	toggle = true;

var Bookie = function(){
	this.registry_ = {};
};

Bookie.prototype.watch = function(file, cmdFile) {
	var commands, watcher, stat, subFiles;
	commands = interp.interpret(fs.readFileSync(cmdFile, 'utf8'));
	stat = fs.statSync(file);
	if(stat.isFile()){
		watcher = this.watch_(file, commands);
		if(!this.registry_[file]){
			this.registry_[file] = {'commandFile' : cmdFile, 'watcher' : watcher};
		}
	}
	else{
		subFiles = fs.readdirSync(file);
		for(var i = 0; i < subFiles.length; i++){
			watcher = this.watch_(subFiles[i], commands);
			if(!this.registry_[subFiles[i]]){
				this.registry_[subFiles[i]] = {'commandFile' : cmdFile, 'watcher' : watcher};
			}
		}
	}
};

Bookie.prototype.watch_ = function(file, commands) {
	var watcher = fs.watch( file, function( evt, filename ) { 
	    if(toggle === true){
	        grunt.doWorkSon(commands, 0);
	        toggle = false;
	    }else{
	        toggle = true;
	    }
	}); 
	return watcher;
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
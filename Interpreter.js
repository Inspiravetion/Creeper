/**
 * Interpreter.js
 * 1. figure out what control logic should be supported
 * 2. decide on syntax
 * 3. implement
 */

/**
 * Control Logic
 * 1. ways to test if a command did not bare the results it should have
 * 2. notification if a process dies or logs an error
 * 3. branch logic based off of the results of 1
 * 4. have a command block so that a group of commands can be treated as one
 */

/**
 * Syntax
 * 1. Basic command: 
 * {echo this is some command}
 * 
 * 2. Notify on die/error: 
 * {echo this is some command}!
 * 
 * 3. Compare stndout to given string and notify you of result: 
 * {echo this is some command}(this is some command) 
 * 
 * 4. Compare stndout of one command to stndout of another and notify you of result: 
 * {echo this is some command}{echo compare him to me}
 * 
 * 5. If true logic for commands: 
 * {{echo if this}{echo matches this then}}{
 * 		echo then run this command
 * 		echo and this commmand
 * 		echo and this command
 * }
 * 6. If false logic for commands: 
 * !{{echo if this}{echo matches this then}}{
 * 		echo then run this command
 * 		echo and this commmand
 * 		echo and this command
 * }
 * 4. If else logic for commands: 
 * {{echo if this}{echo matches this then}}{
 * 		echo then run this command
 * }{
 * 		echo else then run this command
 * 		echo and this commmand
 * }
 * 5.CommandBlock(can take the place of any singular command)
 * {echo command 1;echo command 2;echo command 3}
 * OR
 * {
 * 		echo command 1
 * 	 	echo command 2
 * 	  	echo command 3
 * }
 */

var Command = require(./Command.js);

var Interpreter = function(){};

Interpreter.prototype.interpret = function(stringCmdFile) {
	var cmds = stringCmdFile.split('\n\n');
	for(string in cmds){
		this.strip(cmds[string]);
	}
};

Interpreter.prototype.strip = function(strCmd) {
	if(strCmd.startsWith('!{{')){

	}
	else if(strCmd.startsWith('{{')){

	}
	else if(strCmd.startsWith('{')){
		this.resolveCommandBlock(strCmd);
	}
	else{
		throw new Error('Command file contains invalid commands.');
	}
};

Interpreter.prototype.resolveCommandBlock = function(strCmd){
	var resolvedCmd = '';
	resolvedCmd     = strCmd.replace(/;/g, '\n');
	resolvedCmd     = resolvedCmd.replace(/\{|\}/g, '');
	return resolveCommandBlock;
};

exports = Interpreter;


























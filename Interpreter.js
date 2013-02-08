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
 * THE SECOND COMPARE PARAM FOR ANY OF THESE CAN BE (I AM A STRING LITERAL) 
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

String.prototype.startsWith = function(str){
	var comp = this.substr(0, str.length);
	return comp === str;
};

var Command = require('./Command.js').constructor,
	fs      = require('fs'); //dont need this other than for testing

var Interpreter = function(){};

Interpreter.prototype.interpret = function(stringCmdFile) {
	var cmds, cmdlist;
	cmdlist = [];
	cmds = stringCmdFile.split('\n\n');
	console.log(cmds);
	for(string in cmds){
		cmdlist.push(this.strip(cmds[string]));
	}
	console.log(cmdlist);
};

Interpreter.prototype.strip = function(strCmd) {
	if(strCmd.startsWith('!{{')){
		return this.resolveControlLogic(strCmd.substr(1), false);
	}
	else if(strCmd.startsWith('{{')){
		return this.resolveControlLogic(strCmd, true);
	}
	else if(strCmd.startsWith('{')){
		var stripped;
		if((stripped = strCmd.split('}{')).length > 1){
			return this.createNotifCmdCmd(stripped[0],stripped[1]);
		}
		else if((stripped = strCmd.split('}(')).length > 1){
			return this.createNotifStrCmd(stripped[0], stripped[1]);
		}
		else if((stripped = strCmd.split('!')).length > 1){
			return this.createNotifErrCmd(this.resolveCommandBlock(stripped[0]));
		}   
		else{
			return this.createBasicCmd(this.resolveCommandBlock(strCmd));
		}
	}
	else{
		throw new Error('Command file contains invalid commands.');
	}
};

Interpreter.prototype.resolveCommandBlock = function(strCmd){
	if(!strCmd){
		return;
	}
	var resolvedCmd = '';
	resolvedCmd     = strCmd.replace(/;/g, '\n');
	resolvedCmd     = resolvedCmd.replace(/\{|\}/g, '');
	return resolvedCmd;
};

Interpreter.prototype.resolveControlLogic = function(strCmd, pos){
	var stripped, condition, cmds, ifCmds, elseCmds, cmd1, cmd2;
		stripped  = strCmd.split('}}');
		condition = stripped[0].split('}{');
		cmd1      = this.resolveCommandBlock(condition[0]);
		cmd2      = this.resolveCommandBlock(condition[1]);
		cmds      = stripped[1].split('}{');
		ifCmds    = this.resolveCommandBlock(cmds[0]);
		elseCmds  = this.resolveCommandBlock(cmds[1]);
		return this.createCtrlLogiCmd(cmd1, cmd2, ifCmds, elseCmds, pos);
};

Interpreter.prototype.createBasicCmd = function(strCmd){
	var cmdObj         = new Command();
	cmdObj.baseCommand = strCmd;
	return cmdObj;
};

Interpreter.prototype.createNotifErrCmd = function(strCmd){
	var cmdObj         = new Command();
	cmdObj.baseCommand = strCmd;
	cmdObj.notifOnErr  = true;
	return cmdObj;
};

Interpreter.prototype.createNotifStrCmd = function(cmd, str) {
	var cmdObj         = new Command();
	cmdObj.baseCommand = cmd.replace('{', '');
	cmdObj.compString  = str.replace(')', '');
	return cmdObj;
};

Interpreter.prototype.createNotifCmdCmd = function(cmd1, cmd2) {
	var cmdObj         = new Command();
	cmdObj.baseCommand = cmd1.replace('{', '');
	cmdObj.compCommand = cmd2.replace('}', '');
	return cmdObj;
};

Interpreter.prototype.createCtrlLogiCmd = function(cmd1, cmd2, ifCmd, elseCmd, pos){
	var cmdObj = new Command();
	cmdObj.baseCommand  = cmd1;
	cmdObj.compCommand  = cmd2;
	if(pos){
		cmdObj.trueCommand  = ifCmd || null;
		cmdObj.falseCommand = elseCmd || null;
		return cmdObj;
	}
	cmdObj.falseCommand = ifCmd || null;
	return cmdObj;
};
//exports = Interpreter;

var interpreter = new Interpreter();
interpreter.interpret(fs.readFileSync('./cmd.txt', 'utf8'));


/*
still have to implement the control logic stuff with pure strings too
 */






















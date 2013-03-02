String.prototype.startsWith = function(str){
	var comp = this.substr(0, str.length);
	return comp === str;
};

String.prototype.endsWith = function(str) {
	var comp = this.substr(this.length-str.length, this.length);
	return comp === str;
};

var Command = require('./Command.js').constructor;

var Interpreter = function(){};

Interpreter.prototype.interpret = function(stringCmdFile) {
	var cmds, cmdlist;
	cmdlist = [];
	cmds = stringCmdFile.split('\n\n');
	for(string in cmds){
		cmdlist.push(this.strip(cmds[string]));
	}
	return cmdlist;
};


Interpreter.prototype.strip = function(strCmd) {
	strCmd = strCmd.trim();
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
			var processedStringComp, conditions, containsFlag;
			if(stripped[1].endsWith(')')){
				stripped[1] = stripped[1].substr(0,stripped[1].length - 1);
			}
			processedStringComp = this.resolveStringCompType(stripped);
			conditions = processedStringComp.conditions;
			containsFlag = processedStringComp.containsFlag;
			return this.createNotifStrCmd(conditions[0], conditions[1], containsFlag);
		}
		else if((stripped = strCmd.split('!')).length > 1){
			return this.createNotifErrCmd(this.resolveCommandBlock(stripped[0]));
		}   
		else if(strCmd.endsWith('}')){
			return this.createBasicCmd(this.resolveCommandBlock(strCmd));
		}
	}
	throw new Error('Command file contains invalid command: ' + strCmd);
};

Interpreter.prototype.resolveCommandBlock = function(strCmd){
	if(!strCmd){
		return;
	}
	strCmd = strCmd.replace(/\{|\}/g, '').trim().split(';');
	for(var i = 0; i < strCmd.length; i++){
		var solo = (i == 0 && strCmd.length == 1);
		if((i == 0 && !solo) || (i > 0 && i != strCmd.length -1)){
			strCmd[i] = strCmd[i].trim() + '\n';
		}
		else{
			strCmd[i] = strCmd[i].trim();
		}
	}
	return strCmd.join('');
};

Interpreter.prototype.resolveControlLogic = function(strCmd, pos){
	var stripped, condition, cmds, ifCmds, elseCmds, cmd1, cmd2, stringComp, processedStringComp, stringCont;
		if ((stripped  = strCmd.split('}}')).length > 1){
			condition = stripped[0].split('}{');
			stringComp = false;
		}
		else{
			stripped  = strCmd.split(')}');
			processedStringComp = this.resolveStringCompType(stripped[0].split('}('));
			condition = processedStringComp.conditions;
			stringCont = processedStringComp.containsFlag;
			stringComp = true;
		}
		cmd1      = this.resolveCommandBlock(condition[0]);
		cmd2      = this.resolveCommandBlock(condition[1]);
		cmds      = stripped[1].split('}{');
		ifCmds    = this.resolveCommandBlock(cmds[0]);
		elseCmds  = this.resolveCommandBlock(cmds[1]);
		return this.createCtrlLogiCmd(cmd1, cmd2, ifCmds, elseCmds, pos, stringComp, stringCont);
};

Interpreter.prototype.resolveStringCompType = function(compArr) {
	var flag, initString;
	initString = compArr[1];
	compArr[1] = initString.replace(/\(|\)/g, '');
	flag       = initString.length == compArr[1].length ? false : true;
	return {'conditions' : compArr, 'containsFlag' : flag};
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

Interpreter.prototype.createNotifStrCmd = function(cmd, str, stringCont) {
	var cmdObj         = new Command();
	cmdObj.baseCommand = cmd.replace('{', '');
	cmdObj.compString  = str.replace(')', '');
	if(stringCont){
		cmdObj.containsFlag = true;
	}
	return cmdObj;
};

Interpreter.prototype.createNotifCmdCmd = function(cmd1, cmd2) {
	var cmdObj         = new Command();
	cmdObj.baseCommand = cmd1.replace('{', '');
	cmdObj.compCommand = cmd2.replace('}', '');
	return cmdObj;
};

Interpreter.prototype.createCtrlLogiCmd = function(cmd1, cmd2, ifCmd, elseCmd, pos, stringComp, stringCont){
	var cmdObj = new Command();
	cmdObj.baseCommand  = cmd1;
	if(stringComp){
		cmdObj.compString = cmd2;
		if(stringCont){
			cmdObj.containsFlag = true;
		}
	}
	else{
		cmdObj.compCommand  = cmd2;
	}
	if(pos){
		cmdObj.trueCommand  = ifCmd || null;
		cmdObj.falseCommand = elseCmd || null;
		return cmdObj;
	}
	cmdObj.falseCommand = ifCmd || null;
	return cmdObj;
};

exports.instance = new Interpreter();

exports.constr = Interpreter;






















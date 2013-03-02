var Interpreter = require('../src/Interpreter.js').constr
	interp = new Interpreter(),
	cmds = {
		negCmdComp : '!{{command1}{command2}}',
		posCmdComp : '{{command1}{command2}}',
		baseCmd    : '{command1}',
		posNotiCmd : '{command1}{command2}',
		notiOnErr  : '{command1}!',
		stringComp : '{command1}(string1)',
		stringCtrl : '{{command1}(string1)}{\ncommand3\n}',
		stringCont : '{command1}((contString1))',
		ifCmd      : '{{command1}{command2}}{\ncommand3\n}',
		ifElseCmd  : '{{command}{command2}}{\ncommand3\n}{\ncommand4\n}',
		unknownCmd : '{not a real command)',
		singleLnCB : '{command1;command2; command3}'
	};

describe('interpret()', function(){
	it('it breaks up the command file correctly', function(){
		var cmdFile;
		spyOn(interp, 'strip');
		cmdFile = '{command 1}\n\n{command2}((compare string))\n';
		expect(interp.interpret(cmdFile).length).toBe(2);
		expect(interp.strip.calls.length).toBe(2);
	});
});

describe('strip()', function(){
	it('processes negative control logic commands', function(){
		spyOn(interp, 'resolveControlLogic');
		interp.strip(cmds.negCmdComp);
		expect(interp.resolveControlLogic).toHaveBeenCalledWith('{{command1}{command2}}', false);
	});

	it('processes positive control logic commands', function(){
		spyOn(interp, 'resolveControlLogic');
		interp.strip(cmds.posCmdComp);
		expect(interp.resolveControlLogic).toHaveBeenCalledWith('{{command1}{command2}}', true);
	});

	it('processes the basic command', function(){
		spyOn(interp, 'createBasicCmd');
		interp.strip(cmds.baseCmd);
		expect(interp.createBasicCmd).toHaveBeenCalledWith('command1');
	});

	it('processes the notification command', function(){
		spyOn(interp, 'createNotifCmdCmd');
		interp.strip(cmds.posNotiCmd);
		expect(interp.createNotifCmdCmd).toHaveBeenCalledWith('{command1','command2}');
	});

	it('processes the notification on error command', function(){
		spyOn(interp, 'createNotifErrCmd');
		interp.strip(cmds.notiOnErr);
		expect(interp.createNotifErrCmd).toHaveBeenCalledWith('command1');
	});

	it('processes the strict string compare command', function(){
		spyOn(interp, 'createNotifStrCmd');
		interp.strip(cmds.stringComp);
		expect(interp.createNotifStrCmd).toHaveBeenCalledWith('{command1', 'string1', false);
	});

	it('processes the contains string compare command', function(){
		spyOn(interp, 'createNotifStrCmd');
		interp.strip(cmds.stringCont);
		expect(interp.createNotifStrCmd).toHaveBeenCalledWith('{command1', 'contString1', true);		
	});

	it('throws an error on invalid commands', function(){
		expect(function(){interp.strip(cmds.unknownCmd);}).toThrow('Command file contains invalid command: {not a real command)');
	});
});	

describe('resolveCommandBlock()', function(){
	it('handles undefined inputs', function(){
		expect(interp.resolveCommandBlock()).toBeUndefined();
	});

	it('leaves single commands alone', function(){
		expect(interp.resolveCommandBlock(cmds.baseCmd)).toBe('command1');
	});

	it('processes semicolon deliminated commands', function(){
		expect(interp.resolveCommandBlock(cmds.singleLnCB)).toBe('command1\ncommand2\ncommand3');
	});
});

describe('resolveControlLogic()', function(){

	beforeEach(function(){
		spyOn(interp, 'createCtrlLogiCmd');
	});

	it('processes a commandCompCmd correctly', function(){
		interp.resolveControlLogic(cmds.ifCmd, true);
		expect(interp.createCtrlLogiCmd).toHaveBeenCalledWith('command1', 'command2', 'command3', undefined, true, false, undefined);
	});

	it('processes a string compare', function(){
		interp.resolveControlLogic(cmds.stringCtrl, true);
		expect(interp.createCtrlLogiCmd).toHaveBeenCalledWith('command1', 'string1', 'command3', undefined, true, true, false);
	});
});

describe('resolveStringCompType()', function(){
	it('recognise strict string compare', function(){
		var input = [ '' , 'command'];
		expect(interp.resolveStringCompType(input).containsFlag).toBe(false);
	});

	it('recognises string contains', function(){
		var input = ['', 'command)'];
		expect(interp.resolveStringCompType(input).containsFlag).toBe(true);
	});
});
/*
describe('createBasicCmd()', function(){
	var strCmd = 'command';
	expect(interp.createBasicCmd(strCmd).baseCommand).toBe(strCmd);
});

NOT TESTING CREATEOBJ METHODS AS THEY ARE STRAIGHT MAPPING.

*/

































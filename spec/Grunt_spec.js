var Grunt       = require('../src/Grunt.js').constr,
	Command     = require('../src/Command.js').constr,
	grunt       = new Grunt(),
	COMMAND_ONE = 'echo command1',
	COMMAND_TWO = 'echo command2',
	COMMAND_THR = 'echo command3',
	COMMAND_FOU = 'echo command4',
	STRING_ONE  = 'command1',
	STRING_TWO  = 'command2';

describe('run()', function(){

	beforeEach(function(){
		cmd = new Command(); 
	});

	it('handles notifies on errors', function(){
		var blankObj = {};
		grunt.run(blankObj);
		expect(grunt.run).toThrow();
	});
	/*
	stopping testing here until i can figure out how to test asynchronously.
	 
	it('Handles if else logic', function(){
		spyOn(grunt, 'ifLogic');
		cmd.baseCommand  = COMMAND_ONE;
		cmd.compCommand  = COMMAND_TWO;
		cmd.trueCommand  = COMMAND_THR;
		cmd.falseCommand = COMMAND_FOU;
		console.log('\n\n\n');
		console.log(cmd);
		console.log('\n\n\n');
		grunt.run(cmd);
		expect(grunt.ifLogic).toHaveBeenCalledWith(cmd, 'command1', true);

	});*/
});






/**
 * not testing doWorkSon as i dont know what to do about the timeout;
 * also may change this to a callback system
 */
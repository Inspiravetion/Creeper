/**
 * Command.js
 * bundles what should happen after running a command with the actual atring command...includes call backs based on what the command is
 */

var exec = require( 'child_process' ).exec;

var Command = function(){
	this.baseCommand  = null;
	this.compCommand  = null;
	this.compString   = null;
	this.trueCommand  = null;
	this.falseCommand = null;
};

exports.constructor = Command;
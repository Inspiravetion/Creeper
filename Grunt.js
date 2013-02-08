var Grunt = function(snitch){
	this._snitch = snitch;
};

Grunt.prototype.doWorkSon = function(cmdList) {
	// systematically run all commands in cmdlist
};

/**
 * This will need to be super verbose depending on what the object has
 * ie. logging versus snitching, notify on pass/fail, and control logic
 * @param  {Command} cmd the command to be run
 * @return {[type]}     [description]
 */
Grunt.prototype.run = function(cmd){
    exec(cmd, function(err, stdout, stderr){
        if(err){
        	//use snitch if need be
            console.log(err);
        }
        else{
        	//use snitch if need be
            console.log(stdout);
        }
    });
}
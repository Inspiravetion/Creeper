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
    //report with snitch where need be
    var self = this;
    exec(cmd.baseCommand, function(err, stdout, stderr){
        if(err || stderr){
            self.report(err || stderr);
        }
        else if(cmd.compCommand || cmd.compString){
            var compare = cmd.compCommand || cmd.compString;
            if(cmd.trueCommand){
                if(cmd.falseCommand){
                    self.ifElse(compare, stdout);
                }
                else{
                    //notify and run true command if it passes
                }
            }
            else{
                //notify the response
            }
        }
    });
};

Grunt.prototype.baseExec = function(cmd, snitchFlag){
    var self = this;
    exec(cmd, function(err, stdout, stderr){
        if(err || stderr){
            self.report(err || stderr);
        }else{
            self.report(stdout);
        }
    });
};

Grunt.prototype.report = function(msg){
    if(this._snitch){
        this._snitch.info(msg);
        console.log(msg);
    }else{
        console.log(msg);
    }
};

Grunt.prototype.ifElse = function(cmd, oldOut){
    exec(cmd.compCommand, function(err, stdout, stderr){
        if(oldOut == stdout){
            self.baseExec(cmd.trueCommand);
        }else{
            self.baseExec(cmd.falseCommand);
        }
    });
};




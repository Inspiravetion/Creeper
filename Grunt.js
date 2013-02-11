var exec = require( 'child_process' ).exec;

var Grunt = function(snitch){
	this._snitch = snitch;
    this._count  = 1;
};

Grunt.prototype.doWorkSon = function(cmdList, offset) {
    this.run(cmdList[offset]);
    offset++;
    var self = this;
    setTimeout(function(){
        if(offset != cmdList.length){
           self.doWorkSon(cmdList, offset);
        }
    }, 20);
};

/**
 * This will need to be super verbose depending on what the object has
 * ie. logging versus snitching, notify on pass/fail, and control logic
 * @param  {Command} cmd the command to be run
 * @return {[type]}     [description]
 */
Grunt.prototype.run = function(cmd){
    var self = this;
    exec(cmd.baseCommand, function(err, stdout, stderr){
        if(err || stderr){
            self.report(err || stderr);
        }
        else if(cmd.compCommand || cmd.compString){
            if(cmd.trueCommand){
                if(cmd.falseCommand){
                    self.ifLogic(cmd, stdout, true);
                }
                else{
                    self.ifLogic(cmd, stdout, false);
                }
            }
            else{
                self.reportExec(cmd, stdout);
            }
        }
        else{
            self.report(stdout);
        }
    });
};

Grunt.prototype.baseExec = function(cmd){
    var self = this;
    exec(cmd, function(err, stdout, stderr){
        if(err || stderr){
            self.report(err || stderr);
        }else{
            self.report(stdout);
        }
    });
};

Grunt.prototype.reportExec = function(cmd, oldOut){
    var self = this,
    compare = cmd.compCommand || cmd.compString;
    exec(compare, function(err, stdout, stderr){
        if(err || stderr){
            self.report(err || stderr);
        }else if(oldOut == stdout){
            self.report('Commands Match');
        }
        else{
            self.report('Commands did not Match');
        }
    });
};

Grunt.prototype.report = function(msg){
    console.log('Command ' + this._count + ':==========================\n');
    this._count++;
    if(this._snitch){
        this._snitch.info(msg);
        console.log(msg);

    }else{
        console.log(msg);
    }
};

Grunt.prototype.ifLogic = function(cmd, oldOut, elseFlag){
    var self    = this,
        compare = cmd.compCommand || cmd.compString;
    exec(compare, function(err, stdout, stderr){
        if(oldOut == stdout){
            self.baseExec(cmd.trueCommand);
        }else if(elseFlag){
            self.baseExec(cmd.falseCommand);
        }
    });
};

exports.instance = function(snitch){
    return new Grunt(snitch);
};

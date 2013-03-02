var exec = require( 'child_process' ).exec;

String.prototype.contains = function(sub) {
    if(this.indexOf(sub) > -1){
        return true;
    }
    return false;
};

var Grunt = function(snitch){
	this._snitch = snitch;
    this._count  = 1;
};

Grunt.prototype.headerString = '\n\
////////////////////////////////////////////////////////////////////\n\
//                       Running Commands...                      //\n\
////////////////////////////////////////////////////////////////////';

Grunt.prototype.doWorkSon = function(cmdList, offset) {
    if(offset == 0){
        console.log(this.headerString);
        this._count = 1;
    }
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
            else if(cmd.falseCommand){
                self.ifLogic(cmd, stdout, true);
            }
            else{
                if(cmd.compString){
                    if(cmd.containsFlag){
                        if(stdout.trim().contains(cmd.compString.trim())){
                            self.report('Command output contains compare string');
                        }
                        else{
                            self.report('Command output does not contain compare string');
                        }
                    }
                    else{
                        if(cmd.compString.trim() == stdout.trim()){
                            self.report('Commands Match')
                        }
                        else{
                            self.report('Commands did not Match');
                        }
                    }
                    return;
                }
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
    var self = this;
    exec(cmd.compCommand, function(err, stdout, stderr){
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
    console.log(this._count + ':-------------------\n');
    this._count++;
    if(this._snitch){
        this._snitch.info(msg);
        console.log(msg);

    }else{
        console.log(msg);
    }
};

Grunt.prototype.ifLogic = function(cmd, oldOut, elseFlag){
    var self    = this;
    //For string compare
    if(cmd.compString){
        //contains compare
        if(cmd.containsFlag){
            console.log(typeof oldOut);
            if(oldOut.trim().contains(cmd.compString.trim())){
                if(cmd.trueCommand){
                    self.baseExec(cmd.trueCommand);
                    return;
                }   
                self.report('Command contains check passed.')
            }
            else if(elseFlag){
                self.baseExec(cmd.falseCommand);
            }
        }
        //strict compare
        else{
            if(oldOut.trim() == cmd.compString.trim()){
                if(cmd.trueCommand){
                    self.baseExec(cmd.trueCommand);
                    return;
                }   
                self.report('Command passed.')
            }
            else if(elseFlag){
                self.baseExec(cmd.falseCommand);
            }
        }
        return;
    }
    //for command result compare
    exec(cmd.compCommand, function(err, stdout, stderr){
        if(err){
            self.report('from ifLogic(): ' + err);
        }
        if(oldOut == stdout){
            if(cmd.trueCommand){
                    self.baseExec(cmd.trueCommand);
                    return;
                }   
                self.report('Command passed.')
            }
            else if(elseFlag){
                self.baseExec(cmd.falseCommand);
            }
    });
};

exports.instance = function(snitch){
    return new Grunt(snitch);
};

exports.constr = Grunt;

var fs      = require( 'fs' ), 
    snitch  = require('./Snitch.js').Snitch,
    grunt   = require('./Grunt.js').instance(snitch),
    interp  = require('./Interpreter.js').instance,
    file    = process.argv[2] ,
    cmdFile = fs.readFileSync(process.argv[3], 'utf8'),
    toggle  = true;    

//Startup Logging==============================================================
console.log( '\n\nCreeping on ' + file ); 
setTimeout(function(){
    snitch.pass('Creeping on ' + file );
}, 200);

//File Watch Logic=============================================================
fs.watch( file, function( evt, filename ) { 
    if(toggle === true){
        var commands = interp.interpret(cmdFile);
        grunt.doWorkSon(commands, 0);
        toggle = false;
    }else{
        toggle = true;
    }
}); 




/*
    2.need to be able to support "contains" pass/fail functionality
    3.queue snitch notifications so that they are all shown
        ->might have to look into the osx-notifier-dependency
    4.make Creeper.js a cli so that you can watch and stop watching files on command
        ->start a child_process and have it listen for messages from this process
        ->funnel child_process stdout to this stdout but with a special color(color node module?)
    5.Start writing tests for all of this shit
    6.allow users to add/remove commands to individual command files via the repl
    */
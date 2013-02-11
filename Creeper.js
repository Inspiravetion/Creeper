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
    1.control logic for string compares
    2.need to be able to support "contains" pass/fail functionality
    3.manage processes so they run in order...queue with callback?
    4.queue snitch notifications so that they are all shown

    */
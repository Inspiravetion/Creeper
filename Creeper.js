var fs     = require( 'fs' ), 
    util   = require( 'util' ), 
    path   = require( 'path' ),
    exec   = require( 'child_process' ).exec, 
    snitch = new (require('./Snitch.js').Snitch)(),
    file   = process.argv[2],
    cmds   = parseCommands(process.argv[3]),
    chng   = 0;

//Startup Logging==============================================================
console.log( '\n\nCreeping on ' + file ); 
setTimeout(function(){
    snitch.pass('Creeping on ' + file );
}, 200);

//File Watch Logic=============================================================
fs.watch( file, function( evt, filename ) { 
    chng++;
    util.puts(evt + ' ' + chng + ':-----------------------------------------');
    for(cmd in cmds){
        run(cmds[cmd], snitch);
    }
}); 

//Shouldnt need this (Grunt.js)
/*function run(cmd, snitch){
    exec(cmd, function(err, stdout, stderr){
        if(err){
            console.log(err);
        }
        else{
            console.log(stdout);
        }
    });
}*/

//Shouldnt need this (Interpreter.js)
/*function parseCommands(path){
    return fs.readFileSync(path, 'utf8').split('\n');
}*/







/*
    2.control logic
    3.manage processes so its not a thousand random ones springing up
    4.try savinf the child process and only running exec on one.
    5.queue snitch notifications so that they are all shown

    */
var clearLine = '\u001B[0K',
	rewindcursor = '\u001B[8;0f';

for(var i = 0; i < 7; i++){
	console.log(i);
}
process.stdout.write(clearLine + rewindcursor);
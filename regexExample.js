var baseCommand = '{command 1}',
	reg = /^\{(.*)\}/,
	match = reg.exec(baseCommand);
console.log(match[1]);

var compCommand = '{{command1}{command2}}',
	cCReg = /^\{\{(.*)\}\{(.*)\}\}/,
	compMatch = cCReg.exec(compCommand);
console.log(compMatch);

var compStrCommand = '{{command1}(command2)}',
	cStrReg = /^\{\{(.*)\}\((.*)\)\}/,
	compMatch = cStrReg.exec(compStrCommand);
console.log(compMatch);

var strContCommand = '{{command1}((command2))}',
	contReg = /^\{\{(.*)\}\(\((.*)\)\)\}/,
	compMatch = contReg.exec(strContCommand);
console.log(compMatch);

var ifCommand = '{{command1}((command2))}{\ncommand3\n}',
	ifReg = /^\{\{(.*)\}\(\((.*)\)\)\}\{\n*(.*)\n*\}/,
	compMatch = ifReg.exec(ifCommand);
console.log(compMatch);
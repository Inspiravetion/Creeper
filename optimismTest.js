var op = require('optimist'),
	str = '-if command1 -passes -thenrun command2 -elserun command3',
	parsed = op.parse(str.replace(/-/g, '--', 'g').split(' '));
console.info(parsed);
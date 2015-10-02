"use strict";
/*
	Generate a file containing React.DOM.* functions.
	
	This allows the compiler to not depend on  React,
	which is especially important when running in a
	browser.
*/
var fs = require("fs");
var path = require("path");
var React = require("react");

var count,key,output,target;

target = process.argv[2];
if (target === undefined) throw Error("target not defined: npm run react-dom path/to/target.js");
target = path.resolve(target);

output = '"use strict";\n\n';
output += '// Generated via ' + path.relative(path.dirname(target), __filename) + '\n';
output += 'module.exports = \n';
output += '{';

count = 0;

for (key in React.DOM)
{
	if (count++ > 0) output += ',';
	
	output += '\n\t"'+ key +'": true';
}

output += '\n};\n';

fs.writeFileSync(target, output);

console.log("File written:\n" + target);

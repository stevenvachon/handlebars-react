"use strict";
var objectAssign = require("object-assign");
var parser = require("handlebars-html-parser");
var React = require("react");
var uglify = require("uglify-js");

var defaultOptions = 
{
	beautify: true,
	prefix: "",
	suffix: ""
};

var createElementFunction = 'React.createElement(';



/*var NodeType = 
{
	ATTR_NAME: "attrName",
	ATTR_VALUE: "attrValue",
	
	TAG_NAME: "tagName"
	
	HBS_EXPRESSION: "hbsExpression",
	
	HBS_EXPRESSION_END:        "hbsExpressionEnd",
	HBS_EXPRESSION_HASH_PARAM: "hbsExpressionHashParam",
	HBS_EXPRESSION_PARAM:      "hbsExpressionParam",
	HBS_EXPRESSION_PATH:       "hbsExpressionPath",
	HBS_EXPRESSION_START:      "hbsExpressionStart",
	HBS_TAG_END:               "hbsTagEnd",
	HBS_TAG_START:             "hbsTagStart",
	
	HTML_ATTR_END:             "htmlAttrEnd",
	HTML_ATTR_NAME_END:        "htmlAttrNameEnd",
	HTML_ATTR_NAME_START:      "htmlAttrNameStart",
	HTML_ATTR_START:           "htmlAttrStart",
	HTML_ATTR_VALUE_END:       "htmlAttrValueEnd",
	HTML_ATTR_VALUE_START:     "htmlAttrValueStart",
	HTML_COMMENT_END:          "htmlCommentEnd",
	HTML_COMMENT_START:        "htmlCommentStart",
	HTML_TAG_END:              "htmlTagEnd",
	HTML_TAG_NAME_END:         "htmlTagNameEnd",
	HTML_TAG_NAME_START:       "htmlTagNameStart",
	HTML_TAG_START:            "htmlTagStart",
	
	TEXT: "text"
};*/



function compiler(options)
{
	this.options = objectAssign({}, defaultOptions, options);
	
	this.parser = new parser(this.options);
}



compiler.prototype.compile = function(str)
{
	var attrCount,childrenCount/*,state*/;
	//var elementStack = [];
	var nodeStack = this.parser.parse(str);
	var result = [];
	
	console.log(nodeStack);
	
	nodeStack.forEach( function(node, nodeIndex)
	{
		switch (node.type)
		{
			case parser.type.HBS_EXPRESSION_END:
			{
				break;
			}
			case parser.type.HBS_EXPRESSION_START:
			{
				break;
			}
			
			
			case parser.type.HBS_EXPRESSION_HASH_PARAM:
			{
				break;
			}
			
			
			case parser.type.HBS_EXPRESSION_PARAM:
			{
				break;
			}
			
			
			case parser.type.HBS_EXPRESSION_PATH:
			{
				break;
			}
			
			
			case parser.type.HTML_ATTR_END:
			{
				break;
			}
			case parser.type.HTML_ATTR_START:
			{
				append(',', result);
				
				if (attrCount++ === 0)
				{
					//state = "attrs";
					append('{', result);
				}
				
				break;
			}
			
			
			case parser.type.HTML_ATTR_NAME_END:
			{
				break;
			}
			case parser.type.HTML_ATTR_NAME_START:
			{
				break;
			}
			
			
			case parser.type.HTML_ATTR_VALUE_END:
			{
				break;
			}
			case parser.type.HTML_ATTR_VALUE_START:
			{
				append(':', result);
				break;
			}
			
			
			case parser.type.HTML_COMMENT_END:
			{
				break;
			}
			case parser.type.HTML_COMMENT_START:
			{
				break;
			}
			
			
			case parser.type.HTML_TAG_END:
			{
				append( closeAttrs(nodeStack, nodeIndex), result );
				
				if (isClosingTag(nodeStack, nodeIndex, -4) === true)
				{
					append(')', result);
				}
				
				break;
			}
			case parser.type.HTML_TAG_START:
			{
				if (node.closing !== true)
				{
					attrCount = 0;
					childrenCount = 0;
					append( prefix(nodeStack, nodeIndex), result );
					append( createElementFunction, result );
				}
				
				break;
			}
			
			
			case parser.type.HTML_TAG_NAME_END:
			{
				break;
			}
			case parser.type.HTML_TAG_NAME_START:
			{
				break;
			}
			
			
			case parser.type.TEXT:
			{
				if (isClosingTag(nodeStack, nodeIndex, -2) !== true)
				{
					//if (changeTagFunction(nodeStack, nodeIndex, node.value, result) === false)
					//{
						append( prefix(nodeStack, nodeIndex), result );
						append( '"'+ node.value +'"', result );
					//}
				}
				
				break;
			}
			
			
			default:
			{
				// oops?
			}
		}
	});
	
	return finalize(result, this.options);
};



function append(string, resultArray)
{
	if (string != null && string !== "")
	{
		resultArray.push(string);
	}
}



function changeTagFunction(nodeStack, nodeIndex, tagName, resultArray)
{
	var lastResultIndex;
	
	// If we're defining a tag name
	if (previousNode(nodeStack,nodeIndex).type === parser.type.HTML_TAG_NAME_START)
	{
		lastResultIndex = resultArray.length-1;
		
		// If last result index is `React.createElement`
		if (resultArray[lastResultIndex] === createElementFunction)
		{
			tagName = tagName.toLowerCase();
			
			// If tag name has a `React.DOM` function
			if (typeof React.DOM[tagName] === "function")
			{
				resultArray[lastResultIndex] = 'React.DOM.' + tagName + '(';
				return true;
			}
		}
	}
	
	return false;
}



function closeAttrs(nodeStack, nodeIndex)
{
	var prevNode = previousNode(nodeStack, nodeIndex);
	
	if (prevNode !== undefined)
	{
		if (prevNode.type === parser.type.HTML_ATTR_END)
		{
			return '}';
		}
	}
	
	return '';
}



function finalize(resultArray, options)
{
	var js = options.prefix + resultArray.join("") + options.suffix;
	
	// Check that the compiled JavaScript code is valid
	try
	{
		Function("", js);
	}
	catch (error)
	{
		console.log(js);
		throw error;
	}
	
	if (options.beautify === true)
	{
		js = uglify.parse(js).print_to_string(
		{
			beautify: true,
			comments: true,
			indent_level: 2
		});
	}
	
	return js;
}



function isClosingTag(nodeStack, nodeIndex, numPrev)
{
	var twoNodesBack = previousNode(nodeStack, nodeIndex, numPrev);
	
	if (twoNodesBack !== undefined)
	{
		if (twoNodesBack.type===parser.type.HTML_TAG_START && twoNodesBack.closing===true)
		{
			return true;
		}
	}
	
	return false;
}



function previousNode(nodeStack, nodeIndex, numPrev)
{
	//if (nodeIndex >= 0)
	//{
		if (numPrev == null) numPrev = -1;
		
		return nodeStack[ nodeIndex + numPrev ];
	//}
}



/*
	Possibly add a prefixed "," or "+".
*/
function prefix(nodeStack, nodeIndex)
{
	var prevNode = previousNode(nodeStack, nodeIndex);
	
	//console.log(prevNode)
	
	if (prevNode !== undefined)
	{
		if (prevNode.type===parser.type.HTML_TAG_END || prevNode.type===parser.type.TEXT)
		{
			return ',';
		}
	}
	
	return '';
}



module.exports = compiler;

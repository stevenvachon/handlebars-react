"use strict";
var parser = require("handlebars-html-parser");



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
	this.parser = new parser(options);
}



compiler.prototype.compile = function(str)
{
	var attrCount,childrenCount/*,state*/;
	//var elementStack = [];
	var nodeStack = this.parser.parse(str);
	var result = '';
	
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
				result += ',';
				if (attrCount++ === 0)
				{
					//state = "attrs";
					result += '{';
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
				result += ':';
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
				result += closeAttrs(nodeStack, nodeIndex);
				if (isClosingTag(nodeStack,nodeIndex,-4) === true)
				{
					result += ')';
				}
				break;
			}
			case parser.type.HTML_TAG_START:
			{
				if (node.closing !== true)
				{
					attrCount = 0;
					childrenCount = 0;
					result += prefix(nodeStack, nodeIndex);
					result += 'React.createElement(';
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
				if (isClosingTag(nodeStack,nodeIndex,-2) !== true)
				{
					result += prefix(nodeStack, nodeIndex);
					result += '"'+ node.value +'"';
				}
				break;
			}
			
			
			default:
			{
				// oops?
			}
		}
	});
	
	return result;
};



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

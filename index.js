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
	var elementStack = [];
	var result = '';
	
	var temp = this.parser.parse(str);
	//console.log(temp);
	
	temp.forEach( function(node)
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
				//if (node.closing === true)
				//{
					result += ')';
				//}
				break;
			}
			case parser.type.HTML_TAG_START:
			{
				result += prefix(elementStack);
				result += 'React.createElement(';
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
				result += prefix(elementStack);
				result += '"'+ node.value +'"';
				break;
			}
			
			
			default:
			{
				// oops?
			}
		}
		
		//if (node.type!==parser.type.HTML_TAG
		//{
			elementStack.push(node.type);
		//}
	});
	
	return result;
};



function lastNode(elementStack)
{
	if (elementStack.length > 0)
	{
		return elementStack[ elementStack.length-1 ];
	}
}



/*
	Possibly add a prefixed "," or "+".
*/
function prefix(elementStack)
{
	var prevNode = lastNode(elementStack);
	
	//console.log(prevNode)
	
	if (prevNode !== undefined)
	{
		if (prevNode===parser.type.HTML_TAG_END || prevNode===parser.type.TEXT)
		{
			return ',';
		}
	}
	
	return '';
}



module.exports = compiler;
